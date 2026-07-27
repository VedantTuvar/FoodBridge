from django.urls import path
from .views import (
    VolunteerProfileView,
    ToggleAvailabilityView,
    VolunteerLeaderboardView,
    VolunteerBadgesView
)

urlpatterns = [
    path('profile/', VolunteerProfileView.as_view(), name='volunteer-profile'),
    path('availability/', ToggleAvailabilityView.as_view(), name='volunteer-toggle-availability'),
    path('leaderboard/', VolunteerLeaderboardView.as_view(), name='volunteer-leaderboard'),
    path('badges/', VolunteerBadgesView.as_view(), name='volunteer-badges'),
]

