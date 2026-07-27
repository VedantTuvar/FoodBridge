from django.urls import path
from .views import DonorProfileView, DonorSettingsView

urlpatterns = [
    path('profile/', DonorProfileView.as_view(), name='donor-profile'),
    path('settings/', DonorSettingsView.as_view(), name='donor-settings'),
]
