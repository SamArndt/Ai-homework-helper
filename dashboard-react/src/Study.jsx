import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Study() {
  const [generatedProblem, setGeneratedProblem] = useState('')

  const fetchNewProblem = async () => {
    setGeneratedProblem('Generating...')
    try {
      const response = await fetch('/api/v1/math_problem')
      const data = await response.json()

      const cleanProblem = data.problem
        .replace(/\\\(|\\\)/g, '$')
        .replace(/\\\[|\\\]/g, '$$')

      setGeneratedProblem(cleanProblem)
    } catch (error) {
      console.error('API Error:', error)
      setGeneratedProblem(
        'Could not generate a problem. Is the server running?',
      )
    }
  }

  return (
    <div className="home-page study-scroll">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="home-content">
        <p className="home-eyebrow">Algebra 1</p>
        <h1 className="home-title">Study</h1>

        {generatedProblem && (
          <div className="problem-box">
            <span className="problem-label">Current Problem:</span>
            <div className="problem-text">
              <ReactMarkdown>{generatedProblem}</ReactMarkdown>
            </div>
          </div>
        )}

        <p className="home-sub">
          {generatedProblem
            ? 'Show your work below:'
            : 'Generate a problem to get started.'}
        </p>

        <textarea
          className="auth-input"
          placeholder="Write your answer here!"
          rows={4}
        />

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="home-cta">Check Answer</button>
          <button className="home-cta" onClick={fetchNewProblem}>
            Generate a New Problem
          </button>
        </div>
      </div>
    </div>
  )
}
