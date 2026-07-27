from django.urls import path
from .views import (
    DonationListCreateView, DonationDetailView, CancelDonationView,
    RecurringScheduleListCreateView, RecurringScheduleDetailView,
    DonationImageUploadView
)

urlpatterns = [
    path('', DonationListCreateView.as_view(), name='donation-list-create'),
    path('upload-image/', DonationImageUploadView.as_view(), name='donation-upload-image'),
    path('recurring-schedules/', RecurringScheduleListCreateView.as_view(), name='recurring-schedule-list-create'),
    path('recurring-schedules/<uuid:pk>/', RecurringScheduleDetailView.as_view(), name='recurring-schedule-detail'),
    path('<uuid:pk>/', DonationDetailView.as_view(), name='donation-detail'),
    path('<uuid:pk>/cancel/', CancelDonationView.as_view(), name='donation-cancel'),
]
