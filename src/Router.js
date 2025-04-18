import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/Frontend/HomePage';
import Dashboard from './pages/AdminDashboard';
import FrontEnd from './pages/Frontend';
import Auth from './pages/auth';


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard/*" element={<Dashboard />} /> {/* Use `/*` to allow nested routes */}
      <Route path="/auth/*" element={<Auth />} /> {/* Use `/*` to allow nested routes */}
      <Route path="/*" element={<FrontEnd />} />
    </Routes>
  );
}
