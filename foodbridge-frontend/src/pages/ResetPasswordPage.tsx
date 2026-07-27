import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { ResetPasswordForm } from '../features/auth/ResetPasswordForm';

export const ResetPasswordPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '60px 24px' }}>
        <ResetPasswordForm />
      </div>
    </div>
  );
};
