from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import UserPreferences

User = get_user_model()

# Checks if User has the correct Login information
class MeEndpointTest(APITestCase):
    def test_get_me_details(self):
        user = User.objects.create_user(email='t@t.com', password='pass', first_name='John', last_name='Doe')
        self.client.force_authenticate(user=user)
        
        url = reverse('user-me') 
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 't@t.com')
        self.assertEqual(response.data['first_name'], 'John')
        self.assertEqual(response.data['last_name'], 'Doe')


# python(3) manage.py test users.tests.onBoardingDataTest
                # .testUserxxxx
class OnboardingDataTest(APITestCase):

# Our User's Email Aligns with the object given

    def test_userEmail(self):
        user = User.objects.create_user(
            email = 'test@asu.edu',
            password = '1234'
        )

        self.assertEqual(
            str(user),
            'test@asu.edu')
        
# Checking for Correct password as well as that the password is not freely written out in the open

    def test_userPassword(self):
        user = User.objects.create_user(
            email = 'test@asu.edu',
            password= '1234'
        )

        self.assertTrue(
            user.check_password('1234')
        )
        self.assertNotEqual(
            user.password,
            '1234'
        )

# Checks if User Object is Assigned to its own 'Preferences'
    def test_userPreferences(self):
        
        user = User.objects.create_user(
            email='test@asu.edu', 
            password='1234')
        
        preferences = UserPreferences.objects.get(user = user)

        self.assertEqual(
            str(preferences),
            'test@asu.edu Settings')

