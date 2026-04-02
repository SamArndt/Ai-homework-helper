import { useContext, useState } from 'react'
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

export default function Study() {
  const { token } = useContext(AuthContext)

  const [mode, setMode] = useState('setup')
  const [problem, setProblem] = useState('')
  const [topic, setTopic] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [hints, setHints] = useState([])
  const [hintNumber, setHintNumber] = useState(1)
  const [loadingHint, setLoadingHint] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [solution, setSolution] = useState(null)
  const [solutionLoading, setSolutionLoading] = useState(false)
  const [openHintIndex, setOpenHintIndex] = useState(null)

  const [work, setWork] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const getCsrfToken = () =>
    document.cookie
      .split('; ')
      .find((r) => r.startsWith('csrftoken='))
      ?.split('=')[1]

  // ✅ Centralized headers with token auth
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),
    Authorization: `Token ${token}`,
  })

  const fetchNewProblem = async () => {
    setIsGenerating(true)
    setProblem('')
    try {
      const res = await fetch('/api/v1/math_problem/', {
        headers: getHeaders(),
      })
      const data = await res.json()
      setProblem(
        data.problem.replace(/\\\(|\\\)/g, '$').replace(/\\\[|\\\]/g, '$$'),
      )
      setTopic(data.topic || '')
    } catch (err) {
      console.error('Fetch error:', err)
      setProblem('Failed to generate problem.')
    } finally {
      setIsGenerating(false)
    }
  }

  const startSolving = async () => {
    if (!problem.trim()) return
    setMode('solving')
    setHints([])
    setHintNumber(1)
    setWork('')
    setFeedback(null)
    setCurrentStepIndex(0)
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
      const newHint = { number: data.hint_number, text: data.hint }
      setHints([...hints, newHint])
      setHintNumber(hintNumber + 1)
      setOpenHintIndex(hints.length)
    } catch {
      console.error('Hint error')
    } finally {
      setLoadingHint(false)
    }
  }

  const validateStep = async () => {
    if (!work.trim() || !solution) return
    setIsValidating(true)
    const parsedSolution = parseSolution(solution)
    const steps = parsedSolution?.steps || []

  
    const isLastStep = currentStepIndex >= steps.length

    const target = isLastStep
      ? { instruction: 'Final Answer', checkpoint: parsedSolution.finalAnswer }
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

  const totalSteps = steps.length + 1;
  const completedSteps = currentStepIndex;

  let currentStepHeader = ''
    if (currentStepIndex >= steps.length) {
      currentStepHeader = 'Answer'
    }
    else{
      currentStepHeader = 'Step ' + (currentStepIndex+1);
  }

  const progressAmount = (completedSteps / totalSteps) * 100;

  const isFinished = parsed && currentStepIndex > steps.length;



  return (
    <div className="study-bg">
      <div className="study-scroll">
        <div className="study-scroll-inner">
          <div className="study-card">
            <div className="study-title-block">
              <p className="study-eyebrow">{topic || 'Algebra 1'}</p>
              <h1 className="study-title">Study Session</h1>
            </div>

            {mode === 'setup' ? (
              <div className="study-buttons">
                <textarea
                  className="study-textarea"
                  placeholder="Paste your problem here..."
                  rows={4}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                />
                <button
                  className="study-btn-primary"
                  onClick={fetchNewProblem}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Problem'}
                </button>
                <button
                  className="study-btn-secondary"
                  onClick={startSolving}
                  disabled={!problem.trim()}
                >
                  Start Solving
                </button>
              </div>
            ) : (
              <>
                <div className="study-problem">
                  <p className="study-problem-label">Current Problem</p>
                  <div className="study-problem-text">
                    <ReactMarkdown>{problem}</ReactMarkdown>
                  </div>
                </div>

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

                {!isFinished ? (
                  <>
                  <div className='progress-header'>
                    <p>Completed:        <strong>{completedSteps}</strong> of <strong>{totalSteps} </strong>steps... </p>
                    <p>Current Step:     <strong>{currentStepHeader}</strong></p>

                    <div className='progress-bar'>
                      <div className='progress-bar-completed'
                           style= {{ width: progressAmount + "% "}}
                      >
            
                      </div>
                    </div>

                  </div>

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
                        style={{
                          textAlign: 'left',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Step {currentStepIndex + 1}:{' '}
                        {parsed
                          ? currentStepIndex >= steps.length
                            ? 'Final Answer'
                            : steps[currentStepIndex].instruction
                          : '...'}
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
                          {loadingHint ? '...' : `+ Hint (${4 - hintNumber})`}
                        </button>
                      )}
                    </div>

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

                    <textarea
                      className="study-textarea"
                      placeholder="Show your work for this step..."
                      rows={4}
                      value={work}
                      onChange={(e) => setWork(e.target.value)}
                    />

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

                    <div
                      className="study-buttons"
                      style={{ marginTop: '1rem' }}
                    >
                      <button
                        className="study-btn-primary"
                        onClick={validateStep}
                        disabled={isValidating || !work.trim() || !parsed}
                      >
                        {isValidating ? 'Checking...' : 'Check Step'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="study-success">
                    <span className="study-success-emoji">🎉</span>
                    <p className="study-success-title">Problem Solved!</p>
                    <div className="study-success-answer">
                      Final Answer: {parsed?.finalAnswer}
                    </div>
                    <button
                      className="study-btn-primary"
                      onClick={() => setMode('setup')}
                      style={{ marginTop: '1rem' }}
                    >
                      Start New Problem
                    </button>
                  </div>
                )}

                <button
                  className="study-btn-secondary"
                  style={{ marginTop: '2.5rem', fontSize: '0.8rem' }}
                  onClick={() => setMode('setup')}
                >
                  Back to Setup
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
