/**
 * test/Escrow.js
 * Comprehensive test suite for the TrustLock Escrow smart contract.
 *
 * Framework: Mocha + Chai (via @nomicfoundation/hardhat-toolbox)
 * Tested against: Ethers.js v6 on Hardhat Network
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Escrow Contract", function () {
  // Enum mappings corresponding to Solidity State enum
  const State = {
    Funded: 0,
    Delivered: 1,
    Disputed: 2,
    Released: 3,
    Refunded: 4,
  };

  /**
   * Deployment fixture — deploys a clean Escrow contract and provisions signers.
   */
  async function deployEscrowFixture() {
    const [buyer, seller, arbiter, stranger] = await ethers.getSigners();

    const EscrowFactory = await ethers.getContractFactory("Escrow");
    const escrow = await EscrowFactory.deploy();
    await escrow.waitForDeployment();

    const defaultDeposit = ethers.parseEther("1.0");
    const defaultDescription = "Smart contract audit milestone escrow";

    // Helper to get a timestamp in the future (e.g. + 1 day)
    const getFutureDeadline = async (secondsInFuture = 86400) => {
      const current = await time.latest();
      return current + secondsInFuture;
    };

    return {
      escrow,
      buyer,
      seller,
      arbiter,
      stranger,
      defaultDeposit,
      defaultDescription,
      getFutureDeadline,
    };
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Escrow Creation & Validation
  // ───────────────────────────────────────────────────────────────────────────

  describe("Escrow Creation", function () {
    it("should create an escrow deal successfully with valid parameters and emit DealCreated", async function () {
      const { escrow, buyer, seller, arbiter, defaultDeposit, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();

      const tx = await escrow
        .connect(buyer)
        .createDeal(seller.address, arbiter.address, deadline, defaultDescription, {
          value: defaultDeposit,
        });

      await expect(tx)
        .to.emit(escrow, "DealCreated")
        .withArgs(1n, buyer.address, seller.address, arbiter.address, defaultDeposit, deadline, defaultDescription);

      const deal = await escrow.getDeal(1n);
      expect(deal.id).to.equal(1n);
      expect(deal.buyer).to.equal(buyer.address);
      expect(deal.seller).to.equal(seller.address);
      expect(deal.arbiter).to.equal(arbiter.address);
      expect(deal.amount).to.equal(defaultDeposit);
      expect(deal.state).to.equal(State.Funded);
      expect(deal.deadline).to.equal(deadline);
      expect(deal.description).to.equal(defaultDescription);
    });

    it("should reject escrow creation with zero deposit", async function () {
      const { escrow, buyer, seller, arbiter, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();

      await expect(
        escrow
          .connect(buyer)
          .createDeal(seller.address, arbiter.address, deadline, defaultDescription, {
            value: 0n,
          })
      ).to.be.revertedWithCustomError(escrow, "Escrow__ZeroDeposit");
    });

    it("should reject escrow creation with zero seller address", async function () {
      const { escrow, buyer, arbiter, defaultDeposit, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();

      await expect(
        escrow
          .connect(buyer)
          .createDeal(ethers.ZeroAddress, arbiter.address, deadline, defaultDescription, {
            value: defaultDeposit,
          })
      ).to.be.revertedWithCustomError(escrow, "Escrow__ZeroSellerAddress");
    });

    it("should reject escrow creation where buyer is also the seller", async function () {
      const { escrow, buyer, arbiter, defaultDeposit, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();

      await expect(
        escrow
          .connect(buyer)
          .createDeal(buyer.address, arbiter.address, deadline, defaultDescription, {
            value: defaultDeposit,
          })
      ).to.be.revertedWithCustomError(escrow, "Escrow__BuyerEqualsSeller");
    });

    it("should reject escrow creation with a past or current deadline", async function () {
      const { escrow, buyer, seller, arbiter, defaultDeposit, defaultDescription } =
        await loadFixture(deployEscrowFixture);

      const currentTimestamp = await time.latest();

      await expect(
        escrow
          .connect(buyer)
          .createDeal(seller.address, arbiter.address, currentTimestamp, defaultDescription, {
            value: defaultDeposit,
          })
      ).to.be.revertedWithCustomError(escrow, "Escrow__InvalidDeadline");

      await expect(
        escrow
          .connect(buyer)
          .createDeal(seller.address, arbiter.address, currentTimestamp - 100, defaultDescription, {
            value: defaultDeposit,
          })
      ).to.be.revertedWithCustomError(escrow, "Escrow__InvalidDeadline");
    });

    it("should store correct buyer and seller and increment deal counter", async function () {
      const { escrow, buyer, seller, defaultDeposit, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();

      await escrow
        .connect(buyer)
        .createDeal(seller.address, ethers.ZeroAddress, deadline, defaultDescription, {
          value: defaultDeposit,
        });

      await escrow
        .connect(buyer)
        .createDeal(seller.address, ethers.ZeroAddress, deadline, defaultDescription, {
          value: defaultDeposit,
        });

      expect(await escrow.nextDealId()).to.equal(3n);
      const deal1 = await escrow.getDeal(1n);
      const deal2 = await escrow.getDeal(2n);
      expect(deal1.id).to.equal(1n);
      expect(deal2.id).to.equal(2n);
      expect(deal1.buyer).to.equal(buyer.address);
      expect(deal2.buyer).to.equal(buyer.address);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Delivery & Fund Release Flow
  // ───────────────────────────────────────────────────────────────────────────

  describe("Delivery and Release Flow", function () {
    async function fundedDealFixture() {
      const base = await deployEscrowFixture();
      const deadline = await base.getFutureDeadline();
      await base.escrow
        .connect(base.buyer)
        .createDeal(base.seller.address, base.arbiter.address, deadline, base.defaultDescription, {
          value: base.defaultDeposit,
        });
      return { ...base, dealId: 1n, deadline };
    }

    it("should allow seller to mark delivery and emit DeliveryMarked", async function () {
      const { escrow, seller, dealId } = await loadFixture(fundedDealFixture);

      const tx = await escrow.connect(seller).markDelivered(dealId);
      await expect(tx).to.emit(escrow, "DeliveryMarked").withArgs(dealId);

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Delivered);
    });

    it("should reject delivery marking by non-seller", async function () {
      const { escrow, buyer, stranger, dealId } = await loadFixture(fundedDealFixture);

      await expect(escrow.connect(buyer).markDelivered(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotSeller"
      );

      await expect(escrow.connect(stranger).markDelivered(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotSeller"
      );
    });

    it("should reject delivery marking if deal is not in Funded state", async function () {
      const { escrow, seller, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(seller).markDelivered(dealId);

      // Attempting to mark delivered again
      await expect(escrow.connect(seller).markDelivered(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should allow buyer to release funds after delivery and pay seller", async function () {
      const { escrow, buyer, seller, dealId, defaultDeposit } = await loadFixture(fundedDealFixture);

      // Seller delivers
      await escrow.connect(seller).markDelivered(dealId);

      // Buyer releases funds
      await expect(
        escrow.connect(buyer).releaseFunds(dealId)
      ).to.changeEtherBalances(
        [escrow, seller],
        [-defaultDeposit, defaultDeposit]
      );

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Released);
    });

    it("should reject fund release before delivery is marked", async function () {
      const { escrow, buyer, dealId } = await loadFixture(fundedDealFixture);

      // Deal is in Funded state, not Delivered
      await expect(escrow.connect(buyer).releaseFunds(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should reject unauthorized callers from releasing funds", async function () {
      const { escrow, seller, stranger, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(seller).markDelivered(dealId);

      await expect(escrow.connect(seller).releaseFunds(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotBuyer"
      );

      await expect(escrow.connect(stranger).releaseFunds(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotBuyer"
      );
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Dispute Flow & Arbitration
  // ───────────────────────────────────────────────────────────────────────────

  describe("Dispute Flow", function () {
    async function fundedDealFixture() {
      const base = await deployEscrowFixture();
      const deadline = await base.getFutureDeadline();
      await base.escrow
        .connect(base.buyer)
        .createDeal(base.seller.address, base.arbiter.address, deadline, base.defaultDescription, {
          value: base.defaultDeposit,
        });
      return { ...base, dealId: 1n, deadline };
    }

    it("should allow buyer to raise dispute when deal is Funded", async function () {
      const { escrow, buyer, dealId } = await loadFixture(fundedDealFixture);

      const tx = await escrow.connect(buyer).raiseDispute(dealId);
      await expect(tx).to.emit(escrow, "DisputeRaised").withArgs(dealId, buyer.address);

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Disputed);
    });

    it("should allow seller to raise dispute when deal is Delivered", async function () {
      const { escrow, seller, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(seller).markDelivered(dealId);

      const tx = await escrow.connect(seller).raiseDispute(dealId);
      await expect(tx).to.emit(escrow, "DisputeRaised").withArgs(dealId, seller.address);

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Disputed);
    });

    it("should reject dispute from unauthorized third parties", async function () {
      const { escrow, stranger, arbiter, dealId } = await loadFixture(fundedDealFixture);

      await expect(escrow.connect(stranger).raiseDispute(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotParty"
      );

      await expect(escrow.connect(arbiter).raiseDispute(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotParty"
      );
    });

    it("should reject dispute if deal is already disputed or settled", async function () {
      const { escrow, buyer, seller, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(buyer).raiseDispute(dealId);

      // Attempt raising again while in Disputed state
      await expect(escrow.connect(seller).raiseDispute(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__CannotDisputeInCurrentState"
      );
    });

    it("should reject dispute resolution by non-arbiter", async function () {
      const { escrow, buyer, seller, stranger, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(buyer).raiseDispute(dealId);

      await expect(
        escrow.connect(buyer).resolveDispute(dealId, buyer.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__NotArbiter");

      await expect(
        escrow.connect(seller).resolveDispute(dealId, seller.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__NotArbiter");

      await expect(
        escrow.connect(stranger).resolveDispute(dealId, seller.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__NotArbiter");
    });

    it("should allow arbiter to award funds to seller", async function () {
      const { escrow, buyer, seller, arbiter, dealId, defaultDeposit } = await loadFixture(fundedDealFixture);

      await escrow.connect(buyer).raiseDispute(dealId);

      await expect(
        escrow.connect(arbiter).resolveDispute(dealId, seller.address)
      ).to.changeEtherBalances(
        [escrow, seller],
        [-defaultDeposit, defaultDeposit]
      );

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Released);
    });

    it("should allow arbiter to award funds to buyer", async function () {
      const { escrow, buyer, seller, arbiter, dealId, defaultDeposit } = await loadFixture(fundedDealFixture);

      await escrow.connect(seller).raiseDispute(dealId);

      await expect(
        escrow.connect(arbiter).resolveDispute(dealId, buyer.address)
      ).to.changeEtherBalances(
        [escrow, buyer],
        [-defaultDeposit, defaultDeposit]
      );

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Refunded);
    });

    it("should reject arbiter awarding an invalid third-party address", async function () {
      const { escrow, buyer, arbiter, stranger, dealId } = await loadFixture(fundedDealFixture);

      await escrow.connect(buyer).raiseDispute(dealId);

      await expect(
        escrow.connect(arbiter).resolveDispute(dealId, stranger.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__InvalidWinner");
    });

    it("should reject dispute resolution if deal has no arbiter assigned", async function () {
      const { escrow, buyer, seller, defaultDeposit, defaultDescription, getFutureDeadline } =
        await loadFixture(deployEscrowFixture);

      const deadline = await getFutureDeadline();
      // Arbiter is address(0)
      await escrow
        .connect(buyer)
        .createDeal(seller.address, ethers.ZeroAddress, deadline, defaultDescription, {
          value: defaultDeposit,
        });

      await escrow.connect(buyer).raiseDispute(1n);

      await expect(
        escrow.connect(buyer).resolveDispute(1n, buyer.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__NoArbiterAssigned");
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Expiry & Refund Rules
  // ───────────────────────────────────────────────────────────────────────────

  describe("Expiry and Refund Rules", function () {
    async function fundedDealFixture() {
      const base = await deployEscrowFixture();
      const deadline = await base.getFutureDeadline(3600); // 1 hour in future
      await base.escrow
        .connect(base.buyer)
        .createDeal(base.seller.address, base.arbiter.address, deadline, base.defaultDescription, {
          value: base.defaultDeposit,
        });
      return { ...base, dealId: 1n, deadline };
    }

    it("should allow buyer to refund expired deal when deadline passes in Funded state", async function () {
      const { escrow, buyer, dealId, deadline, defaultDeposit } = await loadFixture(fundedDealFixture);

      // Advance time past deadline
      await time.increaseTo(deadline + 1);

      await expect(
        escrow.connect(buyer).refundExpired(dealId)
      ).to.changeEtherBalances(
        [escrow, buyer],
        [-defaultDeposit, defaultDeposit]
      );

      const deal = await escrow.getDeal(dealId);
      expect(deal.state).to.equal(State.Refunded);
    });

    it("should reject refund before deadline has passed", async function () {
      const { escrow, buyer, dealId } = await loadFixture(fundedDealFixture);

      await expect(escrow.connect(buyer).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__DeadlineNotPassed"
      );
    });

    it("should reject refund after delivery has been marked, even if deadline expired", async function () {
      const { escrow, buyer, seller, dealId, deadline } = await loadFixture(fundedDealFixture);

      // Seller delivers on time
      await escrow.connect(seller).markDelivered(dealId);

      // Fast forward past deadline
      await time.increaseTo(deadline + 100);

      // Buyer cannot reclaim funds because delivery was already marked
      await expect(escrow.connect(buyer).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should reject expiry refund if deal is disputed", async function () {
      const { escrow, buyer, dealId, deadline } = await loadFixture(fundedDealFixture);

      // Buyer raises dispute
      await escrow.connect(buyer).raiseDispute(dealId);

      // Advance time past deadline
      await time.increaseTo(deadline + 100);

      // Expiry refund must be rejected while dispute is active
      await expect(escrow.connect(buyer).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should reject expiry refund called by non-buyer", async function () {
      const { escrow, seller, stranger, dealId, deadline } = await loadFixture(fundedDealFixture);

      await time.increaseTo(deadline + 1);

      await expect(escrow.connect(seller).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotBuyer"
      );

      await expect(escrow.connect(stranger).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__NotBuyer"
      );
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Double Settlement & Invariant Safeguards
  // ───────────────────────────────────────────────────────────────────────────

  describe("Settlement Finality and Double Withdrawal Safeguards", function () {
    async function deliveredDealFixture() {
      const base = await deployEscrowFixture();
      const deadline = await base.getFutureDeadline();
      await base.escrow
        .connect(base.buyer)
        .createDeal(base.seller.address, base.arbiter.address, deadline, base.defaultDescription, {
          value: base.defaultDeposit,
        });
      await base.escrow.connect(base.seller).markDelivered(1n);
      return { ...base, dealId: 1n, deadline };
    }

    it("should prevent double settlement: cannot release twice", async function () {
      const { escrow, buyer, dealId } = await loadFixture(deliveredDealFixture);

      // First release succeeds
      await escrow.connect(buyer).releaseFunds(dealId);

      // Second release fails
      await expect(escrow.connect(buyer).releaseFunds(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should prevent double settlement: cannot refund after release", async function () {
      const { escrow, buyer, dealId, deadline } = await loadFixture(deliveredDealFixture);

      await escrow.connect(buyer).releaseFunds(dealId);

      await time.increaseTo(deadline + 100);

      await expect(escrow.connect(buyer).refundExpired(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__InvalidState"
      );
    });

    it("should prevent double settlement: cannot dispute or resolve after release", async function () {
      const { escrow, buyer, seller, arbiter, dealId } = await loadFixture(deliveredDealFixture);

      await escrow.connect(buyer).releaseFunds(dealId);

      await expect(escrow.connect(seller).raiseDispute(dealId)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__CannotDisputeInCurrentState"
      );

      await expect(
        escrow.connect(arbiter).resolveDispute(dealId, seller.address)
      ).to.be.revertedWithCustomError(escrow, "Escrow__InvalidState");
    });

    it("should revert if queried with a non-existent deal ID", async function () {
      const { escrow, buyer } = await loadFixture(deployEscrowFixture);

      await expect(escrow.getDeal(999n)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__DealNotFound"
      );

      await expect(escrow.connect(buyer).markDelivered(999n)).to.be.revertedWithCustomError(
        escrow,
        "Escrow__DealNotFound"
      );
    });
  });
});
