/**
 * scripts/deploy.js
 * Hardhat deployment script for the Escrow contract.
 *
 * Usage:
 *   npm run deploy:local    →  deploy to local Hardhat node
 *   npm run deploy:sepolia  →  deploy to Sepolia testnet (requires .env)
 */

const { ethers } = require("hardhat");

async function main() {
  console.log("🔐 TrustLock — Escrow Deployment\n");

  // ── Signers ──────────────────────────────────────────────────────────────
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance:        ${ethers.formatEther(balance)} ETH\n`);

  // ── Deploy ────────────────────────────────────────────────────────────────
  console.log("Deploying Escrow contract…");
  const EscrowFactory = await ethers.getContractFactory("Escrow");
  const escrow = await EscrowFactory.deploy();
  await escrow.waitForDeployment();

  const contractAddress = await escrow.getAddress();
  console.log(`\n✅ Escrow deployed to: ${contractAddress}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
