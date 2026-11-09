/**
 * ignition/modules/Escrow.js
 * Hardhat Ignition deployment module for the Escrow contract.
 */

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const EscrowModule = buildModule("EscrowModule", (m) => {
  const escrow = m.contract("Escrow", []);
  return { escrow };
});

module.exports = EscrowModule;
