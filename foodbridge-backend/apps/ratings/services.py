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

        if user.role == 'donor':
            donor_profile = getattr(user, 'donor_profile', None)
            if donor_profile is not None:
                donor_profile.rating_avg = avg_score
                donor_profile.save(update_fields=['rating_avg'])
        elif user.role == 'ngo':
            ngo_profile = getattr(user, 'ngo_profile', None)
            if ngo_profile is not None:
                ngo_profile.rating_avg = avg_score
                ngo_profile.save(update_fields=['rating_avg'])
        elif user.role == 'volunteer':
            volunteer_profile = getattr(user, 'volunteer_profile', None)
            if volunteer_profile is not None:
                volunteer_profile.rating_avg = avg_score
                volunteer_profile.save(update_fields=['rating_avg'])
