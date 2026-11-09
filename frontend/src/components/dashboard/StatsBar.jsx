/**
 * components/dashboard/StatsBar.jsx  — PLACEHOLDER
 * Summary statistics row on the Dashboard (total locked, active deals, etc.)
 * TODO: compute from real deal list once data fetching is implemented.
 */

import React from 'react';

export default function StatsBar({ deals = [] }) {
  // TODO: derive from real deals array
  const stats = [
    { label: 'Total Deals', value: deals.length },
    { label: 'Active', value: 0 },
    { label: 'Completed', value: 0 },
    { label: 'Disputed', value: 0 },
  ];
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      {stats.map(({ label, value }) => (
        <div key={label} style={{ flex: 1, background: '#f9fafb', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>{value}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

