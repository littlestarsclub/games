import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { emojiButton, nextButton, speakButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyRange = { min: 1, max: 5 }
const mediumRange = { min: 1, max: 10 }
const hardRange = { min: 1, max: 20 }

const titles = {
  en: '⭐ Count the Stars!',
  vi: '⭐ Đếm những vì sao!',
  zh: '⭐ 数星星！',
  'en-vi': '⭐ Count the Stars! — Đếm những vì sao!',
  'en-zh': '⭐ Count the Stars! — 数星星！',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },

  instruction: {
    en: 'How many stars do you see?',
    vi: 'Bạn thấy bao nhiêu ngôi sao?',
    zh: '你看到多少颗星星？',
    'en-vi': 'How many stars do you see? / Bạn thấy bao nhiêu ngôi sao?',
    'en-zh': 'How many stars do you see? / 你看到多少颗星星？',
  },

  hearQuestion: {
    en: '🔊 Hear the Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear the Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear the Question / 听问题',
  },

  next: {
    en: '➡️ Next Question',
    vi: '➡️ Câu tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next Question / Câu tiếp theo',
    'en-zh': '➡️ Next Question / 下一题',
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

  praise: {
    en: ['Amazing!', 'Wonderful!', 'Great job!', 'Awesome!', 'Yay!'],
    vi: ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  },
}

export default function CountGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const range =
    difficulty === 'easy'
      ? easyRange
      : difficulty === 'medium'
      ? mediumRange
      : hardRange

  const [count, setCount] = useState(range.min)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [answerButtons, setAnswerButtons] = useState<number[]>([])

  const { isLocked, setIsLocked, disableUI, isSpeaking } = useGameLock()
  const { languageMode } = useLanguage()

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const generateAnswerButtons = (correct, range) => {
    const answers = new Set()
    answers.add(correct)

    while (answers.size < 5) {
      const wrong =
        Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
      if (wrong !== correct) answers.add(wrong)
    }

    return Array.from(answers).sort(() => Math.random() - 0.5)
  }

  const nextRound = () => {
    if (disableUI) return

    const randomCount =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min

    setCount(randomCount)
    setAnswerButtons(generateAnswerButtons(randomCount, range))
  }

  const stars = Array(count).fill('⭐')

  const randomPraise = (lang) => {
    const arr = uiText.praise[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (num: number) => {
    if (disableUI || isLocked) return

    if (num === count) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      const newScore = score + 1
      setScore(newScore)
      setStreak((prev) => prev + 1)

      if (newScore >= 5) completeGame('count')

      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${num}!`,
          vi: `${randomPraise('vi')} ${num}!`,
          zh: `${randomPraise('zh')} ${num}!`,
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

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: {
        en: 'How many stars do you see?',
        vi: 'Bạn thấy bao nhiêu ngôi sao?',
        zh: '你看到多少颗星星？',
      },
      languageMode,
    })
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetCountGame
  }, [])

  const resetCountGame = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
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
        {uiText.instruction[languageMode]}
      </p>

      <div
        style={{
          fontSize: 100,
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        {stars.join(' ')}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginTop: 30,
        }}
      >
        {answerButtons.map((num) => (
          <button
            key={num}
            disabled={disableUI}
            onClick={() => handleClick(num)}
            style={numberButton}
          >
            {num}
          </button>
        ))}
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

const numberButton = {
  fontSize: 50,
  border: 'none',
  borderRadius: 24,
  padding: '20px 30px',
  cursor: 'pointer',
  background: '#d9f4ff',
}
