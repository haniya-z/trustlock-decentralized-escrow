/**
 * components/layout/Navbar.jsx  — PLACEHOLDER
 *
 * Top navigation bar.
 * TODO: add wallet connect button (using WalletContext).
 * TODO: highlight the active route.
 * TODO: add mobile hamburger menu.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1px solid #e5e7eb',
      background: '#fff',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#111827', fontWeight: 700, fontSize: '1.1rem' }}>
        <Shield size={22} color="#6366f1" />
        TrustLock
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#374151' }}>Dashboard</Link>
        <Link to="/create" style={{ textDecoration: 'none', color: '#374151' }}>New Escrow</Link>
        {/* TODO: replace with <WalletButton /> */}
        <button style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer', fontWeight: 600 }}>
          Connect Wallet
        </button>
      </div>
    </nav>
  );
}

