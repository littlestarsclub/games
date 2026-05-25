import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'

export default function CountGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [count, setCount] = useState(3)
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const [isLocked, setIsLocked] =   useState(false)
  
  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    const randomCount =
      Math.floor(Math.random() * 5) + 1

    setCount(randomCount)
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
	  setScore((prev) => prev + 1)
	  setShowCelebrate(true)
	  
	  // Speak English praise
      await speak(`${randomPraise()} ${num}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${num}!`, 'vi-VN')
	 
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
    await speak('How many stars do you see?')
	await speak('Có bao nhiêu ngôi sao?', 'vi-VN')
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
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
			disabled={isLocked}
            onClick={() => handleClick(num)}
            style={numberButton}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={speakQuestion}
        style={speakButton}
      >
        🔊 Hear the Question
      </button>

      <button
        onClick={nextRound}
        style={nextButton}
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

