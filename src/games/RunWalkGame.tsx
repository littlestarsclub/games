import { useEffect, useState } from 'react'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'


const items = [
  {
    emoji: '🏃',
    name: 'run',
	vi: 'chạy',
  },

  {
    emoji: '🐇',
    name: 'run',
	vi: 'chạy',
  },

  {
    emoji: '🐆',
    name: 'run',
	vi: 'chạy',
  },

  {
    emoji: '🚶',
    name: 'walk',
	vi: 'đi bộ',
  },

  {
    emoji: '🐢',
    name: 'walk',
	vi: 'đi bộ',
  },

  {
    emoji: '🦆',
    name: 'walk',
	vi: 'đi bộ',
  },
]

function randomItem() {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ]
}

export default function RunWalkGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [item, setItem] =
    useState(randomItem())

  const [score, setScore] =
    useState(0)

  const [streak, setStreak] =
    useState(0)
  const [isLocked, setIsLocked] =
  useState(false)
  const [
  showCelebrate,
  setShowCelebrate,
] = useState(false)
  
  useEffect(() => {
  const speakLines = async () => {
    await speak('Is it run or walk?')
    await speak('Là chạy hay đi bộ?', 'vi-VN')
  }
  speakLines()
}, [item])

  const nextRound = () => {
  let newItem = randomItem()

  while (
    newItem.emoji === item.emoji
  ) {
    newItem = randomItem()
  }

  setItem(newItem)
}

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

  const handleAnswer = async (
    answer: string
  ) => {
	  if (isLocked) return
    if (answer === item.name) {
	  playCorrect()
	  setIsLocked(true)
      addStar()

      setScore((prev) => prev + 1)

     const newStreak = streak + 1

	setStreak(newStreak)

      setShowCelebrate(true)

      // Speak English praise
      await speak(`${randomPraise()} ${item.name}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${item.vi}!`, 'vi-VN')

if (streak === 2) {
  speak('Amazing streak!')
}

if (streak === 4) {
  speak('Super learner!')
}

if (streak === 9) {
  speak('Wow! Superstar!')
}

     nextRound()

setTimeout(() => {
  setShowCelebrate(false)

  setIsLocked(false)
}, 1200)
    } else {
  setIsLocked(true)
      playWrong()
      setStreak(0)
      await speak('Oops! Try again!')
      await speak('Ối! Thử lại nhé!', 'vi-VN') 
	  setIsLocked(false)
    }
  }

  return (
    <div>
      	<button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>
        🏃🚶 Run or Walk - Chạy hay Đi bộ
      </h2>

      <h3
        style={{
          color: '#ff7b00',
        }}
      >
        ⭐ Score: {score}
      </h3>

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
            animation:
              'pop 0.5s ease',
          }}
        >
          🎉🏃✨
        </div>
      )}
	   <p
        style={{
          fontSize: 28,
          marginBottom: 30,
          color: '#555',
        }}
      >
        Is it RUN or WALK?
      </p>
      <div
        style={{
          fontSize: 140,
          marginTop: 30,
          marginBottom: 30,
          animation:
            item.name === 'run'
              ? 'float 0.6s ease-in-out infinite'
              : 'float 2s ease-in-out infinite',
        }}
      >
        {item.emoji}
      </div>

      

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <button
		disabled={isLocked}
          onClick={() =>
            handleAnswer('run')
          }
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#ff7675',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          🏃 RUN
        </button>

        <button

          onClick={() =>
            handleAnswer('walk')
          }
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#74b9ff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          🚶 WALK
        </button>
      </div>
    </div>
  )
}