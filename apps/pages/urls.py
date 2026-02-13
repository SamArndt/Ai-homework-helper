from django.contrib.auth import views as auth_views
from django.views.generic.base import TemplateView
from django.contrib.auth.decorators import login_required
from django.urls import path
from pages import views

app_name = "pages"

urlpatterns = [
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("", TemplateView.as_view(template_name="pages/home.html"), name = "home"),
    path("dashboard", login_required(TemplateView.as_view(template_name="pages/dashboard.html")), name="dashboard"),
]
