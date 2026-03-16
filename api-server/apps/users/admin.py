from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserPreferences
from .forms import CustomUserCreationForm, CustomUserChangeForm

class UserSettingsInline(admin.StackedInline):
    model = UserPreferences
    max_num = 1
    can_delete = False

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User

    inlines = [UserSettingsInline]

    list_display = ('email', 'is_staff', 'is_active')
    ordering = ('email',)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("is_staff", "is_active", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ( "email", "password1", "password2", "first_name", "last_name")}
        ),
    )

admin.site.register(User, CustomUserAdmin)
