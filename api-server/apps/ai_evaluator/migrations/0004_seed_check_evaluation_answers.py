# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_check_evaluation_answers(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="check-evaluation-answers",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.7,
            "system_content": (
              "You are a knowledgeable algebra tutor generating a short quiz to assess a student's understanding of a given topic. "
              "Always return valid JSON only — no markdown, no preamble."
            ),
            "user_content": '''You are an expert Algebra 1 tutor evaluating a student's quiz performance.

Topic: "{topic}"

You were given the following questions:
{questions}

The student provided the following answers:
{answers}

Your job is to:
1. Evaluate each answer and determine if the student got it correct or not
2. Identify patterns in what the student understands and what they are struggling with
3. Generate 3 targeted word problems to further evaluate the specific gaps in their understanding

Requirements for the word problems:
- Each problem must be a real-world scenario (bakery, sports, travel, shopping, etc.)
- Problems should directly target the concepts the student got WRONG or showed weakness in
- If the student answered everything correctly, generate problems that go one level deeper
- Problems must be solvable using Algebra 1 concepts related to "{topic}"
- Keep language clear and age-appropriate for a high school student
- The "question_breakdown" array must contain one entry for EVERY question in the quiz — do not skip any questions

Return ONLY this JSON (no markdown, no extra text):
{{
  "topic": "the topic name here",
  "summary": "A 2-3 sentence plain-english summary of what the student understands well",
  "gaps": "A 2-3 sentence plain-english summary of what the student is struggling with and why it matters",
  "question_breakdown": [
    {{
      "question_number": 1,
      "question": "The original question text",
      "student_answer": "What the student answered",
      "is_correct": true,
      "explanation": "Why their answer is correct or incorrect in simple terms the student can understand"
    }},
    {{
      "question_number": 2,
      "question": "The original question text",
      "student_answer": "What the student answered",
      "is_correct": false,
      "explanation": "Why their answer is correct or incorrect in simple terms the student can understand"
    }},
    // ... one entry per question, dynamically generated for all questions in the quiz
  ],
  "word_problems": [
    {{
      "topic": "the specific sub-concept this problem targets",
      "problem": "A full word problem sentence here"
    }},
    {{
      "topic": "the specific sub-concept this problem targets",
      "problem": "A full word problem sentence here"
    }},
    {{
      "topic": "the specific sub-concept this problem targets",
      "problem": "A full word problem sentence here"
    }}
  ]
}}
''',
        }
    )

class Migration(migrations.Migration):
    dependencies = [
        ('ai_evaluator', '0003_update_evaluation_quiz_data'),
    ]

    operations = [
        migrations.RunPython(seed_check_evaluation_answers),
    ]
