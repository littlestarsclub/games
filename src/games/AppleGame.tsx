import { useEffect, useState } from 'react' 
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'


const items = [
  { emoji: '🍎', name: 'APPLE', vietnamese: 'TÁO' },
  { emoji: '🍌', name: 'BANANA', vietnamese: 'CHUỐI' },
  { emoji: '🚌', name: 'BUS', vietnamese: 'XE BUÝT' },
]

export default function AppleGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [target, setTarget] = useState(items[0])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  
  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    const randomItem =
      items[Math.floor(Math.random() * items.length)]

    setTarget(randomItem)
  }

	const speakQuestion = async () => {
		await speak(`Can you find ${target.name}?`)
		await speak(target.vietnamese, 'vi-VN')
	}

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
  const handleClick = (item: typeof items[0]) => {
    if (item.name === target.name) {
      playCorrect()
	  if (streak === 2) {
  speak('Amazing streak!')
}

if (streak === 4) {
  speak('Super learner!')
}

if (streak === 9) {
  speak('WOW! Superstar!')
}
	  addStar()
	  setStreak((prev) => prev + 1)
	  setScore((prev) => prev + 1)
	  setShowCelebrate(true)
      speak(`${randomPraise()} ${item.name}!`)

      setTimeout(() => {
        speak(item.vietnamese, 'vi-VN')
      }, 1000)

    setTimeout(() => {
  setShowCelebrate(false)

  nextRound()
}, 2000)
    } else {
      playWrong()
	  setStreak(0)
      speak('Try again!')
    }
  }

  return (
    <>
	 <button
        onClick={onBack}
        style={nextButton}
      >
        ⬅ Back
      </button>

      <h2>🍎 Find the Item!</h2>
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
      <p>Can you find {target.name}?</p>
      <p>{target.vietnamese}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 30,
        }}
      >
        {items.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item)}
            style={gameButton}
          >
            {item.emoji}
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

const gameButton = {
  fontSize: 90,
  border: 'none',
  borderRadius: 24,
  padding: 30,
  cursor: 'pointer',
  background: '#fff9d9',
}

