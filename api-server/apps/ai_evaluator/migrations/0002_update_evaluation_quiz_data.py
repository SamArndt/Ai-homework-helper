# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_evaluation_quiz(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="generate-evaluation-quiz",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.7,
            "system_content": (
              "You are a knowledgeable algebra tutor generating a short quiz to assess a student's understanding of a given topic. "
              "Always return valid JSON only — no markdown, no preamble."
            ),
            "user_content": '''You are evaluating a student's algebra skills based on a given topic.
Topic: "{topic}"

Before generating the quiz, provide key learning context about the topic. Then generate a 3-question quiz to gauge the student's understanding.

Requirements for the quiz:
- Each question should test a different aspect or difficulty level of the topic (easy, medium, hard)
- Questions should be clear and appropriate for an algebra student
- Include the correct answer and a brief explanation for each question

Return ONLY this JSON (no markdown, no extra text):
{{
  "facts": "A brief summary of the key facts about this topic",
  "strategies": "The key strategies or methods used to solve problems related to this topic",
  "rationale": "Why this topic is important and how it connects to broader algebra concepts",
  "quiz": [
    {{
      "question_number": 1,
      "difficulty": "easy",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 2,
      "difficulty": "medium",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }},
    {{
      "question_number": 3,
      "difficulty": "hard",
      "question": "The question text here",
      "correct_answer": "The correct answer here",
      "explanation": "Brief explanation of why this is correct"
    }}
  ]
}}
''',
        }
    )

class Migration(migrations.Migration):
    dependencies = [
        ('ai_evaluator', '0001_seed_evaluation_quiz'),
    ]

    operations = [
        migrations.RunPython(seed_evaluation_quiz),
    ]
