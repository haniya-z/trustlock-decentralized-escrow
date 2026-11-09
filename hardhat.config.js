require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * hardhat.config.js
 * Root Hardhat configuration for TrustLock.
 *
 * Networks:
 *  - hardhat  : in-process ephemeral network (default for `hardhat test`)
 *  - localhost : persistent local node started with `npm run node`
 *  - sepolia   : Ethereum testnet — credentials loaded from .env
 *
 * @see https://hardhat.org/config
 */

// Pull optional env vars — real values must live in .env (never committed)
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type {import("hardhat/config").HardhatUserConfig} */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // Built-in Hardhat network — fastest for unit tests
    hardhat: {
      chainId: 31337,
    },

    // Local node: start with `npm run node`, then deploy with `npm run deploy:local`
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // Sepolia testnet — populate .env before using
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },

  // Etherscan verification support
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  // Gas reporter (activate with REPORT_GAS=true in .env)
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },

  // Output paths
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

