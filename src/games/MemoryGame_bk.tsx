import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'

const emojis = [
  '🐶',
  '🐱',
  '🐸',
  '🦁',
]

const cards = [...emojis, ...emojis]
  .sort(() => Math.random() - 0.5)

export default function MemoryGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  
  const [flipped, setFlipped] =  useState<number[]>([])

  const [matched, setMatched] =  useState<number[]>([])

  const handleClick = (index: number) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      matched.includes(index)
    )
      return

    const newFlipped = [
      ...flipped,
      index,
    ]

    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [a, b] = newFlipped

      if (cards[a] === cards[b]) {
        setMatched((prev) => [
          ...prev,
          a,
          b,
        ])
		playCorrect()
        addStar()
		
      }

      setTimeout(() => {
        setFlipped([])
      }, 1000)
    }
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
  useEffect(() => {
    if (matched.length === cards.length) {
	  setScore((prev) => prev + 1)
	  setShowCelebrate(true)
	  speak(`${randomPraise()}`)
    }
  }, [matched])

	
  return (
    <div>
      <button
        onClick={onBack}
		style={nextButton}
       
      >
        ⬅ Back
      </button>

      <h2>🧠 Memory Match</h2>
	  <h2
        style={{  color: '#ff7b00',  marginTop: 10, }}
	   >
			⭐ Score: {score}
	   </h2>
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, 1fr)',
          gap: 20,
          marginTop: 30,
        }}
      >
        {cards.map((emoji, index) => {
          const show =
            flipped.includes(index) ||
            matched.includes(index)

          return (
            <button
              key={index}
              onClick={() =>
                handleClick(index)
              }
              style={{
                height: 100,
                fontSize: 40,
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                background: '#ffeaa7',
              }}
            >
              {show ? emoji : '❓'}
            </button>
          )
        })}
      </div>
	 
    </div>
	
  )
}