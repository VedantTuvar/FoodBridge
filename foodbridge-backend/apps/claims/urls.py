from django.urls import path
from .views import ClaimDonationView

urlpatterns = [
    path('<uuid:donation_id>/', ClaimDonationView.as_view(), name='claim-donation'),
]
