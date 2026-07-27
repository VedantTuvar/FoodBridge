from django.urls import path
from .views import UserImpactView, GlobalPlatformImpactView

urlpatterns = [
    path('user/', UserImpactView.as_view(), name='analytics-user-impact'),
    path('global/', GlobalPlatformImpactView.as_view(), name='analytics-global-impact'),
]
