/**
 * pages/CreateEscrow.jsx
 * Form page to create a new escrow deal.
 *
 * TODO: build controlled form with React Hook Form or native state.
 * TODO: validate inputs before sending the transaction.
 * TODO: call escrowService.createDeal() on form submission.
 * TODO: show transaction pending / success / error feedback.
 * TODO: redirect to /escrow/:id after successful creation.
 */

import React, { useState } from 'react';

export default function CreateEscrow() {
  // TODO: replace with React Hook Form or Formik
  const [form, setForm] = useState({
    seller: '',
    arbiter: '',
    amount: '',
    deadline: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: validate, call escrowService.createDeal(form), handle tx lifecycle
    console.warn('CreateEscrow: handleSubmit not yet implemented', form);
    alert('⚠️ Smart contract interaction not yet implemented. This is a placeholder.');
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.6rem 0.8rem',
    marginTop: '0.3rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Create New Escrow</h1>
      <p style={{ color: '#666' }}>Lock ETH safely between buyer and seller.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
        <label>
          Seller Address *
          <input
            name="seller"
            type="text"
            placeholder="0x..."
            value={form.seller}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Arbiter Address (optional)
          <input
            name="arbiter"
            type="text"
            placeholder="0x... (leave blank for no arbiter)"
            value={form.arbiter}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>
          Amount (ETH) *
          <input
            name="amount"
            type="number"
            placeholder="0.0"
            step="0.001"
            min="0"
            value={form.amount}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </label>

        <label>
          Deadline (optional)
          <input
            name="deadline"
            type="datetime-local"
            value={form.deadline}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label>
          Description *
          <textarea
            name="description"
            placeholder="Describe what this escrow is for..."
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>

        <button
          type="submit"
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '0.8rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Lock Funds in Escrow
        </button>
      </form>
    </main>
  );
}

