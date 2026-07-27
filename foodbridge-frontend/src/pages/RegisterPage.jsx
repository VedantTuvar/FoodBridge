import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { RegisterForm } from '../features/auth/RegisterForm';

export const RegisterPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px 24px' }}>
        <RegisterForm />
      </div>
    </div>
  );
};
