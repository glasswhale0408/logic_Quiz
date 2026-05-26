import { useState, useEffect, useRef } from 'react'
import generatePuzzle from './utils/generatePuzzle'
import solvePuzzle from './utils/solvePuzzle'
import CircuitDisplay from './components/CircuitDisplay'
import './App.css'

const GAME_DURATION = 30

function App() {
  const [phase, setPhase] = useState('idle') // 'idle' | 'playing' | 'done'
  const [level, setLevel] = useState(1)
  const [puzzle, setPuzzle] = useState(null)
  const [answer, setAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const timerRef = useRef(null)

  const startGame = () => {
    const p = generatePuzzle(1)
    setPuzzle(p)
    setAnswer(solvePuzzle(p))
    setLevel(1)
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setFeedback(null)
    setPhase('playing')
  }

  useEffect(() => {
    if (phase !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setPhase('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  const checkAnswer = (userAnswer) => {
    if (isAnimating || phase !== 'playing') return
    if (answer === userAnswer) {
      setFeedback('correct')
      setIsAnimating(true)
      setScore(s => s + 1)
      setTimeout(() => {
        const nextLevel = Math.min(level + 1, 4)
        const newPuzzle = generatePuzzle(nextLevel)
        setLevel(nextLevel)
        setPuzzle(newPuzzle)
        setAnswer(solvePuzzle(newPuzzle))
        setFeedback(null)
        setIsAnimating(false)
      }, 500)
    } else {
      setFeedback('wrong')
      setIsAnimating(true)
      setTimeout(() => {
        setFeedback(null)
        setIsAnimating(false)
      }, 3000)
    }
  }

  const levelLabels = ['', 'AND / OR', 'XOR', '2단계', '3단계']
  const timerPct = (timeLeft / GAME_DURATION) * 100
  const timerUrgent = timeLeft <= 10

  if (phase === 'idle') {
    return (
      <div className="app app--center">
        <div className="splash">
          <h1 className="splash-title">Logic Gate</h1>
          <p className="splash-sub">30초 안에 최대한 많이 풀어보세요</p>
          <button className="start-btn" onClick={startGame}>시작하기</button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="app app--center">
        <div className="result-card">
          <p className="result-label">최종 점수</p>
          <div className="result-score">{score}</div>
          <p className="result-sub">문제를 풀었어요</p>
          <button className="start-btn" onClick={startGame}>다시 도전</button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="hud">
          <div className="hud-score">
            <span className="hud-score-num">{score}</span>
            <span className="hud-score-label">점</span>
          </div>
          <div className={`hud-timer ${timerUrgent ? 'urgent' : ''}`}>
            <svg className="timer-ring" viewBox="0 0 44 44">
              <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e5e5" strokeWidth="3" />
              <circle
                cx="22" cy="22" r="18" fill="none"
                stroke={timerUrgent ? '#b5192c' : '#1a1a1a'}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - timerPct / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
              />
            </svg>
            <span className="timer-num">{timeLeft}</span>
          </div>
        </div>
        <div className="level-track">
          {[1, 2, 3, 4].map((l) => (
            <div key={l} className={`level-dot ${l === level ? 'active' : l < level ? 'done' : ''}`} />
          ))}
        </div>
        <div className="level-label">Lv.{level} · {levelLabels[level]}</div>
      </header>

      <main className="app-main">
        <div className={`puzzle-wrapper ${feedback === 'correct' ? 'flash-correct' : feedback === 'wrong' ? 'flash-wrong' : ''}`}>
          {puzzle && <CircuitDisplay puzzle={puzzle} />}
        </div>

        <div className="answer-section">
          <p className="answer-prompt">최종 출력값은?</p>
          <div className="answer-buttons">
            <button className="ans-btn ans-0" onClick={() => checkAnswer(0)} disabled={isAnimating}>
              <span className="ans-digit">0</span>
              <span className="ans-label">꺼짐</span>
            </button>
            <button className="ans-btn ans-1" onClick={() => checkAnswer(1)} disabled={isAnimating}>
              <span className="ans-digit">1</span>
              <span className="ans-label">켜짐</span>
            </button>
          </div>
        </div>

        {feedback && (
          <div className={`feedback-toast ${feedback}`}>
            {feedback === 'correct' ? '✓ 정답!' : '✗ 오답'}
          </div>
        )}
      </main>
    </div>
  )
}

export default App