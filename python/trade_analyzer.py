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

# Define a mapping of contract abbreviations to full names
contract_mapping = {
    'ES': 'E-mini S&P',
    'GC': 'Gold',
    'MGC': 'Micro Gold',
    'NQ': 'E-mini NASDAQ',
    'MNQ': 'Micro E-mini NASDAQ',
    'CL': 'Crude Oil',
    'MCL': 'Micro Crude Oil',
    'YM': 'E-mini Dow',
    'MYM': 'Micro E-mini Dow',
    'RTY': 'E-mini Russell',
    'M2K': 'Micro E-mini Russell',
    'ZB': 'US Treasury Bond',
    'ZF': '5-Year US Treasury Note',
    'ZN': '10-Year US Treasury Note',
    'ZT': '2-Year US Treasury Note'
}

# Function to extract the contract prefix from the contract name
def get_contract_name(contract):
    for key in contract_mapping.keys():
        if contract.startswith(key):
            return contract_mapping[key]
    return contract

# Apply the contract mapping function
df['FullContractName'] = df['ContractName'].apply(get_contract_name)

# Group trades by ContractName, CustomTradeDay, and EnteredAt
grouped = df.groupby(['FullContractName', 'CustomTradeDay', 'EnteredAt'])

# Function to aggregate trades
def aggregate_trades(group):
    result = {
        'ContractName': group['ContractName'].iloc[0],
        'FullContractName': group['FullContractName'].iloc[0],
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
html_content += "<tr><th>Entered At</th><th>Exited At</th><th>Entry Price</th><th>Exit Price</th><th>Size</th><th>Fees</th><th>PnL</th><th>Net</th><th>Type</th><th>Contract</th><th>W/L</th></tr>\n"
html_content += "</thead>\n"
html_content += "<tbody>\n"

for _, trade in aggregated_df.iterrows():
    entered_time = trade['EnteredAt'].strftime('%I:%M %p (ET)')
    exited_time = trade['ExitedAt'].strftime('%I:%M %p (ET)')
    net_pnl = trade['TotalPnL'] - trade['TotalFees']
    wl_class = 'win' if net_pnl >= 0 else 'loss'
    trade_details = (
        f"<tr class=\"{wl_class}\"><td>{entered_time}</td><td>{exited_time}</td><td>{trade['EntryPrice']:.2f}</td><td>{trade['ExitPrice']:.2f}</td>"
        f"<td>{trade['TotalSize']}</td><td>{trade['TotalFees']:.2f}</td><td>{trade['TotalPnL']:.2f}</td>"
        f"<td>{net_pnl:.2f}</td><td>{trade['Type']}</td><td>{trade['FullContractName']}</td><td>{'W' if net_pnl >= 0 else 'L'}</td></tr>"
    )
    html_content += trade_details + "\n"

html_content += "</tbody>\n"
html_content += "</table>\n"

# Save the HTML content to a file
with open('trade_summary_table.html', 'w') as f:
    f.write(html_content)

# Print the HTML table to the terminal
print(html_content)
