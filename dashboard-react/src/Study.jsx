import { useState } from 'react'

export default function StudyPage() {
  const [problem, setProblem] = useState('')

  return (
    <div>
      <h1>Study</h1>
      <p>Study your Algebra 1 word problems below.</p>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Enter an Algebra 1 word problem..."
        rows={4}
        cols={50}
      />
      <br />
      <button>Solve Problem</button>
      <button>Generate a New Problem</button>
    </div>
  )
}
