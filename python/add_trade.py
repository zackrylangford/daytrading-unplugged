import json
import boto3
import logging
from io import StringIO
from datetime import datetime
import pytz
import uuid
from decimal import Decimal, getcontext, Inexact, Rounded
import pandas as pd
from boto3.dynamodb.conditions import Key

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

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

def custom_trading_day(dt):
    if dt.time() >= datetime.strptime('16:00:00', '%H:%M:%S').time():
        return (dt + pd.Timedelta(days=1)).date()
    else:
        return dt.date()

def aggregate_trades(group):
    result = {
        'id': str(uuid.uuid4()),
        'ContractName': group['ContractName'].iloc[0],
        'FullContractName': group['FullContractName'].iloc[0],
        'CustomTradeDay': str(group['CustomTradeDay'].iloc[0]),
        'EnteredAt': group['EnteredAt'].iloc[0].isoformat(),
        'ExitedAt': group['ExitedAt'].max().isoformat(),
        'EntryPrice': Decimal((group['EntryPrice'] * group['Size']).sum() / group['Size'].sum()).quantize(Decimal('0.01')),
        'ExitPrice': Decimal((group['ExitPrice'] * group['Size']).sum() / group['Size'].sum()).quantize(Decimal('0.01')),
        'TotalSize': int(group['Size'].sum()),
        'TotalFees': Decimal(group['Fees'].sum()).quantize(Decimal('0.01')),
        'TotalPnL': Decimal(group['PnL'].sum()).quantize(Decimal('0.01')),
        'NetPnL': Decimal(group['PnL'].sum() - group['Fees'].sum()).quantize(Decimal('0.01')),
        'Type': group['Type'].iloc[0]
    }
    return result

def lambda_handler(event, context):
    logger.info('Event structure: %s', json.dumps(event, indent=2))
    
    # Set decimal context to ignore Inexact and Rounded flags
    getcontext().traps[Inexact] = False
    getcontext().traps[Rounded] = False
    
    try:
        # Get the S3 bucket and object key from the event
        bucket_name = event['Records'][0]['s3']['bucket']['name']
        object_key = event['Records'][0]['s3']['object']['key']
        
        logger.info('Processing file from bucket: %s, key: %s', bucket_name, object_key)
        
        # Read the CSV file from S3
        csv_file = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        csv_content = csv_file['Body'].read().decode('utf-8')
        
        # Process the CSV content
        df = pd.read_csv(StringIO(csv_content))
        
        # Convert EnteredAt and ExitedAt to datetime
        df['EnteredAt'] = pd.to_datetime(df['EnteredAt'])
        df['ExitedAt'] = pd.to_datetime(df['ExitedAt'])
        
        # Convert to Eastern Time (ET) directly
        df['EnteredAt'] = df['EnteredAt'].dt.tz_convert(eastern)
        df['ExitedAt'] = df['ExitedAt'].dt.tz_convert(eastern)
        
        # Apply the custom trading day function
        df['CustomTradeDay'] = df['EnteredAt'].apply(custom_trading_day)
        
        # Apply the contract mapping function
        df['FullContractName'] = df['ContractName'].apply(get_contract_name)
        
        # Group trades by ContractName, CustomTradeDay, and EnteredAt
        grouped = df.groupby(['FullContractName', 'CustomTradeDay', 'EnteredAt'])
        
        # Apply the aggregation function
        aggregated_trades = grouped.apply(aggregate_trades).tolist()

        # Track days already in the table
        existing_days = set()

        # Query existing trade days to avoid duplicates
        for trade in aggregated_trades:
            if trade['CustomTradeDay'] not in existing_days:
                response = table.query(
                    IndexName='CustomTradeDay-index',
                    KeyConditionExpression=Key('CustomTradeDay').eq(trade['CustomTradeDay'])
                )
                if response['Count'] > 0:
                    existing_days.add(trade['CustomTradeDay'])

        # Write new trades to DynamoDB
        with table.batch_writer() as batch:
            for trade in aggregated_trades:
                if trade['CustomTradeDay'] not in existing_days:
                    batch.put_item(Item=trade)
        
        logger.info('Successfully processed %d trades.', len(aggregated_trades))
        return {
            'statusCode': 200,
            'body': json.dumps(f'Successfully processed {len(aggregated_trades)} trades.')
        }
    
    except Exception as e:
        logger.error('Error processing file: %s', str(e))
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error processing file: {str(e)}')
        }
