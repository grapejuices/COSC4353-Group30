"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from .views import RegisterView, LoginView, UserHistoryDetailView, UserProfileView, UserAvailabilityView, UserSkillsView, EventDetailsView, EventSkillsView, UsersListView, UserDetailView, EventDetailedView, VolunteerHistoryView, VolunteerHistoryBulkCreateView, NotificationsView, EventCSVReportView, EventPDFReportView, VolunteerReportCSV, VolunteerReportPDF

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("availabilities/", UserAvailabilityView.as_view(), name="availabilities"),
    path("skills/", UserSkillsView.as_view(), name="skills"),
    path("events/", EventDetailsView.as_view(), name="events"),
    path("events/<int:pk>/", EventDetailedView.as_view(), name="events"),
    path("event-skills/", EventSkillsView.as_view(), name="event-skills"),
    path("users/", UsersListView.as_view(), name="users"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user"),
    path("history/<int:pk>/", UserHistoryDetailView.as_view(), name="history"),
    path("volunteer-history/", VolunteerHistoryView.as_view(), name="volunteer-history"),
    path("volunteer-history/bulk-create/", VolunteerHistoryBulkCreateView.as_view(), name="volunteer-history-bulk-create"),
    path("notifications/", NotificationsView.as_view(), name="notifications"),
    path("report/events/csv/", EventCSVReportView.as_view(), name="event-csv-report"),
    path("report/events/pdf/", EventPDFReportView.as_view(), name="event-pdf-report"),
    path("report/volunteer-history/csv/", VolunteerReportCSV.as_view(), name="volunteer-history-csv-report"),
    path("report/volunteer-history/pdf/", VolunteerReportPDF.as_view(), name="volunteer-history-pdf-report"),
]
