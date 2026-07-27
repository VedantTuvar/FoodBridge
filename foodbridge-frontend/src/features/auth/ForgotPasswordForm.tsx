import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const ForgotPasswordForm = () => {
  const [identity, setIdentity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devToken, setDevToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(identity);
      setDevToken(res.data.dev_reset_token);
      setSubmitted(true);
    } catch (err) {
      alert('Error requesting password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '440px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Forgot Password</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '14px', marginBottom: '24px' }}>
        Enter your registered email address or phone number to receive reset instructions.
      </p>

      {submitted ? (
        <div>
          <Callout type="amber" title="Reset Instructions Sent">
            If an account exists, password reset instructions have been issued.
          </Callout>

          {devToken && (
            <Callout type="teal" title="Development Reset Link">
              Reset Token: <strong>{devToken}</strong>
              <div style={{ marginTop: '8px' }}>
                <Link to={`/reset-password?token=${devToken}`} style={{ color: 'var(--teal)', fontWeight: 600 }}>
                  Click here to Reset Password
                </Link>
              </div>
            </Callout>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            label="Email or Phone Number"
            placeholder="user@example.com or +12025550100"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            required
          />
          <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : 'Send Reset Instructions'}
          </Button>
        </form>
      )}
    </div>
  );
};
