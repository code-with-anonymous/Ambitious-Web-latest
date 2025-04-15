import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './login'; // Import the Login page component
import Signup from './signup'; // Import the Signup page component
import ForgotPassword from './forgotpassword'; // Import the ForgotPassword page component

export default function Auth() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
