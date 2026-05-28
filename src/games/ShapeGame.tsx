import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyItems = [
  {
    shape: '🔺',
    name: 'TRIANGLE',
    vietnamese: 'TAM GIÁC',
  },

  {
    shape: '⚪',
    name: 'CIRCLE',
    vietnamese: 'HÌNH TRÒN',
  },

  {
    shape: '🟥',
    name: 'SQUARE',
    vietnamese: 'HÌNH VUÔNG',
  },
]

const mediumItems = [
  {
    shape: '🔺',
    name: 'TRIANGLE',
    vietnamese: 'TAM GIÁC',
  },

  {
    shape: '⚪',
    name: 'CIRCLE',
    vietnamese: 'HÌNH TRÒN',
  },

  {
    shape: '🟥',
    name: 'SQUARE',
    vietnamese: 'HÌNH VUÔNG',
  },

  {
    shape: '⭐',
    name: 'STAR',
    vietnamese: 'NGÔI SAO',
  },

  {
    shape: '❤️',
    name: 'HEART',
    vietnamese: 'TRÁI TIM',
  },

  {
    shape: '🔷',
    name: 'DIAMOND',
    vietnamese: 'HÌNH KIM CƯƠNG',
  },
]

const hardItems = [
  {
    shape: '🔺',
    name: 'TRIANGLE',
    vietnamese: 'TAM GIÁC',
  },

  {
    shape: '⚪',
    name: 'CIRCLE',
    vietnamese: 'HÌNH TRÒN',
  },

  {
    shape: '🟥',
    name: 'SQUARE',
    vietnamese: 'HÌNH VUÔNG',
  },

  {
    shape: '⭐',
    name: 'STAR',
    vietnamese: 'NGÔI SAO',
  },

  {
    shape: '❤️',
    name: 'HEART',
    vietnamese: 'TRÁI TIM',
  },

  {
    shape: '🔷',
    name: 'DIAMOND',
    vietnamese: 'HÌNH KIM CƯƠNG',
  },

  {
    shape: '▬',
    name: 'RECTANGLE',
    vietnamese: 'HÌNH CHỮ NHẬT',
  },
  {
    shape: '⬣',
    name: 'HEXAGON',
    vietnamese: 'LỤC GIÁC',
  },

  {
    shape: '⬟',
    name: 'PENTAGON',
    vietnamese: 'NGŨ GIÁC',
  },
]

export default function ShapeGame({
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
})  {
  const items =  difficulty === 'easy' ? easyItems : difficulty === 'medium' ? mediumItems : hardItems
  const [target, setTarget] = useState(items[0])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
 	const {isLocked, setIsLocked, isSpeaking, disableUI, } = useGameLock()
  

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
  if (disableUI) return

  let randomItem =
    items[Math.floor(Math.random() * items.length)]

  while (randomItem.name === target.name) {
    randomItem =
      items[Math.floor(Math.random() * items.length)]
    }
  }

const praises = [
  'Amazing!',
  'Wonderful!',
  'Great job!',
  'Awesome!',
  'Yay!',
]

const speakQuestion = async () => {
	if (disableUI) return
    await speak(`Can you find ${target.name}?`)
	await speak(`Bạn có thể tìm thấy ${target.vietnamese} không?`, 'vi-VN')

  }

const randomPraise = () => {
  return praises[
    Math.floor(Math.random() * praises.length)
  ]
}
 const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
 const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async(shape: typeof items[0]) => {
	  if (disableUI) return
    if (shape.name === target.name) {
	  playCorrect()
	  setIsLocked(true)
	  if (streak === 2) { speak('Amazing streak!') }
	  if (streak === 4) { speak('Super learner!') }
	  if (streak === 9) { speak('WOW! Superstar!')}

	  addStar()
	  setStreak((prev) => prev + 1)
	  const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('shape')
}
	  setShowCelebrate(true)
      await speak(`${randomPraise()} ${shape.name}!`)
	  await speak(`${randomPraiseVN()} ${target.vietnamese}!`, 'vi-VN')
     

     setTimeout(() => {
  setShowCelebrate(false)

  nextRound()

  setIsLocked(false)
}, 2000)
   } else {
	   playWrong()
  setIsLocked(true)
	  setStreak(0)
      await speak('Try again!')
      await speak('Thử lại nhé!', 'vi-VN')
	  setIsLocked(false)
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
      <h2>🔺 Find the Shape! Tìm hình!</h2>
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
        {items.map((shape) => (
          <button
            key={shape.name}
			disabled={isLocked}
            onClick={() => handleClick(shape)}
            style={shapeButton}
          >
            {shape.shape}
          </button>
        ))}
      </div>
	  <button
	  disabled={disableUI}
        onClick={speakQuestion}
       style={{
    ...speakButton,
    opacity: disableUI ? 0.5 : 1
  }}
      >
        🔊 Hear the Question
      </button>
      <button
	   disabled={isLocked || isSpeaking}
        onClick={nextRound}
        style={{
    ...nextButton,
    opacity: disableUI ? 0.5 : 1
  }}
      >
        ➡️ Next Shape
      </button>
    </>
  )
}

const shapeButton = {
  fontSize: 90,
  border: 'none',
  borderRadius: 24,
  padding: 30,
  cursor: 'pointer',
  background: '#ffeaa7',
}
