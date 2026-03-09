from enum import Enum

# Enum definitions
class SubjectId(Enum):
  Variables = 0
  Expressions = 1
  OrderOfOperations = 2
  FunctionsGeneral = 3
  SystemsOfEquations = 4
  Polynomials = 5
  LinearFunctions = 6
  QuadraticFunctions = 7
  Exponents = 8
  AbsoluteValue = 9
  Radicals = 10
  LinearEquations = 11
  LinearInequalities = 12
  SystemsOfInequalities = 13
  SlopeIntercept = 14
  FunctionBasics = 15
  DomainRange = 16
  Piecewise = 17
  Factoring = 18
  CompletingTheSquare = 19
  QuadraticFormula = 20
  ScientificNotation = 21
  SequencesArithmetic = 22


# Interface definitions
class StepByStepSolution:
  def __init__(self, id: int, problemId: int, steps: object):
    self.id = id
    self.problemId = problemId
    self.steps = steps


class ProblemClassification:
    def __init__(self, id: int, name: str, confidence: float, subjects: list, description: str = None):
        self.id = id                                                # Unique identifier for the classification
        self.name = name                                            # Name of the classification
        self.confidence = confidence                                # Confidence level of the classification (0.00 to 1.00)
        self.subjects = subjects                                    # Optional subject information associated with the classification
        self.description = description                              # Optional description of the classification

class SubjectInfo:
    def __init__(self, name: str, id: SubjectId, relatedSubjects: list = None, details: str = None):    
        self.name = name                                            # Name of the subject
        self.id = id                                                # Unique identifier for the subject
        self.relatedSubjects = relatedSubjects                      # Optional array of related subjects
        self.details = details                                      # Optional additional details about the subject
