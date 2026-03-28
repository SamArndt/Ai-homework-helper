from django.urls import path, include
from .views import ClassroomView, ClassesView, EnrolledView, StaffView, ReportView
from rest_framework.routers import DefaultRouter

router = DefaultRouter

urlpatterns = [
    path('', include(router.urls)),
    path('classroom', ClassroomView.as_view(), name='classroom'),
    path('classroom/classes', ClassesView.as_view(), name='classes'),
    path('classroom/enrolled', EnrolledView.as_view(), name="enrolled"),
    path('classroom/staff', StaffView.as_view(), name='staff'),
    path('classroom/report', ReportView.as_view(), name="report"),
]