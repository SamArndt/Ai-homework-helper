from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

class AiView(APIView):
    def get(self, request):
        return Response({"message": "Hello from the AI view!"})
    
    def post(self, request):
        data = request.data
        return Response({"message": "Data received", "data": data})
    
class GetStepsView(APIView):
    def get(self, request):
        return Response({"message": "Hello from the Get Steps view!"})

class ClassifyView(APIView):
    def get(self, request):
        return Response({"message": "Hello from the Classify view!"})
    
    
# Stubbed out view. Previous version was also not implemented. May remove in future
class GetSolutionView(APIView):
    def get(self, request):
        return Response({"message": "Hello from the Get Solution view!"})