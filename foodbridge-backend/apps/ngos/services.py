from common.utils import create_geography_point
from .models import NGOProfile, NGOFoodRequest
from apps.donations.models import DonationImageUpload

class NGOService:
    @staticmethod
    def upload_verification_document(ngo_profile, file_obj):
        image_obj = DonationImageUpload.objects.create(image=file_obj)
        ngo_profile.verification_document_url = image_obj.image.url
        ngo_profile.verification_status = 'pending'
        ngo_profile.rejection_reason = None
        ngo_profile.save()
        return ngo_profile

    @staticmethod
    def create_food_request(ngo_profile, title, food_category, quantity_meals_needed, urgency_level, address, latitude, longitude):
        location = create_geography_point(latitude, longitude)
        request = NGOFoodRequest.objects.create(
            ngo=ngo_profile,
            title=title,
            food_category=food_category,
            quantity_meals_needed=quantity_meals_needed,
            urgency_level=urgency_level,
            address=address,
            location=location,
            is_fulfilled=False
        )
        return request

    @staticmethod
    def delete_food_request(request_id, ngo_profile):
        req = NGOFoodRequest.objects.get(id=request_id, ngo=ngo_profile)
        req.delete()
