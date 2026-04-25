# Generated migration — seed grade-step ChatMessage
from django.db import migrations


def seed_check_exam_answers(apps, schema_editor):
    ChatMessage = apps.get_model('math_tutor', 'ChatMessage')
    ChatMessage.objects.update_or_create(
        slug="check-exam-answers",
        defaults={
            "llm_model": "gpt-4o-mini",
            "temperature": 0.2,
            "system_content": (
              "You are a specialized Standardized Exam Designer. Your task is to generate realistic, high-fidelity practice exams for any professional or academic topic. You must adhere strictly to valid JSON output."
            ),
            "user_content": '''You are grading a professional practice exam for: "{topic}".

You will be given the exam questions and the student's answers. Evaluate each answer thoroughly and return detailed feedback.

Exam Questions:
{questions}

Student Answers:
{answers}

Requirements:
- Grade every question including sub-questions in integrated sets.
- For multiple choice and true/false, mark correct or incorrect with an explanation.
- For multiple select, mark correct only if the student selected the right combination.
- For short answer and essay, evaluate based on accuracy, completeness, and legal/professional reasoning.

Return ONLY this JSON structure:
{{
  "exam_title": "Evaluation for {topic}",
  "summary": "Overall performance summary in 2-3 sentences.",
  "score": {{
    "earned": number of correct answers,
    "total": total number of gradeable questions,
    "percentage": percentage as a number
  }},
  "question_breakdown": [
    {{
      "id": 1,
      "type": "multiple_choice",
      "prompt": "Original question text",
      "student_answer": "What the student selected",
      "correct_answer": "The correct answer",
      "is_correct": true or false,
      "explanation": "Why this answer is correct or incorrect."
    }},
    {{
      "id": "2a",
      "type": "short_answer",
      "prompt": "Original question text",
      "student_answer": "What the student wrote",
      "is_correct": true or false,
      "explanation": "Detailed feedback on their answer and what a strong answer would include."
    }},
    {{
      "id": "2b",
      "type": "multiple_select",
      "prompt": "Original question text",
      "student_answer": ["Selected option 1", "Selected option 2"],
      "correct_answer": ["Correct option 1", "Correct option 2"],
      "is_correct": true or false,
      "explanation": "Why these are or are not the correct selections."
    }}
  ],
  "gaps": "Key concepts or areas the student needs to review.",
  "strengths": "Areas where the student demonstrated strong understanding."
}}''',
        }
    )

class Migration(migrations.Migration):
    dependencies = [
        ('exam_generator', '0001_seed_exam_generator'),
    ]

    operations = [
        migrations.RunPython(seed_check_exam_answers),
    ]
