import { useEffect, useState } from 'react' 
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyItems = [
  {  emoji: '🍎', name: 'APPLE', vietnamese: 'TÁO' },
  {  emoji: '🍌', name: 'BANANA', vietnamese: 'CHUỐI' },
  {  emoji: '🚌', name: 'BUS',  vietnamese: 'XE BUÝT' },
]

const mediumItems = [
  {  emoji: '🍎', name: 'APPLE', vietnamese: 'TÁO' },
  {  emoji: '🍌', name: 'BANANA', vietnamese: 'CHUỐI' },
  {  emoji: '🚌', name: 'BUS',  vietnamese: 'XE BUÝT' },
  {  emoji: '🍇', name: 'GRAPES',  vietnamese: 'NHO'  },
  {  emoji: '🍓', name: 'STRAWBERRY', vietnamese: 'DÂU' },
]

const hardItems = [
  {  emoji: '🍎', name: 'APPLE', vietnamese: 'TÁO' },
  {  emoji: '🍌', name: 'BANANA', vietnamese: 'CHUỐI' },
  {  emoji: '🚌', name: 'BUS',  vietnamese: 'XE BUÝT' },
  {  emoji: '🍇', name: 'GRAPES',  vietnamese: 'NHO'  },
  {  emoji: '🍓', name: 'STRAWBERRY', vietnamese: 'DÂU' },
  {  emoji: '🥝', name: 'KIWI',   vietnamese: 'KIWI' },
  {  emoji: '🥥', name: 'COCONUT', vietnamese: 'DỪA'  },
]

export default function AppleGame({
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

  let randomItem =
    items[Math.floor(Math.random() * items.length)]

  while (randomItem.name === target.name) {
    randomItem =
      items[Math.floor(Math.random() * items.length)]
  }

  setTarget(randomItem)
}

	const speakQuestion = async () => {
		if (disableUI) return
		setIsSpeaking(true)
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

const randomPraise = () => {return praises[ Math.floor(Math.random() * praises.length) ]}
 const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
 const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async( item: typeof items[0]) => {
	  if (isLocked) return
    if (item.name === target.name) {
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
      await speak(`${randomPraise()} ${item.name}!`)
	  await speak(`${randomPraiseVN()} ${item.vietnamese}!`, 'vi-VN')
      const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('apple')
}
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

      <h2>🍎 Find the Item! Tìm vật phẩm!</h2>
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
			disabled={disableUI}
            onClick={() => handleClick(item)}
            style={gameButton}
          >
            {item.emoji}
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

const gameButton = {
  fontSize: 90,
  border: 'none',
  borderRadius: 24,
  padding: 30,
  cursor: 'pointer',
  background: '#fff9d9',
}

