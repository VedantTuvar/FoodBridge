from django.db.models import Avg
from .models import Rating
from apps.donors.models import DonorProfile
from apps.ngos.models import NGOProfile
from apps.volunteers.models import VolunteerProfile

class RatingService:
    @staticmethod
    def create_rating(task, rated_by, rated_user, score, comment=""):
        rating = Rating.objects.create(
            task=task,
            rated_by=rated_by,
            rated_user=rated_user,
            score=score,
            comment=comment
        )
        RatingService.recalculate_user_rating(rated_user)
        return rating

    @staticmethod
    def recalculate_user_rating(user):
        avg_score = Rating.objects.filter(rated_user=user).aggregate(Avg('score'))['score__avg']
        if avg_score is None:
            return

        avg_score = round(avg_score, 2)

        if user.role == 'donor' and hasattr(user, 'donor_profile'):
            user.donor_profile.rating_avg = avg_score
            user.donor_profile.save(update_fields=['rating_avg'])
        elif user.role == 'ngo' and hasattr(user, 'ngo_profile'):
            user.ngo_profile.rating_avg = avg_score
            user.ngo_profile.save(update_fields=['rating_avg'])
        elif user.role == 'volunteer' and hasattr(user, 'volunteer_profile'):
            user.volunteer_profile.rating_avg = avg_score
            user.volunteer_profile.save(update_fields=['rating_avg'])
