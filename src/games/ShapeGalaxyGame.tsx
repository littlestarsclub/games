import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'

const shapes = [
  { emoji: '🔵', en: 'CIRCLE', vi: 'HÌNH TRÒN' },
  { emoji: '🟥', en: 'SQUARE', vi: 'HÌNH VUÔNG' },
  { emoji: '🔺', en: 'TRIANGLE', vi: 'HÌNH TAM GIÁC' },
  { emoji: '🟪', en: 'RECTANGLE', vi: 'HÌNH CHỮ NHẬT' },
  { emoji: '⭐', en: 'STAR', vi: 'NGÔI SAO' },
  { emoji: '🛑', en: 'OCTAGON', vi: 'HÌNH BÁT GIÁC' },
]

export default function ShapeGalaxyGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [target, setTarget] = useState(shapes[0])
  const [choices, setChoices] = useState<typeof shapes>([])
  const [direction, setDirection] = useState<'enToVi' | 'viToEn'>('enToVi')
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const [isLocked, setIsLocked] =   useState(false)

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
    setTarget(randomShape)

    const dir = Math.random() > 0.5 ? 'enToVi' : 'viToEn'
    setDirection(dir)

    let wrong = shapes
      .filter(s => s.en !== randomShape.en)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    const allChoices = [...wrong, randomShape].sort(
      () => Math.random() - 0.5
    )

    setChoices(allChoices)
  }

  const speakQuestion = async () => {
    if (direction === 'enToVi') {
      await speak(`What is the Vietnamese word for`)
      await speak(`Từ tiếng Việt là gì?`, 'vi-VN')
	  await speak(`${target.en}?`)
    } else {
      await speak(`Listen carefully! What is the English word for`)
      await speak(`Từ tiếng Anh là gì?`, 'vi-VN')
	  await speak(`${target.vi}`, 'vi-VN')
    }
  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
  const handleClick = async(choice: typeof shapes[0]) => {
	  if (isLocked) return
    const correct =
      direction === 'enToVi'
        ? choice.vi === target.vi
        : choice.en === target.en

    if (correct) {
      playCorrect()
	  setIsLocked(true)
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
      addStar()
	  setStreak((prev) => prev + 1)
      setScore(prev => prev + 1)
      setShowCelebrate(true)

      // Speak English praise
      await speak(`${randomPraise()} ${target.en}!`)

      // Speak Vietnamese praise
      await speak(`${randomPraiseVN()} ${target.vi}!`, 'vi-VN')

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
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🌙 Shape Galaxy - Hình dạng ngân hà</h2>

      <h2 style={{ color: '#00aaff', marginTop: 10 }}>
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
          🌙✨⭐
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        Match the correct shape:
      </p>

      <h1 style={{ fontSize: 90, marginTop: 10 }}>
        🪐 {target.emoji}
      </h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 30,
          flexWrap: 'wrap',
        }}
      >
        {choices.map((c, i) => (
          <button
            key={i}
			disabled={isLocked}
            onClick={() => handleClick(c)}
            style={{
              ...emojiButton,
              fontSize: 28,
              padding: '20px 30px',
            }}
          >
            {direction === 'enToVi' ? c.vi : c.en}
          </button>
        ))}
      </div>

      <button onClick={speakQuestion} style={speakButton}>
        🔊 Hear Question
      </button>

      <button onClick={nextRound} style={nextButton}>
        ➡️ Next
      </button>
    </>
  )
}
