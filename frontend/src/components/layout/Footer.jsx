/**
 * components/layout/Footer.jsx  — PLACEHOLDER
 * TODO: add links, social icons, and legal disclaimer.
 */

import React from 'react';

export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '0.85rem', borderTop: '1px solid #e5e7eb', marginTop: '4rem' }}>
      © {new Date().getFullYear()} TrustLock — Decentralized Escrow Protocol
    </footer>
  );
}

