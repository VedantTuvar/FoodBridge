from django.urls import path
from .views import (
    NGOProfileView, NGOVerificationUploadView, 
    NGOFoodRequestListCreateView, NGOFoodRequestDetailView,
    NGOAnalyticsView
)

urlpatterns = [
    path('profile/', NGOProfileView.as_view(), name='ngo-profile'),
    path('upload-verification/', NGOVerificationUploadView.as_view(), name='ngo-upload-verification'),
    path('food-requests/', NGOFoodRequestListCreateView.as_view(), name='ngo-food-request-list-create'),
    path('food-requests/<uuid:pk>/', NGOFoodRequestDetailView.as_view(), name='ngo-food-request-detail'),
    path('analytics/', NGOAnalyticsView.as_view(), name='ngo-analytics'),
]
