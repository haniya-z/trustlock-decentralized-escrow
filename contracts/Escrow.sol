// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title  TrustLock Escrow Contract
 * @author TrustLock Team
 * @notice Trustless, decentralized escrow contract for buyer-seller agreements.
 *         Funds (ETH) are deposited by the buyer upon deal creation and can only
 *         be released or refunded according to strict protocol state machine rules.
 *
 * @dev    Architecture & Security Notes:
 *         - Implements the Checks-Effects-Interactions (CEI) pattern.
 *         - Inherits ReentrancyGuard for external ETH transfer protections.
 *         - Operates without administrative backdoors or arbitrary owner withdrawals.
 *         - Every deal has exactly one terminal state: Released or Refunded.
 *
 * @custom:limitation MVP Limitation: The assigned arbiter is trusted to act fairly.
 *                    There is currently no on-chain evidence verification or decentralized
 *                    court/staking mechanism. A decentralized dispute protocol (e.g. Kleros)
 *                    is planned for future milestones.
 */
contract Escrow is ReentrancyGuard {
    // ─────────────────────────────────────────────────────────────────────────
    // Types & Enums
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice State machine states for a deal lifecycle.
    enum State {
        Funded,     // Buyer created deal and deposited ETH; delivery pending
        Delivered,  // Seller confirmed delivery of goods/services
        Disputed,   // Either buyer or seller raised a dispute before settlement
        Released,   // Funds successfully sent to seller (Terminal State)
        Refunded    // Funds returned to buyer (Terminal State)
    }

    /// @notice Core data for an individual escrow deal.
    struct EscrowDeal {
        uint256 id;
        address payable buyer;
        address payable seller;
        address arbiter;        // Optional arbiter (address(0) if none)
        uint256 amount;         // Escrowed ETH in wei
        State state;
        uint256 createdAt;      // Timestamp when deal was created
        uint256 deadline;       // Delivery deadline timestamp (must be in future)
        string description;     // Description or reference to off-chain terms
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State Variables
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev Auto-incrementing identifier counter. Deal IDs start at 1.
    uint256 private _nextDealId;

    /// @dev Internal mapping from deal ID to EscrowDeal details.
    mapping(uint256 => EscrowDeal) private _deals;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event DealCreated(
        uint256 indexed dealId,
        address indexed buyer,
        address indexed seller,
        address arbiter,
        uint256 amount,
        uint256 deadline,
        string description
    );

    event DeliveryMarked(uint256 indexed dealId);
    event FundsReleased(uint256 indexed dealId, address indexed seller, uint256 amount);
    event FundsRefunded(uint256 indexed dealId, address indexed buyer, uint256 amount);
    event DisputeRaised(uint256 indexed dealId, address indexed raisedBy);
    event DisputeResolved(uint256 indexed dealId, address indexed winner, uint256 amount);

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Errors
    // ─────────────────────────────────────────────────────────────────────────

    error Escrow__ZeroSellerAddress();
    error Escrow__BuyerEqualsSeller();
    error Escrow__ZeroDeposit();
    error Escrow__InvalidDeadline(uint256 deadline);
    error Escrow__DealNotFound(uint256 dealId);
    error Escrow__NotBuyer(uint256 dealId, address caller);
    error Escrow__NotSeller(uint256 dealId, address caller);
    error Escrow__NotParty(uint256 dealId, address caller);
    error Escrow__NotArbiter(uint256 dealId, address caller);
    error Escrow__NoArbiterAssigned(uint256 dealId);
    error Escrow__InvalidWinner(uint256 dealId, address winner);
    error Escrow__InvalidState(uint256 dealId, State current, State required);
    error Escrow__CannotDisputeInCurrentState(uint256 dealId, State current);
    error Escrow__DeadlineNotPassed(uint256 dealId, uint256 deadline, uint256 currentTimestamp);
    error Escrow__TransferFailed();

    // ─────────────────────────────────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────────────────────────────────

    modifier dealExists(uint256 dealId) {
        if (_deals[dealId].id == 0) {
            revert Escrow__DealNotFound(dealId);
        }
        _;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    constructor() {
        _nextDealId = 1;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Creates and funds a new escrow agreement.
     * @param seller      Address of the seller who will deliver goods/services.
     * @param arbiter     Optional third-party arbiter for disputes (address(0) if none).
     * @param deadline    Unix timestamp deadline for delivery (must be strictly in future).
     * @param description Brief description or hash of the agreement.
     * @return dealId     Unique identifier of the created escrow deal.
     */
    function createDeal(
        address payable seller,
        address arbiter,
        uint256 deadline,
        string calldata description
    ) external payable returns (uint256 dealId) {
        if (seller == address(0)) {
            revert Escrow__ZeroSellerAddress();
        }
        if (seller == msg.sender) {
            revert Escrow__BuyerEqualsSeller();
        }
        if (msg.value == 0) {
            revert Escrow__ZeroDeposit();
        }
        if (deadline <= block.timestamp) {
            revert Escrow__InvalidDeadline(deadline);
        }

        dealId = _nextDealId++;

        _deals[dealId] = EscrowDeal({
            id: dealId,
            buyer: payable(msg.sender),
            seller: seller,
            arbiter: arbiter,
            amount: msg.value,
            state: State.Funded,
            createdAt: block.timestamp,
            deadline: deadline,
            description: description
        });

        emit DealCreated(dealId, msg.sender, seller, arbiter, msg.value, deadline, description);
    }

    /**
     * @notice Allows the seller to mark the goods or services as delivered.
     * @param dealId Identifier of the escrow deal.
     */
    function markDelivered(uint256 dealId) external dealExists(dealId) {
        EscrowDeal storage deal = _deals[dealId];

        if (msg.sender != deal.seller) {
            revert Escrow__NotSeller(dealId, msg.sender);
        }
        if (deal.state != State.Funded) {
            revert Escrow__InvalidState(dealId, deal.state, State.Funded);
        }

        deal.state = State.Delivered;

        emit DeliveryMarked(dealId);
    }

    /**
     * @notice Allows the buyer to release escrowed payment to the seller.
     *         Can only be called after delivery has been marked by the seller.
     * @param dealId Identifier of the escrow deal.
     */
    function releaseFunds(uint256 dealId) external nonReentrant dealExists(dealId) {
        EscrowDeal storage deal = _deals[dealId];

        if (msg.sender != deal.buyer) {
            revert Escrow__NotBuyer(dealId, msg.sender);
        }
        if (deal.state != State.Delivered) {
            revert Escrow__InvalidState(dealId, deal.state, State.Delivered);
        }

        // CEI: update state before external transfer
        deal.state = State.Released;
        uint256 amount = deal.amount;

        emit FundsReleased(dealId, deal.seller, amount);

        (bool success, ) = deal.seller.call{value: amount}("");
        if (!success) {
            revert Escrow__TransferFailed();
        }
    }

    /**
     * @notice Raises a dispute on a deal, locking funds until the arbiter resolves it.
     *         Can be called by either the buyer or the seller before final settlement.
     * @param dealId Identifier of the escrow deal.
     */
    function raiseDispute(uint256 dealId) external dealExists(dealId) {
        EscrowDeal storage deal = _deals[dealId];

        if (msg.sender != deal.buyer && msg.sender != deal.seller) {
            revert Escrow__NotParty(dealId, msg.sender);
        }
        if (deal.state != State.Funded && deal.state != State.Delivered) {
            revert Escrow__CannotDisputeInCurrentState(dealId, deal.state);
        }

        deal.state = State.Disputed;

        emit DisputeRaised(dealId, msg.sender);
    }

    /**
     * @notice Resolves an active dispute by awarding funds to either the buyer or the seller.
     *         Can only be called by the designated arbiter.
     * @param dealId Identifier of the disputed escrow deal.
     * @param winner Address of either the buyer or the seller who receives the escrowed funds.
     */
    function resolveDispute(uint256 dealId, address payable winner)
        external
        nonReentrant
        dealExists(dealId)
    {
        EscrowDeal storage deal = _deals[dealId];

        if (deal.arbiter == address(0)) {
            revert Escrow__NoArbiterAssigned(dealId);
        }
        if (msg.sender != deal.arbiter) {
            revert Escrow__NotArbiter(dealId, msg.sender);
        }
        if (deal.state != State.Disputed) {
            revert Escrow__InvalidState(dealId, deal.state, State.Disputed);
        }
        if (winner != deal.buyer && winner != deal.seller) {
            revert Escrow__InvalidWinner(dealId, winner);
        }

        uint256 amount = deal.amount;

        // CEI: transition state according to recipient
        if (winner == deal.seller) {
            deal.state = State.Released;
            emit FundsReleased(dealId, deal.seller, amount);
        } else {
            deal.state = State.Refunded;
            emit FundsRefunded(dealId, deal.buyer, amount);
        }

        emit DisputeResolved(dealId, winner, amount);

        (bool success, ) = winner.call{value: amount}("");
        if (!success) {
            revert Escrow__TransferFailed();
        }
    }

    /**
     * @notice Reclaims deposited funds if the deadline has passed without delivery being marked.
     *         Permitted only if the deal remains in the Funded state.
     * @param dealId Identifier of the expired escrow deal.
     */
    function refundExpired(uint256 dealId) external nonReentrant dealExists(dealId) {
        EscrowDeal storage deal = _deals[dealId];

        if (msg.sender != deal.buyer) {
            revert Escrow__NotBuyer(dealId, msg.sender);
        }
        if (deal.state != State.Funded) {
            revert Escrow__InvalidState(dealId, deal.state, State.Funded);
        }
        if (block.timestamp <= deal.deadline) {
            revert Escrow__DeadlineNotPassed(dealId, deal.deadline, block.timestamp);
        }

        // CEI: set to Refunded terminal state before transfer
        deal.state = State.Refunded;
        uint256 amount = deal.amount;

        emit FundsRefunded(dealId, deal.buyer, amount);

        (bool success, ) = deal.buyer.call{value: amount}("");
        if (!success) {
            revert Escrow__TransferFailed();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Retrieves full deal details for a given deal ID.
     * @param dealId Identifier of the deal to query.
     */
    function getDeal(uint256 dealId)
        external
        view
        dealExists(dealId)
        returns (EscrowDeal memory)
    {
        return _deals[dealId];
    }

    /**
     * @notice Returns the next deal ID that will be assigned.
     */
    function nextDealId() external view returns (uint256) {
        return _nextDealId;
    }
}
