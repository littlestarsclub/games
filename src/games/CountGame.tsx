import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyRange = { min: 1, max: 5 }
const mediumRange = { min: 1, max: 10 }
const hardRange = { min: 1, max: 20 }

export default function CountGame({
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
  const [count, setCount] = useState(range)
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const {isLocked,  setIsLocked, isSpeaking, setIsSpeaking, disableUI, } = useGameLock()
  const [answerButtons, setAnswerButtons] = useState<number[]>([])

  useEffect(() => {
    nextRound()
  }, [difficulty])

function generateAnswerButtons(correct, range) {
  const answers = new Set()
  answers.add(correct)

  while (answers.size < 5) {
    const wrong =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

    if (wrong !== correct) answers.add(wrong)
  }

  return Array.from(answers).sort(() => Math.random() - 0.5)
}

const nextRound = () => {
	if (isLocked) return
  const randomCount =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

  setCount(randomCount)

  const generated = generateAnswerButtons(randomCount, range)
  setAnswerButtons(generated)
}

  const stars = Array(count).fill('⭐')

const praises = [
  'Amazing!',
  'Wonderful!',
  'Great job!',
  'Awesome!',
  'Yay!',
]

const randomPraise = () => {
  return praises[
    Math.floor(Math.random() * praises.length)
  ]
}
  const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

  const handleClick = async(num: number) => {
	 if (isLocked) return
    if (num === count) {
      playCorrect()
	  setIsLocked(true)
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
	  addStar()
	  setStreak((prev) => prev + 1)
	  setShowCelebrate(true)
	  
	  // Speak English praise
      await speak(`${randomPraise()} ${num}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${num}!`, 'vi-VN')
	 const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('count')
}
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

  const speakQuestion = async() => {
	  if (disableUI) return
    await speak('How many stars do you see?')
	await speak('Có bao nhiêu ngôi sao?', 'vi-VN')
	setIsSpeaking(false)
  }

  return (
    <>
	<button
        onClick={onBack}
        style={nextButton}
      >
        ⬅ Back
      </button>
      <h2>⭐ Count the Stars! Đếm những vì sao!</h2>
<h2
  style={{
    color: '#ff7b00',
    marginTop: 10,
  }}
>
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
    🎉 ⭐ 🌟
  </div>
)}
      <p>How many stars do you see?</p>

      <div
        style={{
          fontSize: 100,
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        {stars.join(' ')}
      </div>
	  <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 30,
        }}
      >
     {answerButtons.map(num => (
  <button key={num} disabled={disableUI} onClick={() => handleClick(num)} style={numberButton}>
    {num}
  </button>
))}
      </div>


      <button
	   disabled={disableUI}
        onClick={speakQuestion}
         style={{
    ...speakButton,
    opacity:
      isLocked || isSpeaking ? 0.5 : 1,
  }}
      >
        🔊 Hear the Question
      </button>

      <button
	   disabled={isLocked || isSpeaking}
        onClick={nextRound}
        style={{
    ...nextButton,
    opacity:
      isLocked || isSpeaking ? 0.5 : 1,
  }}
      >
        ➡️ Next Question
      </button>
    </>
  )
}

const numberButton = {
  fontSize: 50,
  border: 'none',
  borderRadius: 24,
  padding: '20px 30px',
  cursor: 'pointer',
  background: '#d9f4ff',
}

