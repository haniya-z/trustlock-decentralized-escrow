/**
 * components/escrow/DealCard.jsx  — PLACEHOLDER
 * Summary card for a single escrow deal shown in the Dashboard.
 * TODO: wire up real deal data, click to navigate to /escrow/:id.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import { truncateAddress, formatWei, formatTimestamp } from '../../utils/formatters.js';

export default function DealCard({ deal }) {
  if (!deal) return null;
  return (
    <article style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ marginBottom: '0.25rem' }}>Deal #{deal.id?.toString()}</h3>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>{deal.description}</p>
        </div>
        <StatusBadge state={deal.state} />
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.3rem 0.5rem', marginTop: '1rem', fontSize: '0.9rem' }}>
        <dt style={{ color: '#6b7280' }}>Amount</dt>
        <dd style={{ margin: 0 }}>{formatWei(deal.amount ?? 0n)}</dd>
        <dt style={{ color: '#6b7280' }}>Seller</dt>
        <dd style={{ margin: 0 }}>{truncateAddress(deal.seller)}</dd>
        <dt style={{ color: '#6b7280' }}>Deadline</dt>
        <dd style={{ margin: 0 }}>{formatTimestamp(deal.deadline)}</dd>
      </dl>
      <Link to={`/escrow/${deal.id}`} style={{ display: 'inline-block', marginTop: '1rem', color: '#6366f1', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
        View details →
      </Link>
    </article>
  );
}

