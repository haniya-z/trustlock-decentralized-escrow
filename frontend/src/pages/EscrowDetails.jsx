/**
 * pages/EscrowDetails.jsx
 * Detail view for a single escrow deal.
 * Loaded at route /escrow/:id
 *
 * TODO: fetch deal data from blockchain using the :id param.
 * TODO: render state machine status badge (Awaiting Delivery, Disputed, etc.).
 * TODO: show action buttons based on the connected wallet's role:
 *         Buyer  → Confirm Delivery | Raise Dispute
 *         Seller → Refund Buyer     | Raise Dispute
 *         Arbiter → Resolve Dispute
 * TODO: implement transaction handlers for each action.
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function EscrowDetails() {
  const { id } = useParams();

  // TODO: fetch deal from blockchain
  // const deal = await escrowService.getDeal(id);
  const deal = null; // placeholder

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#6366f1', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <h1 style={{ marginTop: '1rem' }}>Escrow #{id}</h1>

      {deal === null ? (
        <div style={{ marginTop: '2rem', color: '#888' }}>
          <p>⚠️ This is a placeholder. Deal data will be loaded from the blockchain once the service layer is implemented.</p>

          {/* Skeleton preview of what the detail view will show */}
          <div style={{ marginTop: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}>
            <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '0.5rem 1rem', margin: 0 }}>
              {[
                ['Deal ID', id],
                ['State', '—'],
                ['Buyer', '—'],
                ['Seller', '—'],
                ['Arbiter', '—'],
                ['Amount', '—'],
                ['Deadline', '—'],
                ['Description', '—'],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <dt style={{ fontWeight: 600, color: '#374151' }}>{label}</dt>
                  <dd style={{ margin: 0, color: '#6b7280' }}>{value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          {/* Action buttons — disabled until implemented */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button disabled style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'not-allowed' }}>
              Confirm Delivery
            </button>
            <button disabled style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'not-allowed' }}>
              Raise Dispute
            </button>
            <button disabled style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#f9fafb', cursor: 'not-allowed' }}>
              Refund Buyer
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* TODO: render real deal data */}
        </div>
      )}
    </main>
  );
}

