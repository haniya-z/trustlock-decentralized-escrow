/**
 * pages/NotFound.jsx
 * 404 — catch-all route for unmatched paths.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem 2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '5rem', margin: 0, color: '#6366f1' }}>404</h1>
      <h2 style={{ marginTop: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: '#888' }}>The page you are looking for does not exist.</p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginTop: '1.5rem',
          background: '#6366f1',
          color: '#fff',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Go Home
      </Link>
    </main>
  );
}

