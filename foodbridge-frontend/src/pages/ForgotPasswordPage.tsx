import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { ForgotPasswordForm } from '../features/auth/ForgotPasswordForm';

export const ForgotPasswordPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '60px 24px' }}>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};
