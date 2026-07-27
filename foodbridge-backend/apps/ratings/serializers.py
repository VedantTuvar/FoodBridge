from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    rated_by_name = serializers.CharField(source='rated_by.full_name', read_only=True)
    rated_user_name = serializers.CharField(source='rated_user.full_name', read_only=True)

    class Meta:
        model = Rating
        fields = ('id', 'task', 'rated_by', 'rated_by_name', 'rated_user', 'rated_user_name', 'score', 'comment', 'created_at')
        read_only_fields = ('id', 'rated_by', 'created_at')
