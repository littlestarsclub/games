import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'

export default function CrabCountGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [count, setCount] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    const newCount = Math.floor(Math.random() * 9) + 1 // 1–9 crabs
    setCount(newCount)

    let wrong = []
    while (wrong.length < 2) {
      const n = Math.floor(Math.random() * 9) + 1
      if (n !== newCount && !wrong.includes(n)) wrong.push(n)
    }

    const allChoices = [...wrong, newCount].sort(() => Math.random() - 0.5)
    setChoices(allChoices)
  }

  const speakQuestion = async () => {
    await speak(`How many crabs do you see?`)
    await speak(`Có bao nhiêu con cua?`, 'vi-VN')
  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async (choice: number) => {
    if (choice === count) {
      playCorrect()
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
      addStar()
	  setStreak((prev) => prev + 1)
      setScore(prev => prev + 1)
      setShowCelebrate(true)

	  // Speak English praise
      await speak(`${randomPraise()} ${choice}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${choice}!`, 'vi-VN')

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
      }, 1500)
    } else {
      playWrong()
	  setStreak(0)
      await speak('Try again!')
      await speak('Thử lại nhé!', 'vi-VN')
    }
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🦀 Crab Count - Đếm cua</h2>

      <h2 style={{ color: '#0099ff', marginTop: 10 }}>
        ⭐ Score: {score}
      </h2>
		<h3>
  🔥 Streak: {streak}
</h3>
{streak >= 3 && (
  <div
    style={{
      fontSize: 32,
      marginBottom: 20,
      color: '#ff4757',
      animation:
        'pop 0.5s ease',
    }}
  >
    🔥 Amazing Streak!
  </div>
)}
      {showCelebrate && (
        <div
          style={{
            fontSize: 60,
            marginTop: 20,
            animation: 'pop 0.6s ease',
          }}
        >
          🌊🦀⭐
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        Count the crabs:
      </p>

      <div
        style={{
          fontSize: 60,
          marginTop: 20,
          lineHeight: '70px',
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>🦀</span>
        ))}
      </div>

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
            }}
          >
            {c}
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
