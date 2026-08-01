from django.urls import path
from .views import SmartMatchingRecommendationView

urlpatterns = [
    path('recommend/', SmartMatchingRecommendationView.as_view(), name='matching-recommend'),
]
