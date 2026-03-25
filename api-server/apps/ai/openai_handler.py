import logging
import os
import random
import json
import re
import time
from typing import Any
from openai import OpenAI

logger = logging.getLogger(__name__)

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

DEFAULT_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
DEFAULT_CONTEXT = "You are a helpful assistant."
DEFAULT_MATH_TEACHER_CONTEXT = "You are a helpful math teacher that creates Algebra 1 word problems. You create engaging, real-world problems that help students understand mathematical concepts."
DEFAULT_TOPICS = [
                    "linear equations in slope-intercept form (y = mx + b)",
                    "linear equations in point-slope form",
                    "linear equations in standard form (Ax + By = C)",
                    "finding slope from two points",
                    "finding slope from a graph",
                    "parallel and perpendicular lines",
                    "quadratic equations and parabolas",
                    "factoring quadratic expressions",
                    "solving quadratic equations by factoring",
                    "quadratic formula",
                    "completing the square",
                    "systems of linear equations",
                    "solving systems by substitution",
                    "solving systems by elimination",
                    "linear inequalities",
                    "systems of inequalities",
                    "polynomials (addition, subtraction, multiplication)",
                    "factoring polynomials",
                    "exponential functions",
                    "absolute value equations",
                    "rational expressions",
                    "radical expressions"
]

class OpenAIHandler:
    @staticmethod
    def generate_text(prompt: str, context: str | None = None) -> str:
        # Validate input
        if not isinstance(prompt, str) or not prompt.strip():
            raise ValueError("Prompt must be a string.")
        
        if not isinstance(context, str) or not context.strip():
            context = DEFAULT_CONTEXT

        # Process request
        try:
            response = client.chat.completions.create(
                model = DEFAULT_MODEL,
                messages = [
                    {"role": "system", "content": context},
                    {"role": "user", "content": prompt},
                ],
            )

            text = response.choices[0].message.content or ""
            return text.strip()
        except Exception as e:
            logger.exception("Error generating text: %s", e)
            raise

    @staticmethod
    def generate_from_image(prompt: str, image: str | None = None, context: str | None = None) -> str:
        # Validate input
        if not isinstance(prompt, str) or not prompt.strip():
            raise ValueError("Prompt must be a string.")
        
        if not isinstance(image, str) or not image.strip():
            # No image data, treat as text-only query
            return OpenAIHandler.generate_text(prompt, context)

        if not isinstance(context, str) or not context.strip():
            context = DEFAULT_CONTEXT

        # Process request
        try:
            response = client.chat.completions.create(
                model = DEFAULT_MODEL,
                messages=[
                    {"role": "system", "content": context},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image}"
                                },
                            },
                        ],
                    },
                ],
            )

            text = response.choices[0].message.content or ""
            return text.strip()
        
        except Exception as e:
            logger.exception("Error generating text from image: %s", e)
            raise

    @staticmethod
    def generate_math_problem(topic_descriptions: list[str] | None = None) -> str:
        if not topic_descriptions or len(topic_descriptions) == 0:
            topic_descriptions = DEFAULT_TOPICS
        
        selected_topic = random.choice(topic_descriptions)
        prompt = f"""Generate a single Algebra 1 word problem about {selected_topic}. 
        The problem should:
            - Be appropriate for Algebra 1 students
            - Be a real-world scenario or application
            - Include all necessary information to solve the problem
            - Use clear, age-appropriate language
            - Return only the problem text, no solutions, explanations, or equations in the problem text itself (the equation will be extracted  separately)
        Example format: "A car rental company charges a base fee of $25 plus $0.15 per mile driven. If you have a budget of $100, how many miles can you drive?"
        Do NOT include equations like "y = mx + b" or "y = 25 + 0.15x" in the problem text itself - just describe the scenario."""

        try:
            response = client.chat.completions.create(
                model = DEFAULT_MODEL,
                messages = [
                    {"role": "system", "content": DEFAULT_MATH_TEACHER_CONTEXT},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.8,
            )

            text = response.choices[0].message.content or ""
            return text.strip()

        except Exception as e:
            logger.exception("Error generating math problem: %s", e)
            raise

    @staticmethod
    def extract_equation(problem_text: str) -> dict[str, Any]:
        if not isinstance(problem_text, str) or not problem_text.strip():
            raise ValueError("Problem text must be a non-empty string.")
        
        prompt = f"""Extract the equation from this algebra problem.
        Problem: "{problem_text}"
        INSTRUCTIONS:
        1. Identify the BASIC FORMULA (like "y = mx + b" for linear, "A = lw" for area, "d = rt" for distance)
        2. Create the SUBSTITUTED EQUATION with actual values from the problem
        3. Extract variable values from the substituted equation and list them simply

        Return ONLY a valid JSON object with this EXACT structure:
        {{
        "equation": "y = mx + b",
        "substitutedEquation": "y = 4x + 30",
        "variables": ["slope m = 4", "y-intercept b = 30"]
        }}

        For systems of equations:
        {{
        "equation": "x + y = total, ax + by = cost",
        "substitutedEquation": "x + y = 85, 12x + 8y = 820",
        "variables": []
        }}

        RULES:
        - equation: The basic formula/formulas ONLY - just the mathematical expression
        - substitutedEquation: Same formula with values plugged in - ONLY mathematical expressions
        - variables: Simple list of extracted values, format as "description variable = value"
        - For systems: variables should be empty []
        - Only include variables that have numeric values in the substituted equation

        CRITICAL:
        - DO NOT include words like "text", "and", or other descriptive words in the equation strings
        - DO NOT use LaTeX environment commands like \\begin{{cases}}, \\end{{cases}}, etc.
        - For systems, format as: "x + y = 85, 12x + 8y = 820"
        - Keep equations clean and mathematical only - plain text format, no LaTeX environments

        If no equation can be found, return:
        {{
        "equation": "",
        "substitutedEquation": "",
        "variables": []
        }}"""
        
        try:
            response = client.chat.completions.create(
                model = DEFAULT_MODEL,
                messages = [
                    {
                        "role": "system",
                        "content": (
                            "You are a math analysis expert. Extract equations and variable values "
                            "from algebra problems. Always return valid JSON."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                response_format={"type": "json_object"},
            )

            # text = response.choices[0].message.content or "{}"
            # logger.debug("Raw extraction response: %s", text)
            # return text.strip()

            text = response.choices[0].message.content or "{}"
            logger.debug("Raw extraction response: %s", text)

            # Parse JSON
            parsed = json.loads(text)

            if not isinstance(parsed, dict):
                raise ValueError("Invalid response structure from AI")

            # Clean equation strings
            def clean_equation(eq: str) -> str:
                if not eq:
                    return ""
                eq = re.sub(r"\btext\s+and\s+", "", eq, flags=re.IGNORECASE)
                eq = re.sub(r"\btext\s*,?\s*", "", eq, flags=re.IGNORECASE)
                eq = re.sub(r",\s*,\s*", ", ", eq)
                eq = re.sub(r"^\s*,\s*", "", eq)
                eq = re.sub(r"\s*,\s*$", "", eq)
                return eq.strip()

            # Normalize variables
            variables = parsed.get("variables", [])
            cleaned_variables: list[str] = []

            if isinstance(variables, list):
                cleaned_variables = [
                    v.strip()
                    for v in variables
                    if isinstance(v, str) and v.strip()
                ]
            elif isinstance(variables, dict):
                cleaned_variables = [
                    f"{value} {key}"
                    for key, value in variables.items()
                    if value is not None
                ]

            return {
                "equation": clean_equation(parsed.get("equation", "")),
                "substitutedEquation": clean_equation(parsed.get("substitutedEquation", "")),
                "variables": cleaned_variables,
            }

        except Exception as e:
            logger.exception("Error extracting equation: %s", e)
            raise

    @staticmethod
    def simulate_delay(milliseconds: int, status: int, data: str | None = None) -> str:
        logger.debug("Simulating delay of %d ms", milliseconds)
        seconds = max(milliseconds, 1) / 1000.0
        time.sleep(seconds)
        logger.debug("Returning response after delay: status=%d, data=%s", status, data)
        return f"Simulated response with status {status} and data: {data or ''}"


