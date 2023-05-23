# tEVMOS Delegator Application

## Introduction

This React application is designed to provide an easy-to-use interface for delegating tokens on the EVMOS Testnet. It offers a high degree of flexibility and control to users, allowing them to balance their delegations across multiple validators according to their preferences.

## How the App Works

This application allows users to:

1. **Delegate tokens:** Users can delegate a specified amount of tEVMOS tokens across multiple validators.
2. **Select validators:** Users can choose validators to delegate their tokens to. This selection can be done manually or based on certain criteria such as their commission rates, their token amount, or their jail status.
3. **Fetch and display data:** The application fetches and displays relevant data about validators and the user's delegations. This includes details about each validator (like their moniker, tokens, and commission rate), as well as the amount of tokens that the user has delegated to each validator.

The interface is clean and straightforward, with interactive elements like checkboxes for selecting validators and switch buttons for applying filters.

## Core Functionality

### Setting Delegation Amount and Number of Validators

Users can set the amount of tokens they want to delegate and specify the number of validators they want to delegate to. There's also a "MAX" button that sets the input to the maximum available amount.

### Delegating to Validators

The validators can be selected based on certain groups: 'top', 'median', 'bottom', and 'random'. Users can also choose to delegate tokens within a specific percentile range.

### Sorting and Filtering

Users can sort validators based on their commission rates or their token amounts. Additionally, they can choose to filter out jailed validators.

### Displaying Validator Data

The application displays a list of all validators and a list of validators that the user has delegated to. Both lists provide details about each validator and the amount of tokens the user has delegated to them.

### Staking Tokens

Once users have made their selections and inputs, they can stake their tokens by clicking the "Stake" button.

## Summary

This application serves as a comprehensive tool for users wanting to delegate tokens on the EVMOS Testnet. Its functionalities are designed to provide users with flexibility and control over their delegations, ultimately promoting a more user-friendly staking experience.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
