import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyItems = [
  {
    name: 'RED',
    vietnamese: 'ĐỎ',
    color: '#ff4d4d',
  },
  {
    name: 'BLUE',
    vietnamese: 'XANH DƯƠNG',
    color: '#4d7cff',
  },
  {
    name: 'GREEN',
    vietnamese: 'XANH LÁ',
    color: '#4caf50',
  },
  {
    name: 'YELLOW',
    vietnamese: 'VÀNG',
    color: '#ffd60a',
  },
]
const mediumItems = [
  {
    name: 'RED',
    vietnamese: 'ĐỎ',
    color: '#ff4d4d',
  },
  {
    name: 'BLUE',
    vietnamese: 'XANH DƯƠNG',
    color: '#4d7cff',
  },
  {
    name: 'GREEN',
    vietnamese: 'XANH LÁ',
    color: '#4caf50',
  },
  {
    name: 'YELLOW',
    vietnamese: 'VÀNG',
    color: '#ffd60a',
  },
  {
    name: 'ORANGE',
    vietnamese: 'CAM',
    color: '#ff8c42',
  },
  {
    name: 'PURPLE',
    vietnamese: 'TÍM',
    color: '#9b59b6',
  },
]

const hardItems = [
  {
    name: 'RED',
    vietnamese: 'ĐỎ',
    color: '#ff4d4d',
  },
  {
    name: 'BLUE',
    vietnamese: 'XANH DƯƠNG',
    color: '#4d7cff',
  },
  {
    name: 'GREEN',
    vietnamese: 'XANH LÁ',
    color: '#4caf50',
  },
  {
    name: 'YELLOW',
    vietnamese: 'VÀNG',
    color: '#ffd60a',
  },
  {
    name: 'ORANGE',
    vietnamese: 'CAM',
    color: '#ff8c42',
  },
  {
    name: 'PURPLE',
    vietnamese: 'TÍM',
    color: '#9b59b6',
  },
  {
    name: 'PINK',
    vietnamese: 'HỒNG',
    color: '#ff6fb5',
  },
  {
    name: 'BROWN',
    vietnamese: 'NÂU',
    color: '#8d6e63',
  },
]

export default function ColorGame({
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
  const items =  difficulty === 'easy' ? easyItems : difficulty === 'medium' ? mediumItems : hardItems
  const [target, setTarget] = useState(items[0])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const {isLocked,  setIsLocked, isSpeaking, setIsSpeaking, disableUI, } = useGameLock()
  

useEffect(() => {
  nextRound()
}, [difficulty])


const nextRound = () => {
  if (isLocked) return

  let randomColor =
    items[Math.floor(Math.random() * items.length)]

  while (randomColor.name === target.name) {
    randomColor =
      items[Math.floor(Math.random() * items.length)]
  }

  setTarget(randomColor)
}
  
	const speakQuestion = async () => {
		if (disableUI) return
		await speak(`Can you find ${target.name}?`)
		await speak(`Bạn có thể tìm thấy ${target.vietnamese} không?`, 'vi-VN')
		setIsSpeaking(false)
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
 const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
 const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async(name: string) => {
	  if (isLocked) return
    if (name === target.name) {

      playCorrect()
	  setIsLocked(true)
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
	  setShowCelebrate(true)
	  
      await speak(`${randomPraise()} ${name}!`)
	  await speak(`${randomPraiseVN()} ${target.vietnamese}!`, 'vi-VN')
      const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('color')
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

  return (
    <>
	 <button
        onClick={onBack}
        style={nextButton}
      >
        ⬅ Back
      </button>
      <h2>🎨 Find the Color! Tìm màu!</h2>
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
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          marginTop: 40,
          flexWrap: 'wrap',
        }}
      >
        {items.map((item) => (
          <button
            key={item.name}
			disabled={isLocked}
            onClick={() => handleClick(item.name)}
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: item.color,
            }}
          />
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
	  disabled={disableUI}
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

