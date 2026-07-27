import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';

import { DonorLayout } from '../layouts/DonorLayout';
import { DonorDashboardPage } from '../pages/DonorDashboardPage';

import { NGOLayout } from '../layouts/NGOLayout';
import { NGOBrowseDonationsPage } from '../pages/NGOBrowseDonationsPage';

import { VolunteerLayout } from '../layouts/VolunteerLayout';
import { VolunteerTasksPage } from '../pages/VolunteerTasksPage';

import { CorporateLayout } from '../layouts/CorporateLayout';
import { CorporateDashboardPage } from '../pages/CorporateDashboardPage';

import { AdminLayout } from '../layouts/AdminLayout';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Donor Protected Routes */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DonorDashboardPage />} />
      </Route>

      {/* NGO Protected Routes */}
      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={['ngo']}>
            <NGOLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<NGOBrowseDonationsPage />} />
        <Route path="browse" element={<NGOBrowseDonationsPage />} />
      </Route>

      {/* Volunteer Protected Routes */}
      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={['volunteer']}>
            <VolunteerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<VolunteerTasksPage />} />
        <Route path="tasks/nearby" element={<VolunteerTasksPage />} />
      </Route>

      {/* Corporate CSR Protected Routes */}
      <Route
        path="/corporate"
        element={
          <ProtectedRoute allowedRoles={['corporate']}>
            <CorporateLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CorporateDashboardPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
