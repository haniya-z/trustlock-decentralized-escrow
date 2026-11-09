/**
 * components/common/Button.jsx  — PLACEHOLDER
 * Reusable button component with variant support.
 * TODO: add loading spinner, disabled states, and icon support.
 */

import React from 'react';

const VARIANTS = {
  primary: { background: '#6366f1', color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: '#6366f1', border: '2px solid #6366f1' },
  danger: { background: '#ef4444', color: '#fff', border: 'none' },
};

export default function Button({ children, variant = 'primary', disabled = false, onClick, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANTS[variant],
        padding: '0.6rem 1.4rem',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

