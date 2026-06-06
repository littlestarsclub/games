import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  { shape: '🔺', translations: { en: 'TRIANGLE', vi: 'TAM GIÁC', zh: '三角形' } },
  { shape: '⚪', translations: { en: 'CIRCLE', vi: 'HÌNH TRÒN', zh: '圆形' } },
  { shape: '🟥', translations: { en: 'SQUARE', vi: 'HÌNH VUÔNG', zh: '正方形' } },
]

const mediumItems = [
  ...easyItems,
  { shape: '⭐', translations: { en: 'STAR', vi: 'NGÔI SAO', zh: '星形' } },
  { shape: '❤️', translations: { en: 'HEART', vi: 'TRÁI TIM', zh: '心形' } },
  { shape: '🔷', translations: { en: 'DIAMOND', vi: 'HÌNH KIM CƯƠNG', zh: '菱形' } },
]

const hardItems = [
  ...mediumItems,
  { shape: '▬', translations: { en: 'RECTANGLE', vi: 'HÌNH CHỮ NHẬT', zh: '长方形' } },
  { shape: '⬣', translations: { en: 'HEXAGON', vi: 'LỤC GIÁC', zh: '六边形' } },
  { shape: '⬟', translations: { en: 'PENTAGON', vi: 'NGŨ GIÁC', zh: '五边形' } },
]

const titles = {
  en: '🔺 Find the Shape!',
  vi: '🔺 Tìm hình!',
  zh: '🔺 找到形状！',
  'en-vi': '🔺 Find the Shape! Tìm hình!',
  'en-zh': '🔺 Find the Shape! 找到形状！',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },
  hearQuestion: {
    en: '🔊 Hear the Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear the Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear the Question / 听问题',
  },
  nextQuestion: {
    en: '➡️ Next Shape',
    vi: '➡️ Hình tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next Shape / Hình tiếp theo',
    'en-zh': '➡️ Next Shape / 下一题',
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
}

export default function ShapeGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const items =
    difficulty === 'easy'
      ? easyItems
      : difficulty === 'medium'
      ? mediumItems
      : hardItems

  const [target, setTarget] = useState(items[0])
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

    let randomItem = items[Math.floor(Math.random() * items.length)]
    while (randomItem.translations.en === target.translations.en) {
      randomItem = items[Math.floor(Math.random() * items.length)]
    }
    setTarget(randomItem)
  }

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: {
        en: `Can you find ${target.translations.en}?`,
        vi: `Bạn có thể tìm thấy ${target.translations.vi} không?`,
        zh: `你能找到${target.translations.zh}吗？`,
      },
      languageMode,
    })
  }

  const praises = {
    en: ['Amazing!', 'Wonderful!', 'Great job!', 'Awesome!', 'Yay!'],
    vi: ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (item) => {
    if (disableUI) return

    if (item.translations.en === target.translations.en) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      setStreak((prev) => prev + 1)

      const newScore = score + 1
      setScore(newScore)
      if (newScore >= 5) completeGame('shape')

      setShowCelebrate(true)

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${target.translations.en}!`,
          vi: `${randomPraise('vi')} ${target.translations.vi}!`,
          zh: `${randomPraise('zh')} ${target.translations.zh}!`,
        },
        languageMode,
      })

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
        setIsLocked(false)
      }, 3000)
    } else {
      playWrong()
      setIsLocked(true)
      setStreak(0)

      await speakLocalized({
        text: {
          en: `Try again! ${target.translations.en}`,
          vi: `Thử lại nhé! ${target.translations.vi}`,
          zh: `再试一次！${target.translations.zh}`,
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 2000)
    }
  }

  const getDisplayedQuestion = () => {
    switch (languageMode) {
      case 'en':
        return `Can you find ${target.translations.en}?`
      case 'vi':
        return `Bạn có thể tìm thấy ${target.translations.vi} không?`
      case 'zh':
        return `你能找到${target.translations.zh}吗？`
      case 'en-vi':
        return `Can you find ${target.translations.en}? — Bạn có thể tìm thấy ${target.translations.vi} không?`
      case 'en-zh':
        return `Can you find ${target.translations.en}? — 你能找到${target.translations.zh}吗？`
      default:
        return ''
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetShapeGameState
  }, [])

  const resetShapeGameState = () => {
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
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop 0.5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop 0.6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

      <p>{getDisplayedQuestion()}</p>

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
            key={item.translations.en}
            disabled={isLocked}
            onClick={() => handleClick(item)}
            style={shapeButton}
          >
            {item.shape}
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
        {uiText.nextQuestion[languageMode]}
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
