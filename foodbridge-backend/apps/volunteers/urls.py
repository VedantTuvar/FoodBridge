from django.urls import path
from .views import VolunteerProfileView, ToggleAvailabilityView

urlpatterns = [
    path('profile/', VolunteerProfileView.as_view(), name='volunteer-profile'),
    path('availability/', ToggleAvailabilityView.as_view(), name='volunteer-toggle-availability'),
]
