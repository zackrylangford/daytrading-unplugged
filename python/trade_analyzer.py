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

# Write the results to a new CSV file
aggregated_df.to_csv('aggregated_trades.csv', index=False)

# Create a Markdown document
markdown_content = "# Trade Summary Report\n"

# Generate a summary report for each trading day with detailed trades listed
for custom_trade_day, group in aggregated_df.groupby('CustomTradeDay'):
    total_pnl = group['TotalPnL'].sum()
    total_fees = group['TotalFees'].sum()
    num_trades = len(group)
    net_total = total_pnl - total_fees
    
    markdown_content += f"## Trading Day: {custom_trade_day}\n"
    markdown_content += f"- **Total PnL:** {total_pnl:.2f}\n"
    markdown_content += f"- **Total Fees:** {total_fees:.2f}\n"
    markdown_content += f"- **Number of Trades:** {num_trades}\n"
    markdown_content += f"- **Net Total:** {net_total:.2f}\n"
    markdown_content += "\n"
    
    # List detailed trades for the day
    for _, trade in group.iterrows():
        entered_time = trade['EnteredAt'].strftime('%H%M')
        exited_time = trade['ExitedAt'].strftime('%H%M')
        trade_details = (
            f"- EnteredAt: {entered_time}, ExitedAt: {exited_time}, "
            f"EntryPrice: {trade['EntryPrice']:.2f}, ExitPrice: {trade['ExitPrice']:.2f}, "
            f"Size: {trade['TotalSize']}, Fees: {trade['TotalFees']:.2f}, "
            f"PnL: {trade['TotalPnL']:.2f}, Net: {trade['TotalPnL'] - trade['TotalFees']:.2f}, "
            f"Type: {trade['Type']}"
        )
        markdown_content += trade_details + "\n"
    
    markdown_content += "\n" + "-" * 40 + "\n\n"

# Save the Markdown document
with open('trade_summary_report.md', 'w') as f:
    f.write(markdown_content)

# Print the summary reports to the terminal
for custom_trade_day, group in aggregated_df.groupby('CustomTradeDay'):
    total_pnl = group['TotalPnL'].sum()
    total_fees = group['TotalFees'].sum()
    num_trades = len(group)
    net_total = total_pnl - total_fees
    
    report = f"Trading Day: {custom_trade_day}\n"
    report += f"Total PnL: {total_pnl:.2f}\n"
    report += f"Total Fees: {total_fees:.2f}\n"
    report += f"Number of Trades: {num_trades}\n"
    report += f"Net Total: {net_total:.2f}\n"
    report += "-" * 40 + "\n"
    
    # List detailed trades for the day
    for _, trade in group.iterrows():
        entered_time = trade['EnteredAt'].strftime('%H%M')
        exited_time = trade['ExitedAt'].strftime('%H%M')
        trade_details = (
            f"EnteredAt: {entered_time}, ExitedAt: {exited_time}, "
            f"EntryPrice: {trade['EntryPrice']:.2f}, ExitPrice: {trade['ExitPrice']:.2f}, "
            f"Size: {trade['TotalSize']}, Fees: {trade['TotalFees']:.2f}, "
            f"PnL: {trade['TotalPnL']:.2f}, Net: {trade['TotalPnL'] - trade['TotalFees']:.2f}, "
            f"Type: {trade['Type']}"
        )
        report += trade_details + "\n"
    
    report += "-" * 40 + "\n"
    print(report)
