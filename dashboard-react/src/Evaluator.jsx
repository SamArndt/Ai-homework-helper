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
  const [filterSearch, setFilterSearch] = useState('')


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

  const topicShortcuts = {
    'linear equations in slope-intercept form (y = mx + b)' : 
    [
      'slope',
      'slope-intercept',
      'y=',
      'y =',
      'y = mx+b',
    ],
    'linear equations in point-slope form': 
    [
      'slope',
      'point slope',
      'point-slope',
      'linear',

    ],
    'linear equations in standard form': 
    [
      'slope',
      'standard',
      'linear equations',
      'linear',

    ],
    'finding slope from two points': 
    [
      'two',
      'two points',
      'slope',
      'points',
      'find',

    ],
    'finding slope from a graph': 
    [
      'slope',
      'slope graph',
      'graph',
      'graph slope',
      'find',

    ],
    'solving systems by substitution': 
    [
      'substitution',
      'system',
      'system of equations',
      'solve',

    ],
    'solving systems by elimination': 
    [
      'elimination',
      'system',
      'system of equations',
      'solve',

    ],
    'quadratic equations and parabolas': 
    [
      'quadratic ',
      'equations',
      'parabolas',
      'quadratics',

    ],
    'factoring quadratic expressions': 
    [
      'factoring',
      'expressions',
      'quadratic',
      'quadratics',

    ],

    


  }


  const filtering = topics.filter((item) => {
    
  
    let topicName = ''

    if (typeof item === 'string') {
      topicName = item;

    }

    else if (item.name) {
      topicName = item.name;
    }

    else if (item.topic) {
      topicName = item.topic;
    }
    
    else if (item.id) {
      topicName = item.id;
    }

    let topicNameLower = topicName.toLowerCase();
    let topicNameText = filterSearch.toLowerCase();


    if (topicNameLower.indexOf(topicNameText) !== -1) {
      return true
    }


    const shortcut = topicShortcuts[topicName] || []
          let i;
          for (i = 0; i < shortcut.length; i++) {
            const shorcutText = shortcut[i].toLowerCase()

                if (shorcutText.indexOf(topicNameText) !== -1) {
                  return true
                }
                  
          }


  })


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
                <>
                <input className='eval-select'
                       type='text'
                       placeholder='Search For a Topic...'
                       value={filterSearch}
                       onChange={(e) => {
                        const newText = e.target.value 
                        setFilterSearch(newText)
                      
                      }}
                    />
                  <p className='eval-loading-text'>
                    {filtering.length} {' '}
                    topic{filtering.length === 1 ? '' : 's'} found...
                  </p>
                
                <select
                  className="eval-select"
                  value={selectedTopic}

                  onChange={handleTopicChange}
                  disabled={loadingQuiz}
                >
                  <option value="">— Choose a topic —</option>

                  {filtering.map((item, index) => {
                    let evalLabel = ''
                    let evalValue=''

                        if (typeof item === 'string') {
                          evalLabel = item
                          evalValue = item
                        }
                        else if (item.name) {
                          evalLabel = item.name
                          evalValue = item.name
                        }
                        else if (item.topic) {
                          evalLabel = item.topic
                          evalValue = item.topic
                        }
                        else if (item.id) {
                          evalLabel = item.id
                          evalValue = item.id
                        }

                    return (
                      <option key={index} 
                              value={evalValue}>
                              {evalLabel}
                      </option>

                    )
                  })}
                </select>
            </>
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
