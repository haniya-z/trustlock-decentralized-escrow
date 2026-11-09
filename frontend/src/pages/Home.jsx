/**
 * pages/Home.jsx
 * Landing page — hero section, feature highlights, call-to-action.
 *
 * TODO: replace placeholder text with real marketing copy.
 * TODO: add animated hero illustration.
 * TODO: connect "Get Started" button to wallet connection flow.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', paddingBlock: '4rem' }}>
        <Shield size={64} color="#6366f1" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>TrustLock</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', marginTop: '0.5rem' }}>
          Decentralized Escrow Protocol — trustless, transparent, secure.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link
            to="/create"
            style={{
              background: '#6366f1',
              color: '#fff',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Create Escrow
          </Link>
          <Link
            to="/dashboard"
            style={{
              background: 'transparent',
              color: '#6366f1',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              border: '2px solid #6366f1',
            }}
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Feature cards — placeholder */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { icon: <Lock size={28} color="#6366f1" />, title: 'Trustless', desc: 'Smart contracts hold funds — no middleman.' },
          { icon: <Shield size={28} color="#6366f1" />, title: 'Secure', desc: 'Audited OpenZeppelin primitives protect every deal.' },
          { icon: <Zap size={28} color="#6366f1" />, title: 'Fast', desc: 'On-chain settlement in seconds, not days.' },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem' }}
          >
            {icon}
            <h3 style={{ marginTop: '0.75rem', marginBottom: '0.25rem' }}>{title}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

