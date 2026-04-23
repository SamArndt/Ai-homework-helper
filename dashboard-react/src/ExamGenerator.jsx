import { useContext, useState } from 'react'
import { AuthContext } from './context/AuthContext'

const QUESTION_TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  multiple_select: 'Multiple Select',
  integrated_set: 'Scenario',
}

function Badge({ type }) {
  const labels = QUESTION_TYPE_LABELS
  return (
    <span
      style={{
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '0.2rem 0.6rem',
        borderRadius: '999px',
        background: '#ede9fe',
        color: '#5b21b6',
        flexShrink: 0,
      }}
    >
      {labels[type] || type}
    </span>
  )
}

function OptionButton({ label, selected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '0.65rem 1rem',
        borderRadius: '10px',
        border: selected ? '2px solid #7c3aed' : '1.5px solid #ddd6fe',
        background: selected ? '#ede9fe' : '#fff',
        color: selected ? '#4c1d95' : '#3b1f6e',
        fontFamily: 'inherit',
        fontSize: '0.9rem',
        fontWeight: selected ? 600 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        marginBottom: '0.4rem',
        opacity: disabled && !selected ? 0.6 : 1,
      }}
    >
      {label}
    </button>
  )
}

function ShortAnswerField({ value, onChange, disabled }) {
  return (
    <textarea
      className="study-textarea"
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Write your answer here…"
    />
  )
}

function QuestionCard({ question, index, answers, onAnswer }) {
  const { type, prompt, options, scenario, sub_questions } = question
  const answer = answers[question.id] || {}

  if (type === 'integrated_set') {
    return (
      <div className="eval-question" style={{ gap: '1rem' }}>
        <div className="eval-question-header">
          <span className="eval-question-number">Scenario {index + 1}</span>
          <Badge type="integrated_set" />
        </div>
        <div
          style={{
            background: '#f5f3ff',
            border: '1px solid #ddd6fe',
            borderRadius: '10px',
            padding: '0.9rem 1.1rem',
            fontSize: '0.9rem',
            color: '#4c1d95',
            lineHeight: 1.65,
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8b5cf6',
              marginBottom: '0.5rem',
            }}
          >
            Scenario
          </span>
          {scenario}
        </div>
        {sub_questions.map((sq, si) => (
          <div
            key={sq.id}
            style={{
              background: '#faf7ff',
              borderRadius: '12px',
              border: '1px solid #e9d5ff',
              padding: '1rem 1.1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#8b5cf6',
                marginBottom: '0.4rem',
              }}
            >
              Part {sq.id}
            </div>
            <p
              className="eval-question-text"
              style={{ marginBottom: '0.75rem' }}
            >
              {sq.prompt}
            </p>
            <SubQuestion
              sq={sq}
              value={answers[sq.id]}
              onAnswer={(val) => onAnswer(sq.id, val)}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="eval-question">
      <div className="eval-question-header">
        <span className="eval-question-number">Question {index + 1}</span>
        <Badge type={type} />
      </div>
      <p className="eval-question-text">{prompt}</p>
      <SubQuestion
        sq={{ ...question, id: question.id }}
        value={answers[question.id]}
        onAnswer={(val) => onAnswer(question.id, val)}
      />
    </div>
  )
}

function SubQuestion({ sq, value, onAnswer }) {
  const { type, options } = sq

  if (type === 'short_answer') {
    return <ShortAnswerField value={value || ''} onChange={onAnswer} />
  }

  if (type === 'multiple_select') {
    const selected = value || []
    return (
      <div>
        <p
          style={{
            fontSize: '0.75rem',
            color: '#8b5cf6',
            marginBottom: '0.5rem',
            fontWeight: 600,
          }}
        >
          Select all that apply
        </p>
        {options.map((opt) => {
          const isSelected = selected.includes(opt)
          return (
            <OptionButton
              key={opt}
              label={opt}
              selected={isSelected}
              onClick={() => {
                const next = isSelected
                  ? selected.filter((s) => s !== opt)
                  : [...selected, opt]
                onAnswer(next)
              }}
            />
          )
        })}
      </div>
    )
  }

  // multiple_choice, true_false
  return (
    <div>
      {(options || []).map((opt) => (
        <OptionButton
          key={opt}
          label={opt}
          selected={value === opt}
          onClick={() => onAnswer(opt)}
        />
      ))}
    </div>
  )
}

export default function ExamGenerator() {
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

  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setExam(null)
    setAnswers({})
    setSubmitted(false)

    try {
      const res = await fetch('/api/v1/exam_generator/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topic: topic.trim() }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      // Support raw JSON or stringified quiz field
      let parsed = data
      if (typeof data.quiz === 'string') {
        const cleaned = data.quiz.replace(/```json|```/g, '').trim()
        parsed = JSON.parse(cleaned)
      } else if (data.quiz) {
        parsed = data.quiz
      }

      setExam(parsed)
    } catch (err) {
      setError(err.message || 'Failed to generate exam. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId, value) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const flatQuestions = exam
    ? exam.exam_body.flatMap((q) =>
        q.type === 'integrated_set' ? [q, ...(q.sub_questions || [])] : [q],
      )
    : []

  const answeredCount = Object.keys(answers).filter((k) => {
    const v = answers[k]
    return Array.isArray(v) ? v.length > 0 : v && v.trim?.() !== ''
  }).length

  const totalAnswerable = exam
    ? exam.exam_body.reduce((acc, q) => {
        if (q.type === 'integrated_set')
          return acc + (q.sub_questions?.length || 0)
        return acc + 1
      }, 0)
    : 0

  return (
    <>
      <div className="study-bg" />
      <div className="study-scroll">
        <div className="study-scroll-inner">
          <div
            className="study-card"
            style={{
              maxWidth: exam ? '720px' : '500px',
              transition: 'max-width 0.3s ease',
            }}
          >
            {/* Header */}
            <div className="study-title-block">
              <p className="study-eyebrow">Practice Exams</p>
              <h1 className="study-title">Exam Generator</h1>
            </div>

            {/* Topic Input */}
            {!exam && (
              <>
                <div className="eval-field">
                  <label className="eval-field-label" htmlFor="topic-input">
                    Exam Topic
                  </label>
                  <textarea
                    id="topic-input"
                    className="study-textarea"
                    rows={3}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Maryland Bar Exam, AP Biology, Constitutional Law…"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGenerate()
                      }
                    }}
                  />
                </div>

                {error && <div className="eval-error">{error}</div>}

                <div className="study-buttons">
                  <button
                    className="study-btn-primary"
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                  >
                    {loading ? 'Generating…' : 'Generate Exam'}
                  </button>
                </div>

                {loading && (
                  <div className="eval-spinner-wrap">
                    <div className="eval-spinner" />
                    <p className="eval-loading-text">
                      Building your exam on <em>{topic}</em>…
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Exam Display */}
            {exam && (
              <>
                {/* Exam meta bar */}
                <div
                  style={{
                    background: '#f5f3ff',
                    border: '1.5px solid #ddd6fe',
                    borderRadius: '14px',
                    padding: '1rem 1.2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#8b5cf6',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {exam.exam_title || 'Practice Exam'}
                    </p>
                    <p style={{ fontSize: '0.825rem', color: '#6d5a8a' }}>
                      {exam.metadata?.total_questions} questions ·{' '}
                      {exam.metadata?.intended_difficulty}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: '0.825rem',
                      color: '#7c3aed',
                      fontWeight: 600,
                    }}
                  >
                    {answeredCount} / {totalAnswerable} answered
                  </div>
                </div>

                {error && <div className="eval-error">{error}</div>}

                {/* Questions */}
                <div className="eval-questions">
                  {exam.exam_body.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={i}
                      answers={answers}
                      onAnswer={handleAnswer}
                    />
                  ))}
                </div>

                {/* Submission / progress */}
                {!submitted ? (
                  <div className="study-buttons">
                    <button
                      className="study-btn-primary"
                      onClick={() => setSubmitted(true)}
                      disabled={answeredCount === 0}
                    >
                      Submit Answers
                    </button>
                    <button
                      className="study-btn-secondary"
                      onClick={() => {
                        setExam(null)
                        setAnswers({})
                        setError('')
                      }}
                    >
                      ← New Exam
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="study-success">
                      <span className="study-success-emoji">📋</span>
                      <p className="study-success-title">Exam Submitted!</p>
                      <p className="eval-score-message">
                        You answered {answeredCount} of {totalAnswerable}{' '}
                        questions.
                      </p>
                    </div>
                    <div className="study-buttons">
                      <button
                        className="study-btn-secondary"
                        onClick={() => {
                          setExam(null)
                          setAnswers({})
                          setSubmitted(false)
                          setError('')
                        }}
                      >
                        ← Generate Another Exam
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
