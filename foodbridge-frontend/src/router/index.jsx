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
import { CreateDonationPage } from '../pages/CreateDonationPage';
import { EditDonationPage } from '../pages/EditDonationPage';
import { DonationTrackerPage } from '../pages/DonationTrackerPage';
import { DonationHistoryPage } from '../pages/DonationHistoryPage';
import { RecurringDonationsPage } from '../pages/RecurringDonationsPage';
import { DonorImpactPage } from '../pages/DonorImpactPage';
import { DonorSettingsPage } from '../pages/DonorSettingsPage';

import { NGOLayout } from '../layouts/NGOLayout';
import { NGOBrowseDonationsPage } from '../pages/NGOBrowseDonationsPage';
import { NGOBrowseMapPage } from '../pages/NGOBrowseMapPage';
import { NGOVerificationPage } from '../pages/NGOVerificationPage';
import { NGOClaimHistoryPage } from '../pages/NGOClaimHistoryPage';
import { NGOFoodRequestsPage } from '../pages/NGOFoodRequestsPage';
import { NGOAnalyticsPage } from '../pages/NGOAnalyticsPage';
import { NGORatingsPage } from '../pages/NGORatingsPage';
import { NGOSettingsPage } from '../pages/NGOSettingsPage';

import { VolunteerLayout } from '../layouts/VolunteerLayout';
import { VolunteerTasksPage } from '../pages/VolunteerTasksPage';

import { CorporateLayout } from '../layouts/CorporateLayout';
import { CorporateDashboardPage } from '../pages/CorporateDashboardPage';

import { AdminLayout } from '../layouts/AdminLayout';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { NGOVerificationQueuePage } from '../pages/NGOVerificationQueuePage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Donor Protected Module Routes */}
      <Route
        path="/donor"
        element={
          <ProtectedRoute allowedRoles={['donor']}>
            <DonorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DonorDashboardPage />} />
        <Route path="donations/new" element={<CreateDonationPage />} />
        <Route path="donations/:id/edit" element={<EditDonationPage />} />
        <Route path="donations/:id/track" element={<DonationTrackerPage />} />
        <Route path="history" element={<DonationHistoryPage />} />
        <Route path="recurring" element={<RecurringDonationsPage />} />
        <Route path="impact" element={<DonorImpactPage />} />
        <Route path="settings" element={<DonorSettingsPage />} />
      </Route>

      {/* NGO Protected Module Routes */}
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
        <Route path="map" element={<NGOBrowseMapPage />} />
        <Route path="verification" element={<NGOVerificationPage />} />
        <Route path="history" element={<NGOClaimHistoryPage />} />
        <Route path="food-requests" element={<NGOFoodRequestsPage />} />
        <Route path="analytics" element={<NGOAnalyticsPage />} />
        <Route path="ratings" element={<NGORatingsPage />} />
        <Route path="settings" element={<NGOSettingsPage />} />
      </Route>

      {/* Volunteer Protected Module Routes */}
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

      {/* Corporate CSR Protected Module Routes */}
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

      {/* Admin Protected Module Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="verifications" element={<NGOVerificationQueuePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
