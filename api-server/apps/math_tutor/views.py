import os
from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from openai import OpenAI
from .models import Topic, ChatMessage

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

@api_view()
@permission_classes([permissions.IsAuthenticated])
def generate_math_problem(request):
    topic = Topic.objects.order_by('?').first()
    return Response({"topic": topic.value, "problem": process_chat("generate-math-problem", {"topic": topic.value})})


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
