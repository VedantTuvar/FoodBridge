import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../../api/authApi';
import { setAuth } from '../../store/authSlice';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { Callout } from '../../components/molecules/Callout';

const ROLES = [
  { id: 'donor', title: 'Food Donor', desc: 'Restaurants, hotels, caterers, grocery stores with surplus food.' },
  { id: 'ngo', title: 'NGO / Shelter', desc: 'Food banks, community kitchens, shelters serving beneficiaries.' },
  { id: 'volunteer', title: 'Volunteer Driver', desc: 'Drivers and individuals delivering surplus food to shelters.' },
  { id: 'corporate', title: 'Corporate CSR Manager', desc: 'Manage multi-branch food donation programs & ESG reporting.' },
];

export const RegisterForm = () => {
  const [role, setRole] = useState('donor');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        full_name: fullName,
        phone_number: phone,
        email: email,
        password: password,
        role: role,
      });

      dispatch(setAuth(res.data));
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '560px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Create FoodBridge Account</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '14px', marginBottom: '24px' }}>
        Select your role in the real-time food redistribution network.
      </p>

      {errorMsg && (
        <Callout type="red" title="Registration Error">
          {errorMsg}
        </Callout>
      )}

      {/* Role Selection Cards */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            display: 'block',
            marginBottom: '8px',
            color: 'var(--ink-soft)',
          }}
        >
          Select Your Role
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setRole(r.id)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '2px solid var(--teal)' : 'var(--border-hairline)',
                  backgroundColor: isSelected ? 'var(--paper-alt)' : 'var(--white)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>{r.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>{r.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleRegister}>
        <Input
          label="Full Name or Organization Name"
          placeholder="e.g. Hope Shelter / Alex Rivera"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Mobile Phone Number"
          placeholder="+1 202 555 0100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="contact@org.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password (min 8 characters)"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button variant="primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Complete Registration'}
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink-soft)' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: 'var(--teal)', fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </div>
  );
};
