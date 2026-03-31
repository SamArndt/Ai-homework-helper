import os
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from openai import OpenAI
from .models import Topic, ChatMessage
import json

# Create your views here.
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def solve_math_problem(request):
    return Response(
        {
            "solution": process_chat("solve-math-problem", {"topic": request.data.get('topic'), "problem": request.data.get('problem')})
        }
    )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_hint(request):
    hint_num = request.data.get("hint_number", 1) 
    slug = f"generate-hint-{hint_num}" 
    
    data_map = {
        "topic": request.data.get('topic'),
        "problem": request.data.get('problem')
    }

    return Response({
        "hint_number": hint_num,
        "hint": process_chat(slug, data_map)
    })

@api_view()
@permission_classes([permissions.IsAuthenticated])
def generate_math_problem(request):
    topic = Topic.objects.order_by('?').first()
    return Response({"topic": topic.value, "problem": process_chat("generate-math-problem", {"topic": topic.value})})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def grade_step(request):
    data_map = {
        "problem": request.data.get('problem'),
        "instruction": request.data.get('instruction'),
        "checkpoint": request.data.get('checkpoint'),
        "student_answer": request.data.get('student_answer'),
    }
    result = process_chat("grade-step", data_map)
    try:
        return Response(json.loads(result))
    except (json.JSONDecodeError, TypeError):
        return Response({"pass": False, "explanation": result})
    

def process_chat(message_slug, data_map):
    chat_message = ChatMessage.objects.get(slug=message_slug)

    response = client.chat.completions.create(
        model=chat_message.llm_model,
        messages=[
            {"role": "system", "content": chat_message.system_content},
            {"role": "user", "content": chat_message.user_content.format_map(data_map)},
        ],
    )
    return response.choices[0].message.content
