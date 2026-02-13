from django.contrib.auth.forms import AuthenticationForm
from users.forms import CustomUserCreationForm

class PagesLoginForm(AuthenticationForm):
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    for field_name, field in self.fields.items():
      field.widget.attrs['class'] = 'form-control my-2'


class PagesUserCreationForm(CustomUserCreationForm):
  class Meta(CustomUserCreationForm.Meta):
    fields = ('first_name', 'last_name', 'email')

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    for field_name, field in self.fields.items():
      field.widget.attrs['class'] = 'form-control my-2'