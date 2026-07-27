import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import { Button } from '../components/atoms/Button';

export const LandingPage = () => {
  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh' }}>
      <Navbar />
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--amber-deep)',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          THREE-SIDED REAL-TIME REDISTRIBUTION NETWORK
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '56px',
            color: 'var(--ink)',
            lineHeight: 1.05,
            marginBottom: '24px',
          }}
        >
          Connecting Surplus Food with Hungry People — Before It Spoils.
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: 'var(--ink-soft)',
            maxWidth: '720px',
            margin: '0 auto 40px auto',
            lineHeight: 1.6,
          }}
        >
          FoodBridge coordinates restaurants, verified shelters, and volunteer drivers in real time.
          Complete lifecycle tracking from listing to verified delivery with photo & OTP proof.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/login">
            <Button variant="primary" size="large">
              Get Started Now
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary" size="large">
              How It Works
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
