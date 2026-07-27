import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../api/authApi';
import { setAuth } from '../../store/authSlice';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

export const LoginForm = () => {
  const [tab, setTab] = useState('otp'); // 'otp' or 'email'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [devOtp, setDevOtp] = useState('');
  
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authApi.sendOTP(phone);
      setDevOtp(res.data.dev_otp);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(phone, otp);
      dispatch(setAuth({ ...res.data, remember_me: rememberMe }));
      const role = res.data.user.role;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await authApi.loginWithEmailPassword(identity, password);
      dispatch(setAuth({ ...res.data, remember_me: rememberMe }));
      const role = res.data.user.role;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '440px', margin: '0 auto' }}>
      <div style={{ display: 'flex', borderBottom: 'var(--border-hairline)', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => { setTab('otp'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            textTransform: 'uppercase',
            border: 'none',
            backgroundColor: 'transparent',
            color: tab === 'otp' ? 'var(--teal)' : 'var(--ink-soft)',
            borderBottom: tab === 'otp' ? '3px solid var(--teal)' : 'none',
            fontWeight: 600,
          }}
        >
          📱 Phone OTP
        </button>
        <button
          type="button"
          onClick={() => { setTab('email'); setErrorMsg(''); }}
          style={{
            flex: 1,
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            textTransform: 'uppercase',
            border: 'none',
            backgroundColor: 'transparent',
            color: tab === 'email' ? 'var(--teal)' : 'var(--ink-soft)',
            borderBottom: tab === 'email' ? '3px solid var(--teal)' : 'none',
            fontWeight: 600,
          }}
        >
          ✉️ Email & Password
        </button>
      </div>

      {errorMsg && (
        <Callout type="red" title="Authentication Error">
          {errorMsg}
        </Callout>
      )}

      {tab === 'otp' ? (
        step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <Input
              label="Mobile Phone Number"
              placeholder="+1 202 555 0100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending Code...' : 'Send Verification OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            {devOtp && (
              <Callout type="amber" title="Development OTP Code">
                Your test code is: <strong>{devOtp}</strong>
              </Callout>
            )}
            <Input
              label="6-Digit OTP Code"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
            </Button>
          </form>
        )
      ) : (
        <form onSubmit={handleEmailLogin}>
          <Input
            label="Email or Phone Number"
            placeholder="user@example.com or +12025550100"
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--teal)' }}>
              Forgot password?
            </Link>
          </div>

          <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      )}

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink-soft)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--teal)', fontWeight: 600 }}>
          Create an Account
        </Link>
      </div>
    </div>
  );
};
