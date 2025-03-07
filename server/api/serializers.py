from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, UserAvailability, UserSkills


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "is_admin"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["email", "password", "is_admin"]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"], 
            password=validated_data["password"], 
            is_admin=validated_data.get("is_admin", False)
        )
        return user
class UserAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAvailability
        fields = ["date"]
    
    def create(self, validated_data):
        user_profile = self.context["request"].user.profile
        return UserAvailability.objects.create(user_profile=user_profile, **validated_data)

class UserSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkills
        fields = ["name"]
    
    def create(self, validated_data):
        user_profile = self.context["request"].user.profile
        return UserSkills.objects.create(user_profile=user_profile, **validated_data)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
        extra_kwargs = {
            "address2": {"required": False},
            "user": {"required": False},
        }
    
