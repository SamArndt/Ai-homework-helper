import os
from django.shortcuts import render
from math_tutor.views import process_chat
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from openai import OpenAI
from math_tutor.models import Topic, ChatMessage
import json

# Create your views here.
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def generate_evaluation_quiz(request):
    topic = request.data.get("topic")
    return Response({"topic": topic, "quiz": process_chat("generate-evaluation-quiz", {"topic": topic})})

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def check_evaluation_answers(request):
    topic = request.data.get("topic")
    questions = request.data.get("quiz")
    answers = request.data.get("answers")
    return Response({"topic": topic, "evaluation": process_chat("check-evaluation-answers", {"topic": topic, "questions": questions, "answers": answers})})
