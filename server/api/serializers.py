from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, UserProfile, Skill


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

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(
        queryset=Skill.objects.all(), many=True
    )

    class Meta:
        model = UserProfile
        fields = "__all__"

    def create(self, validated_data):
        skills = validated_data.pop("skills", [])
        user_profile = UserProfile.objects.create(**validated_data)
        user_profile.skills.set(skills)
        return user_profile
    
    def update(self, instance, validated_data):
        skills = validated_data.pop("skills", None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if skills is not None:
            instance.skills.set(skills)

        return instance

    
