import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyItems = [
  { en: 'DOG', vi: 'CHÓ' },
  { en: 'CAT', vi: 'MÈO' },
  { en: 'COW', vi: 'BÒ' },
  { en: 'PIG', vi: 'HEO' },
  { en: 'BIRD', vi: 'CHIM' },
  { en: 'FISH', vi: 'CÁ' },
]

const mediumItems = [
  { en: 'DOG', vi: 'CHÓ' },
  { en: 'CAT', vi: 'MÈO' },
  { en: 'COW', vi: 'BÒ' },
  { en: 'PIG', vi: 'HEO' },
  { en: 'BIRD', vi: 'CHIM' },
  { en: 'FISH', vi: 'CÁ' },
  { en: 'DUCK', vi: 'VỊT' },
  { en: 'HORSE', vi: 'NGỰA' },
  { en: 'SHEEP', vi: 'CỪU' },
  { en: 'FROG', vi: 'ẾCH' },
]

const hardItems = [
 { en: 'DOG', vi: 'CHÓ' },
  { en: 'CAT', vi: 'MÈO' },
  { en: 'COW', vi: 'BÒ' },
  { en: 'PIG', vi: 'HEO' },
  { en: 'BIRD', vi: 'CHIM' },
  { en: 'FISH', vi: 'CÁ' },
  { en: 'DUCK', vi: 'VỊT' },
  { en: 'HORSE', vi: 'NGỰA' },
  { en: 'SHEEP', vi: 'CỪU' },
  { en: 'FROG', vi: 'ẾCH' },
  { en: 'BEAR', vi: 'GẤU' },
  { en: 'MONKEY', vi: 'KHỈ' },
  { en: 'TURTLE', vi: 'RÙA' },
  { en: 'RABBIT', vi: 'THỎ' },
]

export default function MatchWordGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
}: {
  onBack: () => void
  addStar: () => void
  difficulty
    completeGame: (
    gameName: string
  ) => void
}) {
  const words =  difficulty === 'easy' ? easyItems : difficulty === 'medium' ? mediumItems : hardItems
  const [target, setTarget] = useState(words[0])
  const [choices, setChoices] = useState<typeof words>([])
  const [direction, setDirection] = useState<'enToVi' | 'viToEn'>('enToVi')
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const {isLocked,  setIsLocked, isSpeaking, setIsSpeaking, disableUI, } = useGameLock()

  useEffect(() => {
    nextRound()
  }, [difficulty])

 const nextRound = () => {
  if (isLocked) return
  const randomWord = words[Math.floor(Math.random() * words.length)]
  setTarget(randomWord)

  // Random direction
  const dir = Math.random() > 0.5 ? 'enToVi' : 'viToEn'
  setDirection(dir)

  // Number of choices based on difficulty
  const choiceCount =
    difficulty === 'easy' ? 3 :
    difficulty === 'medium' ? 5 :
    7

  // Build wrong choices
  let wrongChoices = words
    .filter(w => w.en !== randomWord.en)
    .sort(() => Math.random() - 0.5)
    .slice(0, choiceCount - 1)

  // Add correct answer
  const allChoices = [...wrongChoices, randomWord].sort(
    () => Math.random() - 0.5
  )

  setChoices(allChoices)
}


  const speakQuestion = async () => {
   if (disableUI) return
   if (direction === 'enToVi') {
      await speak(`What is the Vietnamese word for `)
      await speak(`Từ tiếng Việt là gì?`, 'vi-VN')
	  await speak(`${target.en}?`)
    } else {
      await speak(`Listen carefully! What is the English word for`)
      await speak(`Từ tiếng Anh là gì?`, 'vi-VN')
	  await speak(`${target.vi}`, 'vi-VN')
    }
	setIsSpeaking(false)
  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
  
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]

  const handleClick = async (choice: typeof words[0]) => {
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
      setShowCelebrate(true)

      const word = direction === 'enToVi' ? target.vi : target.en
      const lang = direction === 'enToVi' ? 'vi-VN' : 'en-US'

	  if (lang === 'en-US') speak(`${randomPraise()} ${word}!`)
	  if (lang === 'vi-VN') speak(`${randomPraiseVN()} ${word}!`, 'vi-VN')
const newScore = score + 1

setScore(newScore)

if (newScore >= 5) {
  completeGame('MatchWordGame')
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
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🔤 Match the Word! Ghép từ!</h2>

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
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop 0.6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        {direction === 'enToVi'
          ? `Match the Vietnamese word for:`
          : `Match the English word for:`}
      </p>

      <h1 style={{ fontSize: 50, marginTop: 10 }}>
        {direction === 'enToVi' ? target.en : target.vi}
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
              fontSize: 30,
              padding: '20px 30px',
            }}
          >
            {direction === 'enToVi' ? c.vi : c.en}
          </button>
        ))}
      </div>

      <button disabled={disableUI} onClick={speakQuestion} style={{
    ...speakButton,
    opacity:
      isLocked || isSpeaking ? 0.5 : 1,
  }}>
        🔊 Hear Question
      </button>

      <button disabled={isLocked || isSpeaking} onClick={nextRound} style={{
    ...nextButton,
    opacity:
      isLocked || isSpeaking ? 0.5 : 1,
  }}>
        ➡️ Next
      </button>
    </>
  )
}
