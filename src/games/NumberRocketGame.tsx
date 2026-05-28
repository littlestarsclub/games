import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyRange = { min: 0, max: 5 }
const mediumRange = { min: 0, max: 10 }
const hardRange = { min: 0, max: 20 }

export default function NumberRocketGame({
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
  const range  =  difficulty === 'easy' ? easyRange : difficulty === 'medium' ? mediumRange : hardRange
  const [questionA, setQuestionA] = useState(0)
  const [questionB, setQuestionB] = useState(0)
  const [answer, setAnswer] = useState(0)
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

  // Pick random rockets for A and B based on difficulty
  const a = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
  const b = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

  const correct = a + b

  setQuestionA(a)
  setQuestionB(b)
  setAnswer(correct)

  // Generate 2 wrong answers
  const wrong = new Set()
  while (wrong.size < 2) {
    const n = Math.floor(Math.random() * (range.max * 2 + 1)) // possible sum range
    if (n !== correct) wrong.add(n)
  }

  const allChoices = [...wrong, correct].sort(() => Math.random() - 0.5)
  setChoices(allChoices)
}


  const speakQuestion = async () => {
	  if (disableUI) return
    await speak(`How many rockets are there?`)
    await speak(`Có bao nhiêu tên lửa?`, 'vi-VN')

  }

  const praises = ['Blast off!', 'Amazing!', 'Great job!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

const handleClick = async (choice: number) => {
	if (disableUI) return
  if (choice === answer) {
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
  completeGame('NumberRocketGame')
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

  const rockets = (n: number) => '🚀'.repeat(n)

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🚀 Count the Rockets - Đếm Tên lửa</h2>

      <h2 style={{ color: '#00aaff', marginTop: 10 }}>
        ⭐ Score: {score}
      </h2>
      <h3>🔥 Streak: {streak}</h3>
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
          🚀🔥⭐
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        How many rockets are there?
      </p>

      <h1 style={{ fontSize: 50, marginTop: 10 }}>
        {rockets(questionA)} + {rockets(questionB)}
      </h1>

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
