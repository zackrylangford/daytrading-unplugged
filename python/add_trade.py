import json
import boto3
import csv
from io import StringIO
from datetime import datetime
import pytz

s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
table_name = 'zacks-trade-data'
table = dynamodb.Table(table_name)

# Define the timezones
eastern = pytz.timezone('US/Eastern')

# Mapping for contract names
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

def get_contract_name(contract):
    for key in contract_mapping.keys():
        if contract.startswith(key):
            return contract_mapping[key]
    return contract

def lambda_handler(event, context):
    # Get the S3 bucket and object key from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']
    
    # Read the CSV file from S3
    csv_file = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    csv_content = csv_file['Body'].read().decode('utf-8')
    
    # Process the CSV content
    csv_reader = csv.DictReader(StringIO(csv_content))
    trades = []
    for row in csv_reader:
        entered_at = datetime.fromisoformat(row['EnteredAt']).astimezone(eastern)
        exited_at = datetime.fromisoformat(row['ExitedAt']).astimezone(eastern)
        net_pnl = float(row['PnL']) - float(row['Fees'])
        contract_name = get_contract_name(row['ContractName'])
        
        trade = {
            'TradeId': row['Id'],
            'ContractName': contract_name,
            'EnteredAt': entered_at.isoformat(),
            'ExitedAt': exited_at.isoformat(),
            'EntryPrice': float(row['EntryPrice']),
            'ExitPrice': float(row['ExitPrice']),
            'Size': int(row['Size']),
            'Fees': float(row['Fees']),
            'PnL': float(row['PnL']),
            'NetPnL': net_pnl,
            'Type': row['Type'],
            'TradeDay': row['TradeDay']
        }
        trades.append(trade)
    
    # Write the trades to DynamoDB
    with table.batch_writer() as batch:
        for trade in trades:
            batch.put_item(Item=trade)
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Successfully processed {len(trades)} trades.')
    }
