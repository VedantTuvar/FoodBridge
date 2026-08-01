import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { NotificationCenterPage } from '../pages/NotificationCenterPage';
import { NotificationPreferencesPage } from '../pages/NotificationPreferencesPage';
import { ImpactDashboardPage } from '../pages/ImpactDashboardPage';
import { AnalyticsChartsPage } from '../pages/AnalyticsChartsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SmartMatchingPage } from '../pages/SmartMatchingPage';

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
import { VolunteerDashboardPage } from '../pages/VolunteerDashboardPage';
import { VolunteerTasksPage } from '../pages/VolunteerTasksPage';
import { VolunteerLiveTrackingPage } from '../pages/VolunteerLiveTrackingPage';
import { VolunteerHistoryPage } from '../pages/VolunteerHistoryPage';
import { VolunteerBadgesPage } from '../pages/VolunteerBadgesPage';
import { VolunteerLeaderboardPage } from '../pages/VolunteerLeaderboardPage';
import { VolunteerRatingsPage } from '../pages/VolunteerRatingsPage';
import { VolunteerNotificationsPage } from '../pages/VolunteerNotificationsPage';

import { CorporateLayout } from '../layouts/CorporateLayout';
import { CorporateDashboardPage } from '../pages/CorporateDashboardPage';

import { AdminLayout } from '../layouts/AdminLayout';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminNGOVerificationPage } from '../pages/admin/AdminNGOVerificationPage';
import { AdminDonorVerificationPage } from '../pages/admin/AdminDonorVerificationPage';
import { AdminVolunteerManagementPage } from '../pages/admin/AdminVolunteerManagementPage';
import { AdminAnalyticsPage } from '../pages/admin/AdminAnalyticsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';
import { AdminDisputesPage } from '../pages/admin/AdminDisputesPage';
import { AdminComplaintsPage } from '../pages/admin/AdminComplaintsPage';
import { AdminUserManagementPage } from '../pages/admin/AdminUserManagementPage';
import { AdminRoleManagementPage } from '../pages/admin/AdminRoleManagementPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminEmergencyModePage } from '../pages/admin/AdminEmergencyModePage';
import { AdminLogsPage } from '../pages/admin/AdminLogsPage';
import { AdminPermissionsPage } from '../pages/admin/AdminPermissionsPage';
import { AdminPlatformMonitoringPage } from '../pages/admin/AdminPlatformMonitoringPage';

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
      
      {/* Communication & Notification Hub Routes */}
      <Route path="/notifications" element={<NotificationCenterPage />} />
      <Route path="/notifications/preferences" element={<NotificationPreferencesPage />} />

      {/* Analytics & Smart Matching Routes */}
      <Route path="/analytics/impact" element={<ImpactDashboardPage />} />
      <Route path="/analytics/charts" element={<AnalyticsChartsPage />} />
      <Route path="/analytics/reports" element={<ReportsPage />} />
      <Route path="/analytics/matching" element={<SmartMatchingPage />} />

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
        <Route path="impact" element={<ImpactDashboardPage />} />
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
        <Route path="analytics" element={<AnalyticsChartsPage />} />
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
        <Route index element={<VolunteerDashboardPage />} />
        <Route path="dashboard" element={<VolunteerDashboardPage />} />
        <Route path="tasks/nearby" element={<VolunteerTasksPage />} />
        <Route path="tracking" element={<VolunteerLiveTrackingPage />} />
        <Route path="tracking/:id" element={<VolunteerLiveTrackingPage />} />
        <Route path="history" element={<VolunteerHistoryPage />} />
        <Route path="badges" element={<VolunteerBadgesPage />} />
        <Route path="leaderboard" element={<VolunteerLeaderboardPage />} />
        <Route path="ratings" element={<VolunteerRatingsPage />} />
        <Route path="notifications" element={<VolunteerNotificationsPage />} />
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
        <Route index element={<AdminDashboardPage />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="ngo-verification" element={<AdminNGOVerificationPage />} />
        <Route path="verifications" element={<AdminNGOVerificationPage />} />
        <Route path="donor-verification" element={<AdminDonorVerificationPage />} />
        <Route path="volunteers" element={<AdminVolunteerManagementPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="disputes" element={<AdminDisputesPage />} />
        <Route path="complaints" element={<AdminComplaintsPage />} />
        <Route path="users" element={<AdminUserManagementPage />} />
        <Route path="roles" element={<AdminRoleManagementPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="emergency" element={<AdminEmergencyModePage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="permissions" element={<AdminPermissionsPage />} />
        <Route path="monitoring" element={<AdminPlatformMonitoringPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
