import { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { AuthContext } from './context/AuthContext'

function parseSolution(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const DifficultyBadge = ({ difficulty }) => {
  const level = difficulty?.toLowerCase() ?? 'medium'
  return (
    <span className={`eval-badge eval-badge-${level}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

const CorrectnessBadge = ({ isCorrect }) => (
  <span
    className={`eval-badge ${isCorrect ? 'eval-badge-easy' : 'eval-badge-hard'}`}
  >
    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
  </span>
)

function PracticeMode({ problem, topic, onBack, getHeaders }) {
  const [solution, setSolution] = useState(null)
  const [solutionLoading, setSolutionLoading] = useState(true)
  const [hints, setHints] = useState([])
  const [hintNumber, setHintNumber] = useState(1)
  const [loadingHint, setLoadingHint] = useState(false)
  const [openHintIndex, setOpenHintIndex] = useState(null)
  const [work, setWork] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [devMode, setDevMode] = useState(false)

  useEffect(() => {
    const solve = async () => {
      setSolutionLoading(true)
      try {
        const res = await fetch('/api/v1/solve_problem/', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ problem, topic }),
        })
        const data = await res.json()
        setSolution(data.solution)
      } catch {
        console.error('Solve error')
      } finally {
        setSolutionLoading(false)
      }
    }
    solve()
  }, [problem, topic])

  const fetchHint = async () => {
    if (hintNumber > 3 || loadingHint) return
    setLoadingHint(true)
    try {
      const res = await fetch('/api/v1/generate_hint/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ hint_number: hintNumber, topic, problem }),
      })
      const data = await res.json()
      setHints((prev) => [
        ...prev,
        { number: data.hint_number, text: data.hint },
      ])
      setHintNumber((n) => n + 1)
      setOpenHintIndex(hints.length)
    } catch {
      console.error('Hint error')
    } finally {
      setLoadingHint(false)
    }
  }

  const validateStep = async () => {
    if (!work.trim() || !parsed) return
    setIsValidating(true)
    const isLastStep = currentStepIndex >= steps.length
    const target = isLastStep
      ? { instruction: 'Final Answer', checkpoint: parsed.finalAnswer }
      : steps[currentStepIndex]

    try {
      const res = await fetch('/api/v1/grade_step/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          problem,
          instruction: target.instruction,
          checkpoint: target.checkpoint,
          student_answer: work,
        }),
      })
      const result = await res.json()
      if (result.pass) {
        setWork('')
        setCurrentStepIndex((prev) => prev + 1)
        setFeedback({ ...result, success: true })
      } else {
        setFeedback({ ...result, success: false })
      }
    } catch {
      setFeedback({ explanation: 'Connection error.', success: false })
    } finally {
      setIsValidating(false)
    }
  }

  const parsed = parseSolution(solution)
  const steps = parsed?.steps || []
  const isFinished = parsed && currentStepIndex > steps.length

  return (
    <>
      <div className="study-bg" />
      <div className="study-scroll">
        <div className="study-scroll-inner">
          <div className="study-card">
            <div className="study-title-block">
              <p className="study-eyebrow">{topic || 'Algebra 1'} — Practice</p>
              <h1 className="study-title">Word Problem</h1>
            </div>

            {/* Problem statement */}
            <div className="study-problem">
              <p className="study-problem-label">Problem</p>
              <div className="study-problem-text">
                <ReactMarkdown>{problem}</ReactMarkdown>
              </div>
            </div>

            {solutionLoading ? (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">Setting up the problem…</p>
              </div>
            ) : !isFinished ? (
              <>
                {/* Dev mode toggle */}
                <div className="study-dev-toggle">
                  <input
                    type="checkbox"
                    id="devmode"
                    checked={devMode}
                    onChange={() => setDevMode(!devMode)}
                  />
                  <label htmlFor="devmode">Enable Dev Mode</label>
                </div>

                {devMode && parsed && (
                  <div
                    className="study-dev-answer"
                    style={{ marginBottom: '1rem' }}
                  >
                    <span>Expected:</span>{' '}
                    {currentStepIndex >= steps.length
                      ? parsed.finalAnswer
                      : steps[currentStepIndex].checkpoint}
                  </div>
                )}

                {/* Step header + hint button */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <p
                    className="study-instruction"
                    style={{ textAlign: 'left', margin: 0, fontWeight: '700' }}
                  >
                    Step {currentStepIndex + 1}:{' '}
                    {parsed
                      ? currentStepIndex >= steps.length
                        ? 'Final Answer'
                        : steps[currentStepIndex].instruction
                      : '…'}
                  </p>
                  {hintNumber <= 3 && (
                    <button
                      onClick={fetchHint}
                      disabled={loadingHint}
                      style={{
                        background: 'none',
                        border: '1px solid #7c3aed',
                        color: '#7c3aed',
                        borderRadius: '6px',
                        padding: '2px 8px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                      }}
                    >
                      {loadingHint ? '…' : `+ Hint (${4 - hintNumber})`}
                    </button>
                  )}
                </div>

                {/* Hints accordion */}
                {hints.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {hints.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          border: '1px solid #ddd6fe',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#faf9ff',
                        }}
                      >
                        <button
                          onClick={() =>
                            setOpenHintIndex(openHintIndex === i ? null : i)
                          }
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.6rem 0.8rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#7c3aed',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                          }}
                        >
                          <span>💡 Hint {h.number}</span>
                          <span>{openHintIndex === i ? '▲' : '▼'}</span>
                        </button>
                        {openHintIndex === i && (
                          <div
                            style={{
                              padding: '0 0.8rem 0.6rem',
                              fontSize: '0.85rem',
                              color: '#4c1d95',
                              borderTop: '1px solid #ede9fe',
                              paddingTop: '0.5rem',
                            }}
                          >
                            {h.text}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Work input */}
                <textarea
                  className="study-textarea"
                  placeholder="Show your work for this step…"
                  rows={4}
                  value={work}
                  onChange={(e) => setWork(e.target.value)}
                />

                {/* Feedback */}
                {feedback && (
                  <div
                    style={{
                      padding: '0.8rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      marginTop: '1rem',
                      background: feedback.success ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${feedback.success ? '#bbf7d0' : '#fecaca'}`,
                      color: feedback.success ? '#166534' : '#991b1b',
                    }}
                  >
                    <strong>
                      {feedback.success ? 'Correct' : 'Not quite'}
                    </strong>
                    : {feedback.explanation}
                  </div>
                )}

                <div className="study-buttons" style={{ marginTop: '1rem' }}>
                  <button
                    className="study-btn-primary"
                    onClick={validateStep}
                    disabled={isValidating || !work.trim() || !parsed}
                  >
                    {isValidating ? 'Checking…' : 'Check Step'}
                  </button>
                </div>
              </>
            ) : (
              /* Finished */
              <div className="study-success">
                <span className="study-success-emoji">🎉</span>
                <p className="study-success-title">Problem Solved!</p>
                <div className="study-success-answer">
                  Final Answer: {parsed?.finalAnswer}
                </div>
              </div>
            )}

            <button
              className="study-btn-secondary"
              style={{ marginTop: '2.5rem', fontSize: '0.8rem' }}
              onClick={onBack}
            >
              ← Back to Results
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const Evaluator = () => {
  const { token } = useContext(AuthContext)

  const getCsrfToken = () =>
    document.cookie
      .split('; ')
      .find((r) => r.startsWith('csrftoken='))
      ?.split('=')[1]

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),
    Authorization: `Token ${token}`,
  })

  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelected] = useState('')
  const [loadingTopics, setLTLoading] = useState(true)
  const [loadingQuiz, setLQLoading] = useState(false)
  const [loadingEval, setLELoading] = useState(false)
  const [rawMeta, setRawMeta] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [evaluation, setEvaluation] = useState(null)
  const [error, setError] = useState('')
  const [practiceProb, setPracticeProb] = useState(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch('/api/v1/topics/', { headers: getHeaders() })
        const data = await res.json()
        setTopics(data)
      } catch {
        setError('Failed to load topics.')
      } finally {
        setLTLoading(false)
      }
    }
    fetchTopics()
  }, [])

  const handleTopicChange = async (e) => {
    const topic = e.target.value
    setSelected(topic)
    if (!topic) {
      setRawMeta(null)
      setQuestions([])
      return
    }

    setLQLoading(true)
    setError('')
    setRawMeta(null)
    setQuestions([])
    setAnswers({})
    setEvaluation(null)

    try {
      const res = await fetch('/api/v1/evaluation_quiz/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topic }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const parsed =
        typeof data.quiz === 'string' ? JSON.parse(data.quiz) : data.quiz
      setRawMeta({
        facts: parsed.facts,
        strategies: parsed.strategies,
        rationale: parsed.rationale,
      })
      setQuestions(parsed.quiz ?? [])
    } catch (err) {
      setError(err.message || 'Failed to load quiz.')
    } finally {
      setLQLoading(false)
    }
  }

  const handleAnswer = (qNum, val) =>
    setAnswers((prev) => ({ ...prev, [qNum]: val }))

  const handleSubmit = async () => {
    const formattedAnswers = Object.fromEntries(
      questions.map((q) => [
        String(q.question_number),
        answers[q.question_number] ?? '',
      ]),
    )
    setLELoading(true)
    setError('')
    setEvaluation(null)

    try {
      const res = await fetch('/api/v1/check_evaluation_answer/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          topic: selectedTopic,
          quiz: questions,
          answers: formattedAnswers,
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      const parsed =
        typeof data.evaluation === 'string'
          ? JSON.parse(data.evaluation)
          : data.evaluation
      setEvaluation(parsed)
    } catch (err) {
      setError(err.message || 'Failed to evaluate answers.')
    } finally {
      setLELoading(false)
    }
  }

  const handleReset = () => {
    setSelected('')
    setRawMeta(null)
    setQuestions([])
    setAnswers({})
    setEvaluation(null)
    setError('')
    setPracticeProb(null)
  }

  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => (answers[q.question_number] ?? '').trim() !== '')

  if (practiceProb) {
    return (
      <PracticeMode
        problem={practiceProb}
        topic={selectedTopic}
        getHeaders={getHeaders}
        onBack={() => setPracticeProb(null)}
      />
    )
  }

  return (
    <>
      <div className="study-bg" />
      <div className="study-scroll">
        <div className="study-scroll-inner">
          <div className="study-card">
            {/* Title */}
            <div className="study-title-block">
              <p className="study-eyebrow">Quiz Mode</p>
              <h1 className="study-title">Evaluator</h1>
            </div>

            {/* Topic selector — hidden once results shown */}
            {!evaluation && (
              <div className="eval-field">
                <label className="eval-field-label">Select a Topic</label>
                {loadingTopics ? (
                  <p className="eval-loading-text">Loading topics…</p>
                ) : (
                  <select
                    className="eval-select"
                    value={selectedTopic}
                    onChange={handleTopicChange}
                    disabled={loadingQuiz || loadingEval}
                  >
                    <option value="">— Choose a topic —</option>
                    {topics.map((t, i) => {
                      const label =
                        typeof t === 'string' ? t : (t.name ?? t.topic ?? t.id)
                      const value =
                        typeof t === 'string' ? t : (t.name ?? t.topic ?? t.id)
                      return (
                        <option key={i} value={value}>
                          {label}
                        </option>
                      )
                    })}
                  </select>
                )}
              </div>
            )}

            {/* Error */}
            {error && <div className="eval-error">⚠ {error}</div>}

            {/* Spinners */}
            {loadingQuiz && (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">Generating quiz…</p>
              </div>
            )}
            {loadingEval && (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">Evaluating your answers…</p>
              </div>
            )}

            {/* Topic meta */}
            {rawMeta && !loadingQuiz && !evaluation && (
              <div className="study-problem">
                <p className="study-problem-label">About this Topic</p>
                <p className="study-problem-text eval-meta-facts">
                  {rawMeta.facts}
                </p>
                {rawMeta.strategies && (
                  <p className="eval-meta-line">
                    <strong className="eval-meta-label">Strategies:</strong>{' '}
                    {rawMeta.strategies}
                  </p>
                )}
                {rawMeta.rationale && (
                  <p className="eval-meta-line">
                    <strong className="eval-meta-label">Why it matters:</strong>{' '}
                    {rawMeta.rationale}
                  </p>
                )}
              </div>
            )}

            {/* Questions */}
            {questions.length > 0 && !loadingQuiz && !evaluation && (
              <div className="eval-questions">
                {questions.map((q) => (
                  <div key={q.question_number} className="eval-question">
                    <div className="eval-question-header">
                      <span className="eval-question-number">
                        Question {q.question_number}
                      </span>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <p className="eval-question-text">{q.question}</p>
                    <textarea
                      className="study-textarea"
                      rows={2}
                      placeholder="Type your answer…"
                      value={answers[q.question_number] ?? ''}
                      onChange={(e) =>
                        handleAnswer(q.question_number, e.target.value)
                      }
                      disabled={loadingEval}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Submit / Reset during quiz */}
            {questions.length > 0 && !loadingQuiz && !evaluation && (
              <div className="study-buttons">
                <button
                  className="study-btn-primary"
                  onClick={handleSubmit}
                  disabled={!allAnswered || loadingEval}
                >
                  Submit Answers
                </button>
                <button
                  className="study-btn-secondary"
                  onClick={handleReset}
                  disabled={loadingEval}
                >
                  Try Another Topic
                </button>
              </div>
            )}

            {/* ── Evaluation Results ── */}
            {evaluation && !loadingEval && (
              <div className="eval-results">
                {/* Summary & Gaps */}
                <div className="study-problem">
                  <p className="study-problem-label">
                    Your Results — {evaluation.topic}
                  </p>
                  <p className="eval-meta-line">
                    <strong className="eval-meta-label">
                      What you understand well:
                    </strong>{' '}
                    {evaluation.summary}
                  </p>
                  <p className="eval-meta-line">
                    <strong className="eval-meta-label">
                      Areas to work on:
                    </strong>{' '}
                    {evaluation.gaps}
                  </p>
                </div>

                {/* Question Breakdown */}
                {evaluation.question_breakdown?.length > 0 && (
                  <div className="eval-questions">
                    <p
                      className="eval-field-label"
                      style={{ marginBottom: '0.75rem' }}
                    >
                      Question Breakdown
                    </p>
                    {evaluation.question_breakdown.map((item) => (
                      <div key={item.question_number} className="eval-question">
                        <div className="eval-question-header">
                          <span className="eval-question-number">
                            Question {item.question_number}
                          </span>
                          <CorrectnessBadge isCorrect={item.is_correct} />
                        </div>
                        <p className="eval-question-text">{item.question}</p>
                        <p className="eval-meta-line">
                          <strong className="eval-meta-label">
                            Your answer:
                          </strong>{' '}
                          {item.student_answer || <em>No answer provided</em>}
                        </p>
                        <p className="eval-meta-line">
                          <strong className="eval-meta-label">Feedback:</strong>{' '}
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Word Problems with Practice buttons */}
                {evaluation.word_problems?.length > 0 && (
                  <div className="study-problem">
                    <p className="study-problem-label">
                      Practice Problems Based on Your Gaps
                    </p>
                    <p
                      className="eval-meta-line"
                      style={{
                        marginBottom: '1rem',
                        color: '#6b7280',
                        fontSize: '0.85rem',
                      }}
                    >
                      These problems target the concepts you struggled with. Hit{' '}
                      <strong>Practice</strong> to work through one
                      step-by-step.
                    </p>
                    {evaluation.word_problems.map((wp, i) => (
                      <div key={i}>
                        <div className="eval-question-header">
                          <span
                            className="eval-question-number"
                            style={{ marginTop: '1rem' }}
                          >
                            Problem {i + 1}
                          </span>
                        </div>
                        <p className="eval-question-text">{wp.problem}</p>
                        <div
                          className="study-buttons"
                          style={{ marginTop: '0.5rem' }}
                        >
                          <button
                            className="study-btn-primary"
                            style={{
                              fontSize: '0.8rem',
                              padding: '0.4rem 1rem',
                            }}
                            onClick={() => setPracticeProb(wp.problem)}
                          >
                            Practice →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="study-buttons" style={{ marginTop: '1rem' }}>
                  <button className="study-btn-secondary" onClick={handleReset}>
                    Try Another Topic
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Evaluator
