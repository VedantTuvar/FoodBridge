from django.urls import path
from .views import (
    AdminDashboardStatsView,
    PendingNGOVerificationsView,
    ApproveNGOView,
    RejectNGOView,
    DonorVerificationsView,
    ApproveDonorView,
    VolunteerManagementView,
    AdminUserListView,
    ToggleUserStatusView,
    DisputesListView,
    ResolveDisputeView,
    ComplaintsListView,
    AuditLogsListView,
    PlatformSettingsView,
    EmergencyModeView,
    PlatformMonitoringView
)

urlpatterns = [
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('verifications/pending/', PendingNGOVerificationsView.as_view(), name='admin-pending-verifications'),
    path('verifications/<uuid:pk>/approve/', ApproveNGOView.as_view(), name='admin-approve-ngo'),
    path('verifications/<uuid:pk>/reject/', RejectNGOView.as_view(), name='admin-reject-ngo'),
    path('verifications/donors/', DonorVerificationsView.as_view(), name='admin-donor-verifications'),
    path('verifications/donors/<uuid:pk>/approve/', ApproveDonorView.as_view(), name='admin-approve-donor'),
    path('volunteers/', VolunteerManagementView.as_view(), name='admin-volunteers'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<uuid:pk>/toggle-status/', ToggleUserStatusView.as_view(), name='admin-toggle-user-status'),
    path('disputes/', DisputesListView.as_view(), name='admin-disputes'),
    path('disputes/<uuid:pk>/resolve/', ResolveDisputeView.as_view(), name='admin-resolve-dispute'),
    path('complaints/', ComplaintsListView.as_view(), name='admin-complaints'),
    path('logs/', AuditLogsListView.as_view(), name='admin-logs'),
    path('settings/', PlatformSettingsView.as_view(), name='admin-settings'),
    path('emergency/', EmergencyModeView.as_view(), name='admin-emergency'),
    path('monitoring/', PlatformMonitoringView.as_view(), name='admin-monitoring'),
]
