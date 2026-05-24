import { useEffect, useState } from 'react'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'

const items = [
  {
    emoji: '🎈',
    name: 'up',
	vi: 'lên',
  },

  {
    emoji: '🪁',
    name: 'up',
	vi: 'lên',
  },

  {
    emoji: '🚀',
    name: 'up',
	vi: 'lên',
  },

  {
    emoji: '⬇️',
    name: 'down',
	vi: 'xuống',
  },

  {
    emoji: '🪨',
    name: 'down',
	vi: 'xuống',
  },

  {
    emoji: '⚓',
    name: 'down',
	vi: 'xuống',
  },
]

function randomItem() {
  return items[
    Math.floor(
      Math.random() * items.length
    )
  ]
}

export default function UpDownGame({
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

  const [showCelebrate, setShowCelebrate] =
    useState(false)

  useEffect(() => {
  const speakLineEn = async () => {
    await speak('Is it up or down?')
  }
 const speakLineVi = async () => {
    await speak('Là lên hay xuống?', 'vi-VN')
  }
  speakLineEn()
  speakLineVi()
}, [item])


  const nextRound = () => {
    setItem(randomItem())
  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

  const handleAnswer = async (
    answer: string
  ) => {
    if (answer === item.name) {
	  playCorrect()
      addStar()

      setScore((prev) => prev + 1)

      setStreak((prev) => prev + 1)

      setShowCelebrate(true)

	  // Speak English praise
      await speak(`${randomPraise()} ${item.name}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${item.vi}!`, 'vi-VN')

	  
      if (streak === 2) {
        speak(
          'Amazing streak!'
        )
      }

      if (streak === 4) {
        speak(
          'Super learner!'
        )
      }

      if (streak === 9) {
        speak(
          'Wow! Superstar!'
        )
      }

      setTimeout(() => {
        setShowCelebrate(false)

        nextRound()
      }, 1200)
    } else {
	  playWrong()
      setStreak(0)
	  await speak('Oops! Try again!')
      await speak('Ối! Thử lại nhé!', 'vi-VN')
    }
  }

  return (
    <div>
	<button onClick={onBack} style={nextButton}>⬅ Back</button>
      <h2>
        ⬆️⬇️ Up or Down - Lên hay Xuống
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
          🎉⬆️✨
        </div>
      )}
 <p
        style={{
          fontSize: 28,
          marginBottom: 30,
          color: '#555',
        }}
      >
        Is it UP or DOWN?
      </p>

      <div
        style={{
          fontSize: 140,
          marginTop: 30,
          marginBottom: 30,

          animation:
            item.name === 'up'
              ? 'float 1s ease-in-out infinite'
              : 'float 2.5s ease-in-out infinite',
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
          onClick={() =>
            handleAnswer('up')
          }
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#55efc4',
            color: 'black',
            cursor: 'pointer',
          }}
        >
          ⬆️ UP
        </button>

        <button
          onClick={() =>
            handleAnswer('down')
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
          ⬇️ DOWN
        </button>
      </div>
    </div>
  )
}