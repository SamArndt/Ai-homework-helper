import { useContext, useState } from 'react'
import { AuthContext } from './context/AuthContext'

const QUESTION_TYPE_LABELS = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  short_answer: 'Short Answer',
  multiple_select: 'Multiple Select',
  integrated_set: 'Scenario',
}

function TypeBadge({ type }) {
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
      {QUESTION_TYPE_LABELS[type] || type}
    </span>
  )
}

function CorrectnessBadge({ isCorrect }) {
  return (
    <span
      className={`eval-badge ${isCorrect ? 'eval-badge-easy' : 'eval-badge-hard'}`}
    >
      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
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

function SubQuestion({ sq, value, onAnswer, disabled }) {
  const { type, options } = sq

  if (type === 'short_answer') {
    return (
      <textarea
        className="study-textarea"
        rows={4}
        value={value || ''}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        placeholder="Write your answer here…"
      />
    )
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
              disabled={disabled}
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

  return (
    <div>
      {(options || []).map((opt) => (
        <OptionButton
          key={opt}
          label={opt}
          selected={value === opt}
          disabled={disabled}
          onClick={() => onAnswer(opt)}
        />
      ))}
    </div>
  )
}

function QuestionCard({ question, index, answers, onAnswer, disabled }) {
  const { type, prompt, scenario, sub_questions } = question

  if (type === 'integrated_set') {
    return (
      <div className="eval-question" style={{ gap: '1rem' }}>
        <div className="eval-question-header">
          <span className="eval-question-number">Scenario {index + 1}</span>
          <TypeBadge type="integrated_set" />
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
        {sub_questions.map((sq) => (
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
              disabled={disabled}
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
        <TypeBadge type={type} />
      </div>
      <p className="eval-question-text">{prompt}</p>
      <SubQuestion
        sq={question}
        value={answers[question.id]}
        onAnswer={(val) => onAnswer(question.id, val)}
        disabled={disabled}
      />
    </div>
  )
}

function ScoreBar({ score }) {
  const pct = score?.percentage ?? 0
  const color = pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div
      style={{
        background: '#f5f3ff',
        border: '1.5px solid #ddd6fe',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          color: '#8b5cf6',
          marginBottom: '0.75rem',
        }}
      >
        Your Score
      </p>
      <div
        style={{
          fontSize: '2.75rem',
          fontWeight: 700,
          color,
          marginBottom: '0.25rem',
        }}
      >
        {pct}%
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6d5a8a' }}>
        {score?.earned} / {score?.total} correct
      </p>
      <div
        style={{
          height: '8px',
          background: '#ede9fe',
          borderRadius: '999px',
          marginTop: '1rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: '999px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}

function EvalQuestionCard({ item, index }) {
  const isCorrect = item.is_correct
  return (
    <div
      className={`eval-question ${isCorrect ? 'eval-question-correct' : 'eval-question-wrong'}`}
    >
      <div className="eval-question-header">
        <span className="eval-question-number">
          {String(item.id).match(/[a-z]/i)
            ? `Part ${item.id}`
            : `Question ${index + 1}`}
        </span>
        <CorrectnessBadge isCorrect={isCorrect} />
      </div>

      <p className="eval-question-text">{item.prompt}</p>

      <p className="eval-meta-line">
        <strong className="eval-meta-label">Your answer: </strong>
        {Array.isArray(item.student_answer)
          ? item.student_answer.join(', ')
          : item.student_answer || <em>No answer provided</em>}
      </p>

      {item.correct_answer && (
        <p className="eval-meta-line">
          <strong className="eval-meta-label">Correct answer: </strong>
          {Array.isArray(item.correct_answer)
            ? item.correct_answer.join(', ')
            : item.correct_answer}
        </p>
      )}

      <div
        className={`eval-feedback ${isCorrect ? 'eval-feedback-correct' : 'eval-feedback-wrong'}`}
      >
        <p className="eval-feedback-title">
          {isCorrect ? 'Great work!' : 'Review needed'}
        </p>
        <p className="eval-feedback-body">{item.explanation}</p>
      </div>
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
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState({})
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [grading, setGrading] = useState(false)
  const [error, setError] = useState('')

  const totalAnswerable = exam
    ? exam.exam_body.reduce(
        (acc, q) =>
          q.type === 'integrated_set'
            ? acc + (q.sub_questions?.length || 0)
            : acc + 1,
        0,
      )
    : 0

  const answeredCount = Object.keys(answers).filter((k) => {
    const v = answers[k]
    return Array.isArray(v) ? v.length > 0 : v && v.trim?.() !== ''
  }).length

  const handleAnswer = (questionId, value) => {
    if (evaluation) return
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleReset = () => {
    setTopic('')
    setExam(null)
    setAnswers({})
    setEvaluation(null)
    setError('')
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    setExam(null)
    setAnswers({})
    setEvaluation(null)

    try {
      const res = await fetch('/api/v1/exam_generator/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ topic: topic.trim() }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      let parsed
      if (typeof data.quiz === 'string') {
        const cleaned = data.quiz.replace(/```json|```/g, '').trim()
        parsed = JSON.parse(cleaned)
      } else if (data.quiz) {
        parsed = data.quiz
      } else {
        parsed = data
      }

      setExam(parsed)
    } catch (err) {
      setError(err.message || 'Failed to generate exam. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!exam || answeredCount === 0) return
    setGrading(true)
    setError('')

    try {
      const res = await fetch('/api/v1/check_exam_answers/', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          topic,
          quiz: exam.exam_body,
          answers,
        }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()

      let parsed
      if (typeof data.evaluation === 'string') {
        const cleaned = data.evaluation.replace(/```json|```/g, '').trim()
        parsed = JSON.parse(cleaned)
      } else {
        parsed = data.evaluation
      }

      setEvaluation(parsed)
    } catch (err) {
      setError(err.message || 'Failed to grade exam. Please try again.')
    } finally {
      setGrading(false)
    }
  }

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
              <h1 className="study-title">
                {evaluation ? 'Exam Results' : 'Exam Generator'}
              </h1>
            </div>

            {/* ── PHASE 1: Topic input ── */}
            {!exam && !loading && (
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleGenerate()
                      }
                    }}
                  />
                </div>
                {error && <div className="eval-error">⚠ {error}</div>}
                <div className="study-buttons">
                  <button
                    className="study-btn-primary"
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                  >
                    Generate Exam
                  </button>
                </div>
              </>
            )}

            {/* ── Generating spinner ── */}
            {loading && (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">
                  Building your exam on <em>{topic}</em>…
                </p>
              </div>
            )}

            {/* ── Grading spinner ── */}
            {grading && (
              <div className="eval-spinner-wrap">
                <div className="eval-spinner" />
                <p className="eval-loading-text">Grading your answers…</p>
              </div>
            )}

            {/* ── PHASE 2: Exam questions ── */}
            {exam && !evaluation && !loading && !grading && (
              <>
                {/* Meta bar */}
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

                {error && <div className="eval-error">⚠ {error}</div>}

                <div className="eval-questions">
                  {exam.exam_body.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      index={i}
                      answers={answers}
                      onAnswer={handleAnswer}
                      disabled={false}
                    />
                  ))}
                </div>

                <div className="study-buttons">
                  <button
                    className="study-btn-primary"
                    onClick={handleSubmit}
                    disabled={answeredCount === 0}
                  >
                    Submit &amp; Grade Exam
                  </button>
                  <button className="study-btn-secondary" onClick={handleReset}>
                    ← New Exam
                  </button>
                </div>
              </>
            )}

            {/* ── PHASE 3: Results ── */}
            {evaluation && !grading && (
              <>
                {/* Score bar — calculated from breakdown, not API score field */}
                {(() => {
                  const breakdown = evaluation.question_breakdown || []
                  const earned = breakdown.filter((q) => q.is_correct).length
                  const total = breakdown.length
                  const percentage =
                    total > 0 ? Math.round((earned / total) * 100) : 0
                  return <ScoreBar score={{ earned, total, percentage }} />
                })()}

                {/* Summary */}
                <div className="study-problem">
                  <p className="study-problem-label">Overall Feedback</p>
                  <p className="study-problem-text">{evaluation.summary}</p>
                </div>

                {/* Strengths & Gaps */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '0.9rem 1rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#16a34a',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Strengths
                    </p>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#166534',
                        lineHeight: 1.55,
                      }}
                    >
                      {evaluation.strengths}
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#fff7f7',
                      border: '1px solid #fca5a5',
                      borderRadius: '12px',
                      padding: '0.9rem 1rem',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#dc2626',
                        marginBottom: '0.4rem',
                      }}
                    >
                      Areas to Review
                    </p>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#7f1d1d',
                        lineHeight: 1.55,
                      }}
                    >
                      {evaluation.gaps}
                    </p>
                  </div>
                </div>

                {/* Per-question breakdown */}
                {evaluation.question_breakdown?.length > 0 && (
                  <>
                    <p
                      className="eval-field-label"
                      style={{ marginTop: '0.5rem' }}
                    >
                      Question Breakdown
                    </p>
                    <div className="eval-questions">
                      {evaluation.question_breakdown.map((item, i) => (
                        <EvalQuestionCard key={item.id} item={item} index={i} />
                      ))}
                    </div>
                  </>
                )}

                {error && <div className="eval-error">⚠ {error}</div>}

                <div className="study-buttons">
                  <button
                    className="study-btn-secondary"
                    onClick={() => {
                      setEvaluation(null)
                      setAnswers({})
                    }}
                  >
                    Retake This Exam
                  </button>
                  <button className="study-btn-secondary" onClick={handleReset}>
                    ← New Exam
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
