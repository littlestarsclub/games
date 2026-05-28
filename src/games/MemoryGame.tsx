import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, emojiButton } from '../utils/gameStyles'

const easyItems = [
  { emoji: '🦁', en: 'LION', vi: 'SƯ TỬ' },
  { emoji: '🐯', en: 'TIGER', vi: 'HỔ' },
  { emoji: '🐵', en: 'MONKEY', vi: 'KHỈ' },
  { emoji: '🐘', en: 'ELEPHANT', vi: 'VOI' },
]

const mediumItems = [
  { emoji: '🦁', en: 'LION', vi: 'SƯ TỬ' },
  { emoji: '🐯', en: 'TIGER', vi: 'HỔ' },
  { emoji: '🐵', en: 'MONKEY', vi: 'KHỈ' },
  { emoji: '🐘', en: 'ELEPHANT', vi: 'VOI' },
  { emoji: '🦒', en: 'GIRAFFE', vi: 'HƯƠU CAO CỔ' },
  { emoji: '🦓', en: 'ZEBRA', vi: 'NGỰA VẰN' },
]

const hardItems = [
  { emoji: '🦁', en: 'LION', vi: 'SƯ TỬ' },
  { emoji: '🐯', en: 'TIGER', vi: 'HỔ' },
  { emoji: '🐵', en: 'MONKEY', vi: 'KHỈ' },
  { emoji: '🐘', en: 'ELEPHANT', vi: 'VOI' },
  { emoji: '🦒', en: 'GIRAFFE', vi: 'HƯƠU CAO CỔ' },
  { emoji: '🦓', en: 'ZEBRA', vi: 'NGỰA VẰN' },
  { emoji: '🐼', en: 'PANDA', vi: 'GẤU TRÚC' },
  { emoji: '🦘', en: 'KANGAROO', vi: 'CHUỘT TÚI' },
]

export default function ZooMemoryGame({
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
const items =
  difficulty === 'easy'
    ? easyItems
    : difficulty === 'medium'
    ? mediumItems
    : hardItems

  const [cards, setCards] = useState<any[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)

useEffect(() => {
  startGame()
}, [difficulty])

const startGame = () => {
  const duplicated = [...items, ...items]

  const shuffled = duplicated
    .map((item) => ({
      ...item,
      id: Math.random(),
    }))
    .sort(() => Math.random() - 0.5)

  setCards(shuffled)
  setFlipped([])
  setMatched([])
}
  
const praises = [ 'Amazing!', 'Wonderful!', 'Great job!', 'Awesome!', 'Yay!',]
const randomPraise = () => {return praises[ Math.floor(Math.random() * praises.length) ]}

 const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!',]
 const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleFlip = async(index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped
      const card1 = cards[i1]
      const card2 = cards[i2]

      if (card1.en === card2.en) {
        playCorrect()
		if (streak === 2) {speak('Amazing streak!')}
	    if (streak === 4) {speak('Super learner!')}
	    if (streak === 9) {speak('WOW! Superstar!')}
        addStar()
		setStreak((prev) => prev + 1)
			   const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('memory')
}
        setMatched(prev => [...prev, i1, i2])
        setShowCelebrate(true)

	    await speak(`${randomPraise()} ${card1.en}!`)
	    await speak(`${randomPraiseVN()} ${card1.vi}!`, 'vi-VN')
	   

        setTimeout(() => setShowCelebrate(false), 1200)
      } else {
        playWrong()
		setStreak(0)
        await speak('Try again!')
        await speak('Thử lại nhé!', 'vi-VN')
      }

      setTimeout(() => setFlipped([]), 900)
    }
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🧠🐯 Zoo Memory Match - Trò chơi trí nhớ</h2>

      <h2 style={{ color: '#ff7b00', marginTop: 10 }}>
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
        <div style={{ fontSize: 60, marginTop: 10 }}>
          🎉🐾⭐
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 80px)',
          gap: 15,
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              style={{
                ...emojiButton,
                width: 80,
                height: 80,
                fontSize: isFlipped ? 40 : 0,
                background: isFlipped ? '#fff' : '#d0e7ff',
                transition: '0.3s',
              }}
            >
              {isFlipped ? card.emoji : '❓'}
            </button>
          )
        })}
      </div>

      <button onClick={startGame} style={nextButton}>
        🔄 Restart
      </button>
    </>
  )
}
