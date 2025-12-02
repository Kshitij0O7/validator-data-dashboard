# Get Staking Data - Ethereum Validator Rewards Tracker

A powerful Next.js application for tracking and monitoring **Ethereum validator rewards** and **staking rewards**. This tool provides real-time insights into validator performance, balance changes, and staking earnings on the Ethereum network.

## 🎯 Overview

**Get Staking Data** is designed for staking pools, validator operators, and DeFi platforms that need comprehensive tracking of **Ethereum validators** and their **staking rewards**. Monitor validator performance, analyze historical rewards data, and export transaction data for further analysis.

### Key Features

- **📊 Validator Rewards Tracking**: Monitor real-time staking rewards and validator earnings
- **💰 Balance Monitoring**: Track latest balance and balance changes over 24 hours
- **📈 Historical Analysis**: View detailed transaction history with rewards in ETH and USD
- **📥 CSV Export**: Download validator rewards data for analysis
- **🔍 Search & Filter**: Easily search and track specific validator addresses
- **📱 Responsive Design**: Modern, mobile-friendly interface

## 🚀 Getting Started

### Final Output
<img width="2940" height="1664" alt="image" src="https://github.com/user-attachments/assets/78e962d7-9be2-4721-a018-31573e018041" />

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Bitquery API token (get one [here](https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd get-staking-data
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```bash
BITQUERY_TOKEN=your_bitquery_token_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Tracking Validator Rewards

1. Enter a validator address in the search bar on the landing page
2. View the validator's latest balance and balance from 24 hours ago
3. Browse the transaction table with detailed reward information:
   - Block Time
   - Post Balance
   - Pre Balance
   - Rewards in ETH
   - Rewards in USD
   - Transaction Signature (linked to Etherscan)

### Pagination

- Use the pagination controls to navigate through transaction data
- Select from 10, 25, 50, 100, or 200 entries per page
- Default: 10 entries per page
- Transactions are sorted in descending order (newest first)

### Exporting Data

1. Click the "Download .csv" button
2. Fill out the contact form with your details
3. The CSV file will be automatically downloaded with all transaction data

## 🔑 Getting Your Bitquery API Token

This application uses [Bitquery's Ethereum Validator Balance Tracker API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/#filter-by-validator-address?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv) to fetch validator rewards data.

### Steps to Get Started:

1. **Sign up** at [Bitquery IDE](https://ide.bitquery.io?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv)
2. **Generate your Access Token** at [Bitquery Access Tokens](https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv)
3. **Learn about Validator Rewards API** in the [documentation](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/#filter-by-validator-address?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv)
4. Add your token to `.env.local` as `BITQUERY_TOKEN`

## 🏗️ Built With

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[staking-rewards-api](https://www.npmjs.com/package/staking-rewards-api)** - SDK for validator rewards data
- **[Bitquery API](https://bitquery.io/?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv)** - Blockchain data infrastructure

## 📊 Use Cases

### For Staking Pools

- **Performance Monitoring**: Track validator rewards and earnings in real-time
- **Portfolio Management**: Monitor multiple validators and their performance
- **Data Analysis**: Export CSV data for detailed analysis and reporting

### For Validator Operators

- **Earnings Tracking**: Monitor your validator's staking rewards
- **Performance Analysis**: Analyze historical performance and trends
- **Transaction History**: View detailed transaction records with Etherscan links

### For DeFi Platforms

- **Analytics Integration**: Use exported data for analytics dashboards
- **APY Calculations**: Calculate accurate APY based on real validator performance
- **Risk Assessment**: Evaluate validator reliability and performance metrics

## 🔗 Resources

- [Bitquery IDE](https://ide.bitquery.io?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv) - GraphQL IDE for blockchain data
- [Bitquery Access Tokens](https://account.bitquery.io/user/api_v2/access_tokens?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv) - Get your API token
- [Ethereum Validator Balance Tracker API](https://docs.bitquery.io/docs/blockchain/Ethereum/balances/transaction-balance-tracker/eth-validator-balance-tracker/#filter-by-validator-address?utm_source=github&utm_medium=refferal&utm_campaign=get_staking_data_csv) - API documentation

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 🌟 Keywords

**Staking**, **Validators**, **Validator Rewards**, **Staking Rewards**, **Ethereum**, **Ethereum Validators**, **Ethereum Staking**, **Blockchain Analytics**, **DeFi**, **Staking Pools**, **Validator Performance**, **Rewards Tracking**, **Ethereum Staking Rewards**, **Validator Balance Tracker**

---

**Made with ❤️ for the Ethereum staking community**

*Empowering staking pools and validator operators with actionable blockchain insights.*
