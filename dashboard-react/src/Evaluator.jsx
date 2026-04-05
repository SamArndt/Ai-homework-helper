import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './context/AuthContext'

const DifficultyBadge = ({ difficulty }) => {
  const level = difficulty?.toLowerCase() ?? 'medium'
  return (
    <span className={`eval-badge eval-badge-${level}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
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
  const [rawMeta, setRawMeta] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [error, setError] = useState('')

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

  const handleAnswer = (qNum, val) => {
    setAnswers((prev) => ({ ...prev, [qNum]: val }))
  }

  const handleReset = () => {
    setSelected('')
    setRawMeta(null)
    setQuestions([])
    setAnswers({})
    setError('')
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

            {/* ── Topic selector ── */}
            <div className="eval-field">
              <label className="eval-field-label">Select a Topic</label>
              {loadingTopics ? (
                <p className="eval-loading-text">Loading topics…</p>
              ) : (
                <select
                  className="eval-select"
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  disabled={loadingQuiz}
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

            {/* ── Error ── */}
            {error && <div className="eval-error">⚠ {error}</div>}

            {/* ── Loading quiz ── */}
            {loadingQuiz && (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">Generating quiz…</p>
              </div>
            )}

            {/* ── Topic meta ── */}
            {rawMeta && !loadingQuiz && (
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

            {/* ── Questions ── */}
            {questions.length > 0 && !loadingQuiz && (
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
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Reset button ── */}
            {questions.length > 0 && !loadingQuiz && (
              <div className="study-buttons">
                <button className="study-btn-secondary" onClick={handleReset}>
                  Try Another Topic
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Evaluator
