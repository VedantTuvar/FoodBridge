from django.urls import path
from .views import DonationListCreateView, DonationDetailView, CancelDonationView

urlpatterns = [
    path('', DonationListCreateView.as_view(), name='donation-list-create'),
    path('<uuid:pk>/', DonationDetailView.as_view(), name='donation-detail'),
    path('<uuid:pk>/cancel/', CancelDonationView.as_view(), name='donation-cancel'),
]
