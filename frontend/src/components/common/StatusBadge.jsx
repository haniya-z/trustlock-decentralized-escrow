/**
 * components/common/StatusBadge.jsx  — PLACEHOLDER
 * Displays an escrow deal state as a coloured badge.
 * TODO: map all enum states to colours and labels.
 */

import React from 'react';
import { formatEscrowState } from '../../utils/formatters.js';

const STATE_COLORS = {
  1: { bg: '#fef3c7', text: '#92400e' }, // AWAITING_DELIVERY — amber
  2: { bg: '#d1fae5', text: '#065f46' }, // COMPLETE — green
  3: { bg: '#fee2e2', text: '#991b1b' }, // DISPUTED — red
  4: { bg: '#e0e7ff', text: '#3730a3' }, // REFUNDED — indigo
  5: { bg: '#f3f4f6', text: '#374151' }, // CANCELLED — gray
};

export default function StatusBadge({ state }) {
  const colors = STATE_COLORS[state] ?? { bg: '#f3f4f6', text: '#374151' };
  return (
    <span style={{ ...colors, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>
      {formatEscrowState(state)}
    </span>
  );
}

