import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'

export default function NumberRocketGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    // Only use numbers 0–5 for preschoolers
    const a = Math.floor(Math.random() * 3)   // 0–2
    const b = Math.floor(Math.random() * 3)   // 0–2

    const correct = a + b // max = 4
    setQuestion(`${a} + ${b}`)
    setAnswer(correct)

    let wrong: number[] = []
    while (wrong.length < 2) {
      const n = Math.floor(Math.random() * 6) // 0–5
      if (n !== correct && !wrong.includes(n)) wrong.push(n)
    }

    const all = [...wrong, correct].sort(() => Math.random() - 0.5)
    setChoices(all)
  }

  const speakQuestion = async () => {
    await speak(`What is ${question}?`)
    await speak(`Bằng bao nhiêu?`, 'vi-VN')
  }

  const praises = ['Blast off!', 'Amazing!', 'Great job!', 'Awesome!', 'Yay!']
  const randomPraise = () =>
    praises[Math.floor(Math.random() * praises.length)]

  const handleClick = (choice: number) => {
    if (choice === answer) {
      playCorrect()
      addStar()
      setScore(prev => prev + 1)
      setShowCelebrate(true)

      speak(`${randomPraise()} ${choice}!`)

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
      }, 1500)
    } else {
      playWrong()
      speak('Try again!')
    }
  }

  // Convert number → rockets (max 5)
  const rocketify = (n: number) =>
    n === 0 ? '(no rockets)' : '🚀'.repeat(n)

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🚀 Number Rocket</h2>

      <h2 style={{ color: '#00aaff', marginTop: 10 }}>
        ⭐ Score: {score}
      </h2>

      {showCelebrate && (
        <div
          style={{
            fontSize: 60,
            marginTop: 20,
            animation: 'pop 0.6s ease',
          }}
        >
          🚀🔥⭐
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        Count the rockets to choose the right answer:
      </p>

      <h1 style={{ fontSize: 60, marginTop: 10 }}>{question}</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 30,
          flexWrap: 'wrap',
        }}
      >
        {choices.map((c, i) => (
          <button
            key={i}
            onClick={() => handleClick(c)}
            style={{
              ...emojiButton,
              fontSize: 32,
              padding: '20px 30px',
              lineHeight: 1.2,
            }}
          >
            {rocketify(c)}
          </button>
        ))}
      </div>

      <button onClick={speakQuestion} style={speakButton}>
        🔊 Hear Question
      </button>

      <button onClick={nextRound} style={nextButton}>
        ➡️ Next
      </button>
    </>
  )
}
