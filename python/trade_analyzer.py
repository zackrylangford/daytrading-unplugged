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

# Generate a summary report for each trading day with detailed trades listed
summary_reports = []

for custom_trade_day, group in aggregated_df.groupby('CustomTradeDay'):
    total_pnl = group['TotalPnL'].sum()
    total_fees = group['TotalFees'].sum()
    num_trades = len(group)
    avg_entry_price = group['EntryPrice'].mean()
    avg_exit_price = group['ExitPrice'].mean()
    
    report = f"Trading Day: {custom_trade_day}\n"
    report += f"Total PnL: {total_pnl:.2f}\n"
    report += f"Total Fees: {total_fees:.2f}\n"
    report += f"Number of Trades: {num_trades}\n"
    report += f"Average Entry Price: {avg_entry_price:.2f}\n"
    report += f"Average Exit Price: {avg_exit_price:.2f}\n"
    report += "-" * 40 + "\n"
    
    # List detailed trades for the day
    for _, trade in group.iterrows():
        trade_details = (
            f"EnteredAt: {trade['EnteredAt']}, ExitedAt: {trade['ExitedAt']}, "
            f"EntryPrice: {trade['EntryPrice']:.2f}, ExitPrice: {trade['ExitPrice']:.2f}, "
            f"Size: {trade['TotalSize']}, Fees: {trade['TotalFees']:.2f}, "
            f"PnL: {trade['TotalPnL']:.2f}, Type: {trade['Type']}"
        )
        report += trade_details + "\n"
    
    report += "-" * 40 + "\n"
    summary_reports.append(report)

# Print the summary reports to the terminal
for report in summary_reports:
    print(report)
