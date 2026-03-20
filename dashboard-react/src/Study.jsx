import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

export default function Study() {
  const [problem, setProblem] = useState('')
  const [solutionData, setSolutionData] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [completedSteps, solutionData, currentStepIndex])

  const fetchNewProblem = async () => {
    setLoading(true)
    resetState()
    try {
      const probRes = await axios.get('/api/v1/math_problem')
      const data = probRes.data
      setProblem(
        data.problem.replace(/\\\(|\\\)/g, '$').replace(/\\\[|\\\]/g, '$$'),
      )
      await getSolution(data.topic, data.problem)
    } catch (error) {
      setProblem('Error generating problem.')
    } finally {
      setLoading(false)
    }
  }

  const solveManualProblem = async () => {
    if (!userInput.trim()) return alert('Please type a problem first!')
    setLoading(true)
    const manualText = userInput
    resetState()
    setProblem(manualText)
    setUserInput('')
    await getSolution('General Math', manualText)
    setLoading(false)
  }

  const getSolution = async (topic, problemText) => {
    try {
      const solRes = await axios.post('/api/v1/solve_problem/', {
        topic,
        problem: problemText,
      })
      if (solRes.data?.solution) {
        const jsonString = solRes.data.solution
          .replace(/```json|```/g, '')
          .trim()
        setSolutionData(JSON.parse(jsonString))
      }
    } catch (error) {
      console.error('Solve Error:', error)
      setProblem('Failed to solve this problem.')
    }
  }

  const resetState = () => {
    setCompletedSteps([])
    setCurrentStepIndex(0)
    setSolutionData(null)
  }

  const checkStep = () => {
    if (!solutionData || !userInput.trim()) return
    const currentStep = solutionData.steps[currentStepIndex]
    const normalize = (str) =>
      str.toString().toLowerCase().replace(/[\s$]/g, '')
    if (normalize(userInput) === normalize(currentStep.checkpoint)) {
      setCompletedSteps([...completedSteps, currentStep])
      setUserInput('')
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      alert(`Hint: ${currentStep.instruction}`)
    }
  }

  const isActive = solutionData && currentStepIndex < solutionData.steps.length
  const isSolved = solutionData && currentStepIndex >= solutionData.steps.length

  return (
    <div className="home-page study-scroll">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />

      <div className="study-scroll-inner">
        <div className="study-card">
          {/* Dev toggle */}
          <div className="study-dev-toggle">
            <input
              type="checkbox"
              id="devMode"
              checked={isDevMode}
              onChange={() => setIsDevMode(!isDevMode)}
            />
            <label htmlFor="devMode">Enable Dev Mode (Show Answers)</label>
          </div>

          {/* Title */}
          <div className="study-title-block">
            <p className="study-eyebrow">Math Practice</p>
            <h1 className="study-title">Study</h1>
          </div>

          {/* Problem box */}
          {problem && (
            <div className="study-problem">
              <p className="study-problem-label">Current Problem</p>
              <div className="study-problem-text">
                <ReactMarkdown>{problem}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Completed steps */}
          {completedSteps.length > 0 && (
            <div className="study-steps">
              {completedSteps.map((step, i) => (
                <div key={i} className="study-step">
                  <span className="study-step-icon">✓</span>
                  <span>
                    <b>Step {i + 1}:</b> {step.checkpoint}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Success */}
          {isSolved && (
            <div className="study-success">
              <div className="study-success-emoji">🎉</div>
              <p className="study-success-title">Problem Solved!</p>
              <div className="study-success-answer">
                Final answer: {solutionData.finalAnswer}
              </div>
              <button
                className="study-btn-primary"
                style={{ width: 'auto', padding: '0.65rem 2rem' }}
                onClick={() => {
                  setProblem('')
                  resetState()
                  setUserInput('')
                }}
              >
                Start Over
              </button>
            </div>
          )}

          {/* Instruction */}
          {!isSolved && (
            <p className="study-instruction">
              {isActive
                ? solutionData.steps[currentStepIndex].instruction
                : 'Enter a problem to solve:'}
            </p>
          )}

          {/* Input + buttons */}
          {!isSolved && (
            <>
              <textarea
                className="study-textarea"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    isActive ? checkStep() : solveManualProblem()
                  }
                }}
                placeholder={
                  isActive
                    ? 'Type the result for this step…'
                    : 'Type your own math problem here!'
                }
                rows={3}
              />

              {isDevMode && isActive && (
                <div className="study-dev-answer">
                  Dev mode — expected:{' '}
                  <span>{solutionData.steps[currentStepIndex].checkpoint}</span>
                </div>
              )}

              <div className="study-buttons">
                {isActive ? (
                  <button className="study-btn-primary" onClick={checkStep}>
                    Check Step
                  </button>
                ) : (
                  <button
                    className="study-btn-primary"
                    onClick={solveManualProblem}
                    disabled={loading}
                  >
                    {loading ? 'Solving…' : 'Solve My Problem'}
                  </button>
                )}

                <button
                  className="study-btn-secondary"
                  onClick={fetchNewProblem}
                  disabled={loading}
                >
                  {loading ? 'Loading…' : 'Generate Random'}
                </button>
              </div>
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
