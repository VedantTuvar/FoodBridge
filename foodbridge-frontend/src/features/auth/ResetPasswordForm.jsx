import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token') || '';

  const [token, setToken] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, newPassword);
      setSuccessMsg(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '440px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Reset Your Password</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '14px', marginBottom: '24px' }}>
        Enter your reset token and your new password.
      </p>

      {errorMsg && (
        <Callout type="red" title="Error">
          {errorMsg}
        </Callout>
      )}

      {successMsg && (
        <Callout type="teal" title="Success">
          {successMsg} Redirecting to login...
        </Callout>
      )}

      <form onSubmit={handleReset}>
        <Input
          label="Reset Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <Input
          label="New Password (min 8 characters)"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button variant="primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
          {loading ? 'Updating Password...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
};
