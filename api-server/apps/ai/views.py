from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class AiView(APIView):
    def get(self, request):
        # Here you would typically generate a response based on the request data
        return Response({"message": "Hello from the AI view!"})
    
    def post(self, request):
        # Here you would typically process the request data and generate a response
        data = request.data
        # For demonstration, we'll just echo back the received data
        return Response({"message": "Data received", "data": data})
    
