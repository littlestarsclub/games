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
  const [questionA, setQuestionA] = useState(0)
  const [questionB, setQuestionB] = useState(0)
  const [answer, setAnswer] = useState(0)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const [isLocked, setIsLocked] =   useState(false)

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    // Preschool-friendly: only 0–3 rockets per side
    const a = Math.floor(Math.random() * 3) // 0–2
    const b = Math.floor(Math.random() * 3) // 0–2

    const correct = a + b // max = 4

    setQuestionA(a)
    setQuestionB(b)
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
    await speak(`How many rockets are there?`)
    await speak(`Có bao nhiêu tên lửa?`, 'vi-VN')
  }

  const praises = ['Blast off!', 'Amazing!', 'Great job!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

const handleClick = async (choice: number) => {
	if (isLocked) return
  if (choice === answer) {
    playCorrect()
	setIsLocked(true)
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

      <button onClick={speakQuestion} style={speakButton}>
        🔊 Hear Question
      </button>

      <button onClick={nextRound} style={nextButton}>
        ➡️ Next
      </button>
    </>
  )
}
