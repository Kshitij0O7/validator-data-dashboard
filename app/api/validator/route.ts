import { NextRequest, NextResponse } from 'next/server';

// Custom query to get individual transaction rewards (not aggregated)
const getValidatorRewardsQuery = (address: string, hoursAgo: number = 24) => {
  return `
    query MyQuery {
      EVM(network: eth, dataset: realtime) {
        TransactionBalances(
          where: {
            TokenBalance: {
              BalanceChangeReasonCode: { eq: 5 }
              Address: { is: "${address}" }
            }
            Block: { Time: { since_relative: { hours_ago: ${hoursAgo} } } }
          }
          orderBy: { ascending: Block_Time }
        ) {
          Block {
            Time
            Number
          }
          TokenBalance {
            Address
            PostBalance
            PreBalance
            PostBalanceInUSD
            PreBalanceInUSD
          }
          Transaction {
            Hash
          }
          reward: calculate(expression: "$TokenBalance_PostBalance - $TokenBalance_PreBalance")
          reward_usd: calculate(expression: "$TokenBalance_PostBalanceInUSD - $TokenBalance_PreBalanceInUSD")
        }
      }
    }
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: 'Validator address is required' },
        { status: 400 }
      );
    }

    const token = process.env.BITQUERY_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'BITQUERY_TOKEN environment variable is not set' },
        { status: 500 }
      );
    }

    const query = getValidatorRewardsQuery(address, 24);

    const response = await fetch('https://streaming.bitquery.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: '{}',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || 'Query error' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

