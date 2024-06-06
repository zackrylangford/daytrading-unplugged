import pandas as pd
from collections import defaultdict

# Load the CSV file
df = pd.read_csv('latest_trades.csv')

# Convert EnteredAt and ExitedAt to datetime
df['EnteredAt'] = pd.to_datetime(df['EnteredAt'])
df['ExitedAt'] = pd.to_datetime(df['ExitedAt'])

# Group trades by ContractName, TradeDay, and EnteredAt
grouped = df.groupby(['ContractName', 'TradeDay', 'EnteredAt'])

# Function to aggregate trades
def aggregate_trades(group):
    result = {
        'ContractName': group['ContractName'].iloc[0],
        'TradeDay': group['TradeDay'].iloc[0],
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

# Print the results to the terminal
print(aggregated_df)
