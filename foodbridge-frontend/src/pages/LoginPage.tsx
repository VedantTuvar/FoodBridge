import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { setAuth } from '../store/authSlice';
import { Navbar } from '../components/organisms/Navbar';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { Callout } from '../components/molecules/Callout';

export const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.sendOTP(phone);
      setDevOtp(res.data.dev_otp);
      setStep(2);
    } catch (err) {
      alert('Error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.verifyOTP(phone, otp);
      dispatch(setAuth(res.data));
      const role = res.data.user.role;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      alert('Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px' }}>
        <div className="card">
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            {step === 1 ? 'Phone Sign In' : 'Enter Verification OTP'}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '14px', marginBottom: '24px' }}>
            {step === 1
              ? 'Enter your mobile number to receive a 6-digit verification code.'
              : `Code sent to ${phone}`}
          </p>

          {devOtp && (
            <Callout type="amber" title="Development Mode OTP">
              Your test verification code is: <strong>{devOtp}</strong>
            </Callout>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <Input
                label="Mobile Phone Number"
                placeholder="+1 202 555 0123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <Input
                label="6-Digit OTP Code"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <Button variant="primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
