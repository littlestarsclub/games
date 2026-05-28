import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'

const easyAnimals = [
  {
    emoji: '🐭',
    name: 'MOUSE',
    vietnamese: 'CHUỘT',
    size: 1,
  },
  {
    emoji: '🐱',
    name: 'CAT',
    vietnamese: 'MÈO',
    size: 2,
  },
  {
    emoji: '🐶',
    name: 'DOG',
    vietnamese: 'CHÓ',
    size: 3,
  },
  {
    emoji: '🐷',
    name: 'PIG',
    vietnamese: 'HEO',
    size: 4,
  },
]

const mediumAnimals = [
  {
    emoji: '🐭',
    name: 'MOUSE',
    vietnamese: 'CHUỘT',
    size: 1,
  },
  {
    emoji: '🐱',
    name: 'CAT',
    vietnamese: 'MÈO',
    size: 2,
  },
  {
    emoji: '🐶',
    name: 'DOG',
    vietnamese: 'CHÓ',
    size: 3,
  },
  {
    emoji: '🐷',
    name: 'PIG',
    vietnamese: 'HEO',
    size: 4,
  },
  {
    emoji: '🐮',
    name: 'COW',
    vietnamese: 'BÒ',
    size: 5,
  },
  {
    emoji: '🐴',
    name: 'HORSE',
    vietnamese: 'NGỰA',
    size: 6,
  },
]

const hardAnimals = [
  {
    emoji: '🐭',
    name: 'MOUSE',
    vietnamese: 'CHUỘT',
    size: 1,
  },
  {
    emoji: '🐱',
    name: 'CAT',
    vietnamese: 'MÈO',
    size: 2,
  },
  {
    emoji: '🐶',
    name: 'DOG',
    vietnamese: 'CHÓ',
    size: 3,
  },
  {
    emoji: '🐷',
    name: 'PIG',
    vietnamese: 'HEO',
    size: 4,
  },
  {
    emoji: '🐮',
    name: 'COW',
    vietnamese: 'BÒ',
    size: 5,
  },
  {
    emoji: '🐴',
    name: 'HORSE',
    vietnamese: 'NGỰA',
    size: 6,
  },
  {
    emoji: '🦒',
    name: 'GIRAFFE',
    vietnamese: 'HƯƠU CAO CỔ',
    size: 7,
  },
  {
    emoji: '🐘',
    name: 'ELEPHANT',
    vietnamese: 'VOI',
    size: 8,
  },
]
export default function BigOrSmallGame({
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
}) 
{
	const animals = difficulty === 'easy' ? easyAnimals : difficulty === 'medium' ? mediumAnimals : hardAnimals
	const [a, setA] = useState(animals[0])
	const [b, setB] = useState(animals[1])
	const [questionType, setQuestionType] = useState<'bigger' | 'smaller'>('bigger')
	const [score, setScore] = useState(0)
	const [showCelebrate, setShowCelebrate] = useState(false)
	const [streak, setStreak] =  useState(0)
	const {isLocked, setIsLocked, isSpeaking, disableUI, } = useGameLock()

	useEffect(() => { nextRound() }, [difficulty])

	const nextRound = () => {
		if (disableUI) return
		let first =  animals[ Math.floor( Math.random() *  animals.length ) ]
		let second = animals[ Math.floor( Math.random() *  animals.length ) ]
		while ( second.name === first.name ) 
		{
			second =  animals[ Math.floor( Math.random() *  animals.length ) ]
		}
		setA(first)
		setB(second)

		setQuestionType( Math.random() > 0.5 ? 'bigger'  : 'smaller' )
	}

	const speakQuestion = async () => {
		if (disableUI) return
		if ( questionType === 'bigger') 
			{ await speak('Which animal is bigger?')
			await speak('Con vật nào lớn hơn?', 'vi-VN' ) } 
		else { await speak( 'Which animal is smaller?' )
			await speak( 'Con vật nào nhỏ hơn?', 'vi-VN' )
		}
	}
	
	const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
	const randomPraise = () => praises[Math.floor(Math.random() * praises.length)]
	const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
	const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
 
	const handleClick = async (choice: typeof animals[0]) => {
		if (disableUI) return
		const correct =  questionType === 'bigger' ? choice.size === Math.max(a.size, b.size) : choice.size === Math.min(a.size, b.size)
		if (correct) {
			playCorrect()
			setIsLocked(true)
			if (streak === 2) {speak('Amazing streak!')}
			if (streak === 4) {speak('Super learner!')}
			if (streak === 9) {speak('WOW! Superstar!')}
			addStar()
			setStreak((prev) => prev + 1)
			const newScore = score + 1
			setScore(newScore)
			if (newScore >= 5) { completeGame('BigOrSmallGame')}
			setShowCelebrate(true)
			await speak(`${randomPraise()} ${choice.name}!`)
			await speak(`${randomPraiseVN()} ${choice.vietnamese}!`, 'vi-VN')
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
	<h2>🐘 Big or Small? - To hay nhỏ?</h2>
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
			{questionType === 'bigger' ? 'Which animal is bigger?' : 'Which animal is smaller?'}
		</p>

		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				gap: 40,
				marginTop: 30,
				flexWrap: 'wrap',
			}}
		>
        <button style={emojiButton} disabled={disableUI} onClick={() => handleClick(a)}>
			{a.emoji}
        </button>
        <button style={emojiButton} disabled={disableUI} onClick={() => handleClick(b)}>
			{b.emoji}
        </button>
		</div>
		<button disabled={disableUI} onClick={speakQuestion}  style={{ ...speakButton, opacity:  disableUI ? 0.5 : 1  }}>
			🔊 Hear Question
		</button>
		<button disabled={disableUI} onClick={nextRound} style={{ ...nextButton,  opacity: disableUI ? 0.5 : 1  }}>
			➡️ Next
		</button>
    </>
  )
}
