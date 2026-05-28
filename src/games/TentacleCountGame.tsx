import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyRange = { min: 1, max: 5 }
const mediumRange = { min: 1, max: 10 }
const hardRange = { min: 1, max: 20 }

export default function TentacleCountGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
}: {
  onBack: () => void
  addStar: () => void
  difficulty: string
  completeGame: (
    gameName: string
  ) => void
}) {
const range =
  difficulty === 'easy'
    ? easyRange
    : difficulty === 'medium'
    ? mediumRange
    : hardRange

  const [tentacles, setTentacles] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
 	const {isLocked, setIsLocked, isSpeaking, disableUI, } = useGameLock()
  

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
	  if (disableUI) return
  // Pick a random tentacle count based on difficulty
  const newCount =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

  setTentacles(newCount)

  // Generate 4 wrong answers
  const wrong = new Set<number>()
  while (wrong.size < 4) {
    const n =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    if (n !== newCount) wrong.add(n)
  }

  // Combine and shuffle
  const allChoices = [...wrong, newCount].sort(() => Math.random() - 0.5)
  setChoices(allChoices)
}


  const speakQuestion = async () => {
	  if (disableUI) return
    await speak(`How many tentacles does the octopus have?`)
    await speak(`Con bạch tuộc có bao nhiêu cái tua?`, 'vi-VN')

  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async (choice: number) => {
	  if (disableUI) return
    if (choice === tentacles) {
      playCorrect()
	  setIsLocked(true)
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
      addStar()
	  setStreak((prev) => prev + 1)
	  const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('TentacleCountGame')
}
      setShowCelebrate(true)

     // Speak English praise
      await speak(`${randomPraise()} ${choice}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${choice}!`, 'vi-VN')

      setTimeout(() => {
  setShowCelebrate(false)

  nextRound()

  setIsLocked(false)
}, 2000)
    } else {
  setIsLocked(true)
      playWrong()
	  setStreak(0)
      await speak('Try again!')
      await speak('Thử lại nhé!', 'vi-VN') 
	  setIsLocked(false)
    }
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🐙 Tentacle Count - Đếm số lượng xúc tu</h2>

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
          🌊🐙⭐
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        Count the tentacles:
      </p>

      <div
        style={{
          fontSize: 80,
          marginTop: 20,
          lineHeight: '90px',
        }}
      >
        {/* Show one octopus emoji per tentacle */}
        {Array.from({ length: tentacles }).map((_, i) => (
          <span key={i}>🐙</span>
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
			disabled={isLocked}
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

      <button disabled={disableUI} onClick={speakQuestion}  style={{
    ...speakButton,
    opacity: disableUI ? 0.5 : 1
  }}>
        🔊 Hear Question
      </button>

      <button disabled={isLocked || isSpeaking} onClick={nextRound} style={{
    ...nextButton,
    opacity: disableUI ? 0.5 : 1
  }}>
        ➡️ Next
      </button>
    </>
  )
}
