/**
 * src/App.jsx
 * Root application component.
 *
 * Responsibilities:
 *  - Define top-level routes via React Router v6
 *  - Provide global context (wallet, escrow data) via Context API
 *
 * TODO: wrap routes with <WalletProvider> and <EscrowProvider> once contexts are built.
 * TODO: add a global error boundary component.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateEscrow from './pages/CreateEscrow.jsx';
import EscrowDetails from './pages/EscrowDetails.jsx';
import NotFound from './pages/NotFound.jsx';

// TODO: import Layout wrapper once built
// import Layout from './components/layout/Layout.jsx';

export default function App() {
  return (
    // TODO: replace Fragment with <Layout> once navigation / shell is ready
    <>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/create"         element={<CreateEscrow />} />
        <Route path="/escrow/:id"     element={<EscrowDetails />} />
        <Route path="*"               element={<NotFound />} />
      </Routes>
    </>
  );
}

