import pandas as pd
from collections import defaultdict
import pytz

# Load the CSV file
df = pd.read_csv('latest_trades.csv')

# Convert EnteredAt and ExitedAt to datetime
df['EnteredAt'] = pd.to_datetime(df['EnteredAt'])
df['ExitedAt'] = pd.to_datetime(df['ExitedAt'])

# Define the timezones
central = pytz.timezone('US/Central')
eastern = pytz.timezone('US/Eastern')

# Convert to Eastern Time (ET) directly
df['EnteredAt'] = df['EnteredAt'].dt.tz_convert(eastern)
df['ExitedAt'] = df['ExitedAt'].dt.tz_convert(eastern)

# Define a function to assign custom trading days
def custom_trading_day(dt):
    if dt.time() >= pd.Timestamp('16:00:00').time():
        return (dt + pd.Timedelta(days=1)).date()
    else:
        return dt.date()

# Apply the custom trading day function
df['CustomTradeDay'] = df['EnteredAt'].apply(custom_trading_day)

# Group trades by ContractName, CustomTradeDay, and EnteredAt
grouped = df.groupby(['ContractName', 'CustomTradeDay', 'EnteredAt'])

# Function to aggregate trades
def aggregate_trades(group):
    result = {
        'ContractName': group['ContractName'].iloc[0],
        'CustomTradeDay': group['CustomTradeDay'].iloc[0],
        'EnteredAt': group['EnteredAt'].iloc[0],
        'ExitedAt': group['ExitedAt'].max(),  # Use the latest exit time
        'EntryPrice': (group['EntryPrice'] * group['Size']).sum() / group['Size'].sum(),
        'ExitPrice': (group['ExitPrice'] * group['Size']).sum() / group['Size'].sum(),
        'TotalSize': group['Size'].sum(),
        'TotalFees': group['Fees'].sum(),
        'TotalPnL': group['PnL'].sum(),
        'Type': group['Type'].iloc[0]
    }
    return pd.Series(result)

# Apply the aggregation function
aggregated_df = grouped.apply(aggregate_trades).reset_index(drop=True)

# Sort the aggregated DataFrame by EnteredAt date from most recent to earliest
aggregated_df = aggregated_df.sort_values(by='EnteredAt', ascending=False)

# Generate the HTML table content
html_content = "<table class=\"trade-table\">\n"
html_content += "<thead>\n"
html_content += "<tr><th>Entered At</th><th>Exited At</th><th>Entry Price</th><th>Exit Price</th><th>Size</th><th>Fees</th><th>PnL</th><th>Net</th><th>Type</th></tr>\n"
html_content += "</thead>\n"
html_content += "<tbody>\n"

for _, trade in aggregated_df.iterrows():
    entered_time = trade['EnteredAt'].strftime('%I:%M %p (ET)')
    exited_time = trade['ExitedAt'].strftime('%I:%M %p (ET)')
    trade_details = (
        f"<tr><td>{entered_time}</td><td>{exited_time}</td><td>{trade['EntryPrice']:.2f}</td><td>{trade['ExitPrice']:.2f}</td>"
        f"<td>{trade['TotalSize']}</td><td>{trade['TotalFees']:.2f}</td><td>{trade['TotalPnL']:.2f}</td>"
        f"<td>{trade['TotalPnL'] - trade['TotalFees']:.2f}</td><td>{trade['Type']}</td></tr>"
    )
    html_content += trade_details + "\n"

html_content += "</tbody>\n"
html_content += "</table>\n"

# Save the HTML content to a file
with open('trade_summary_table.html', 'w') as f:
    f.write(html_content)

# Print the HTML table to the terminal
print(html_content)
