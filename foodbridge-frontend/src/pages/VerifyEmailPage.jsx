import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Navbar } from '../components/organisms/Navbar';
import { Callout } from '../components/molecules/Callout';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMsg('Verification token missing.');
      return;
    }

    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMsg(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMsg(err.response?.data?.message || 'Email verification failed.');
      });
  }, [token]);

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '16px' }}>Email Verification</h2>

          {status === 'verifying' && <p style={{ color: 'var(--ink-soft)' }}>Verifying your email address...</p>}

          {status === 'success' && (
            <div>
              <Callout type="teal" title="Email Verified">
                {msg}
              </Callout>
              <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600, marginTop: '16px', display: 'inline-block' }}>
                Proceed to Sign In
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <Callout type="red" title="Verification Failed">
                {msg}
              </Callout>
              <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600, marginTop: '16px', display: 'inline-block' }}>
                Return to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
