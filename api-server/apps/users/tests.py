from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

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
