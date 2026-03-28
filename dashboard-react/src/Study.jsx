import { useState } from 'react'

export default function Study() {
  const [problem, setProblem] = useState('')

  return (
    <div className="home-page">
      <div className="deco-circle deco-1" />
      <div className="deco-circle deco-2" />
      <div className="home-content">
        <p className="home-eyebrow">Algebra 1</p>
        <h1 className="home-title">Study</h1>
        <p className="home-sub">
          Enter a word problem below or generate a new one to get started.
        </p>
        <textarea
          className="auth-input"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Enter an Algebra 1 word problem..."
          rows={4}
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="home-cta">Solve Problem</button>
          <button className="home-cta">Generate a New Problem</button>
        </div>
      </div>
    </div>
  )
}
