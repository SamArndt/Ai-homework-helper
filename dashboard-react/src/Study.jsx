import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const HintAccordion = ({ hints, hintNumber, loadingHint, onFetchHint }) => {
  const [openIndex, setOpenIndex] = useState(null)
  const hintsExhausted = hintNumber > 3

  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <span className="problem-label">Hints</span>
        {!hintsExhausted && (
          <button
            className="home-cta"
            onClick={onFetchHint}
            disabled={loadingHint}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}
          >
            {loadingHint ? 'Loading…' : `+ Hint ${hintNumber} of 3`}
          </button>
        )}
      </div>

      {hints.length === 0 && (
        <p style={{ opacity: 0.45, fontSize: '0.85rem', margin: 0 }}>
          No hints revealed yet.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {hints.map((hint, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={hint.number}
              style={{
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.85)',
                color: '#1a1a1a',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#1a1a1a',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                }}
              >
                <span>Hint {hint.number}</span>
                <span
                  style={{
                    display: 'inline-block',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    opacity: 0.6,
                    fontSize: '0.75rem',
                  }}
                >
                  ▼
                </span>
              </button>
              <div
                style={{
                  maxHeight: isOpen ? '300px' : '0',
                  overflow: 'hidden',
                  transition: 'max-height 0.3s ease',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    padding: '0 1rem 0.85rem',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#1a1a1a',
                  }}
                >
                  {hint.text}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Modes: 'setup' | 'solving'
export default function Study() {
  const [mode, setMode] = useState('setup')
  const [problem, setProblem] = useState('')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [answer, setAnswer] = useState('')
  const [hints, setHints] = useState([])
  const [hintNumber, setHintNumber] = useState(1)
  const [loadingHint, setLoadingHint] = useState(false)

  const fetchNewProblem = async () => {
    setIsGenerating(true)
    setProblem('')
    try {
      const response = await fetch('/api/v1/math_problem')
      const data = await response.json()
      const cleanProblem = data.problem
        .replace(/\\\(|\\\)/g, '$')
        .replace(/\\\[|\\\]/g, '$$')
      setProblem(cleanProblem)
      setTopic(data.topic || '')
    } catch (error) {
      console.error('API Error:', error)
      setProblem('Could not generate a problem. Is the server running?')
    } finally {
      setIsGenerating(false)
    }
  }

  const startSolving = () => {
    if (!problem.trim()) return
    setAnswer('')
    setHints([])
    setHintNumber(1)
    setMode('solving')
  }

  const resetToSetup = () => {
    setMode('setup')
    setAnswer('')
    setHints([])
    setHintNumber(1)
  }

  const getCsrfToken = () =>
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1]

  const fetchHint = async () => {
    if (hintNumber > 3 || loadingHint) return
    setLoadingHint(true)
    try {
      const response = await fetch('/api/v1/generate_hint/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({
          hint_number: hintNumber,
          topic,
          problem,
        }),
      })
      const data = await response.json()
      setHints((prev) => [
        ...prev,
        { number: data.hint_number, text: data.hint },
      ])
      setHintNumber((prev) => prev + 1)
    } catch (error) {
      console.error('Hint API Error:', error)
    } finally {
      setLoadingHint(false)
    }
  }

  return (
    <div className="home-page study-scroll">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="home-content">
        <p className="home-eyebrow">Algebra 1</p>
        <h1 className="home-title">Study</h1>

        {/* ── SETUP MODE ── */}
        {mode === 'setup' && (
          <>
            <p className="home-sub">Enter your own problem or generate one.</p>

            <textarea
              className="auth-input"
              placeholder="Type or paste a word problem here…"
              rows={4}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />

            <div
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <button
                className="home-cta"
                onClick={fetchNewProblem}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating…' : 'Generate a New Problem'}
              </button>
              <button
                className="home-cta"
                onClick={startSolving}
                disabled={!problem.trim() || isGenerating}
              >
                Solve Problem
              </button>
            </div>
          </>
        )}

        {/* ── SOLVING MODE ── */}
        {mode === 'solving' && (
          <>
            <div className="problem-box">
              <span className="problem-label">Current Problem:</span>
              <div className="problem-text">
                <ReactMarkdown>{problem}</ReactMarkdown>
              </div>
            </div>

            <HintAccordion
              hints={hints}
              hintNumber={hintNumber}
              loadingHint={loadingHint}
              onFetchHint={fetchHint}
            />

            <p className="home-sub">Show your work below:</p>

            <textarea
              className="auth-input"
              placeholder="Write your answer here!"
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <button className="home-cta">Check Answer</button>
              <button className="home-cta" onClick={resetToSetup}>
                New Problem
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
