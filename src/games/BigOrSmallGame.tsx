import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyAnimals = [
  { emoji: '🐭', en: 'MOUSE', vi: 'CHUỘT', zh: '老鼠', size: 1 },
  { emoji: '🐱', en: 'CAT', vi: 'MÈO', zh: '猫', size: 2 },
  { emoji: '🐶', en: 'DOG', vi: 'CHÓ', zh: '狗', size: 3 },
  { emoji: '🐷', en: 'PIG', vi: 'HEO', zh: '猪', size: 4 },
]

const mediumAnimals = [
  ...easyAnimals,
  { emoji: '🐮', en: 'COW', vi: 'BÒ', zh: '牛', size: 5 },
  { emoji: '🐴', en: 'HORSE', vi: 'NGỰA', zh: '马', size: 6 },
]

const hardAnimals = [
  ...mediumAnimals,
  { emoji: '🦒', en: 'GIRAFFE', vi: 'HƯƠU CAO CỔ', zh: '长颈鹿', size: 7 },
  { emoji: '🐘', en: 'ELEPHANT', vi: 'VOI', zh: '大象', size: 8 },
]

const titles = {
  en: '🐘 Big or Small?',
  vi: '🐘 To hay Nhỏ?',
  zh: '🐘 大还是小？',
  'en-vi': '🐘 Big or Small? — To hay Nhỏ?',
  'en-zh': '🐘 Big or Small? — 大还是小？',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },
  score: {
    en: '⭐ Score',
    vi: '⭐ Điểm',
    zh: '⭐ 分数',
    'en-vi': '⭐ Score / Điểm',
    'en-zh': '⭐ Score / 分数',
  },
  streak: {
    en: '🔥 Streak',
    vi: '🔥 Chuỗi đúng',
    zh: '🔥 连续答对',
    'en-vi': '🔥 Streak / Chuỗi đúng',
    'en-zh': '🔥 Streak / 连续答对',
  },
  streakMessage: {
    en: '🔥 Amazing Streak!',
    vi: '🔥 Chuỗi đúng tuyệt vời!',
    zh: '🔥 惊人的连胜！',
    'en-vi': '🔥 Amazing Streak! / Chuỗi đúng tuyệt vời!',
    'en-zh': '🔥 Amazing Streak! / 惊人的连胜！',
  },
  streakSpeech: {
    streak2: { en: 'Amazing streak!', vi: 'Chuỗi đúng tuyệt vời!', zh: '惊人的连胜！' },
    streak4: { en: 'Super learner!', vi: 'Siêu học sinh!', zh: '超级学习者！' },
    streak9: { en: 'WOW! Superstar!', vi: 'WOW! Siêu sao!', zh: '哇！超级明星！' },
  },
  question: {
    bigger: {
      en: 'Which animal is bigger?',
      vi: 'Con vật nào lớn hơn?',
      zh: '哪个动物更大？',
      'en-vi': 'Which animal is bigger? / Con vật nào lớn hơn?',
      'en-zh': 'Which animal is bigger? / 哪个动物更大？',
    },
    smaller: {
      en: 'Which animal is smaller?',
      vi: 'Con vật nào nhỏ hơn?',
      zh: '哪个动物更小？',
      'en-vi': 'Which animal is smaller? / Con vật nào nhỏ hơn?',
      'en-zh': 'Which animal is smaller? / 哪个动物更小？',
    },
  },
  hearQuestion: {
    en: '🔊 Hear Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear Question / 听问题',
  },
  next: {
    en: '➡️ Next',
    vi: '➡️ Tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next / Tiếp theo',
    'en-zh': '➡️ Next / 下一题',
  },
}

export default function BigOrSmallGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const animals =
    difficulty === 'easy'
      ? easyAnimals
      : difficulty === 'medium'
      ? mediumAnimals
      : hardAnimals

  const [a, setA] = useState(animals[0])
  const [b, setB] = useState(animals[1])
  const [questionType, setQuestionType] = useState<'bigger' | 'smaller'>('bigger')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const { isLocked, setIsLocked, disableUI } = useGameLock()
  const { languageMode } = useLanguage()

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
    if (disableUI) return

    let first = animals[Math.floor(Math.random() * animals.length)]
    let second = animals[Math.floor(Math.random() * animals.length)]

    while (second.en === first.en) {
      second = animals[Math.floor(Math.random() * animals.length)]
    }

    setA(first)
    setB(second)
    setQuestionType(Math.random() > 0.5 ? 'bigger' : 'smaller')
  }

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: uiText.question[questionType],
      languageMode,
    })
  }

  const praises = {
    en: ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!'],
    vi: ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (choice) => {
    if (disableUI || isLocked) return

    const correct =
      questionType === 'bigger'
        ? choice.size === Math.max(a.size, b.size)
        : choice.size === Math.min(a.size, b.size)

    if (correct) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      const newScore = score + 1
      setScore(newScore)
      setStreak((prev) => prev + 1)

      if (newScore >= 5) completeGame('bigsmall')

      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${choice.en}!`,
          vi: `${randomPraise('vi')} ${choice.vi}!`,
          zh: `${randomPraise('zh')} ${choice.zh}!`,
        },
        languageMode,
      })

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
        setIsLocked(false)
      }, 2000)
    } else {
      playWrong()
      setIsLocked(true)
      setStreak(0)

      await speakLocalized({
        text: {
          en: 'Try again!',
          vi: 'Thử lại nhé!',
          zh: '再试一次！',
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 1200)
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetBigSmallGame
  }, [])

  const resetBigSmallGame = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
    setIsLocked(false)
    nextRound()
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>
        {uiText.back[languageMode]}
      </button>

      <h2>{titles[languageMode]}</h2>

      <h2 style={{ color: '#ff7b00', marginTop: 10 }}>
        {uiText.score[languageMode]}: {score}
      </h2>

      <h3>{uiText.streak[languageMode]}: {streak}</h3>

      {streak >= 3 && (
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop .5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop .6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        {uiText.question[questionType][languageMode]}
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
        <button
          style={emojiButton}
          disabled={disableUI}
          onClick={() => handleClick(a)}
        >
          {a.emoji}
        </button>

        <button
          style={emojiButton}
          disabled={disableUI}
          onClick={() => handleClick(b)}
        >
          {b.emoji}
        </button>
      </div>

      <button
        disabled={disableUI}
        onClick={speakQuestion}
        style={{ ...speakButton, opacity: disableUI ? 0.5 : 1 }}
      >
        {uiText.hearQuestion[languageMode]}
      </button>

      <button
        disabled={disableUI}
        onClick={nextRound}
        style={{ ...nextButton, opacity: disableUI ? 0.5 : 1 }}
      >
        {uiText.next[languageMode]}
      </button>
    </>
  )
}
