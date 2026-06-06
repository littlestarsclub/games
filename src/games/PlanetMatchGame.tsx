import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

/* -------------------------------------------------------
   20 SPACE VOCABULARY ITEMS
------------------------------------------------------- */

const spaceItems = [
  { emoji: '🌍', en: 'EARTH', vi: 'TRÁI ĐẤT', zh: '地球' },
  { emoji: '🌕', en: 'MOON', vi: 'MẶT TRĂNG', zh: '月亮' },
  { emoji: '🌞', en: 'SUN', vi: 'MẶT TRỜI', zh: '太阳' },
  { emoji: '⭐', en: 'STAR', vi: 'NGÔI SAO', zh: '星星' },
  { emoji: '🌟', en: 'SHOOTING STAR', vi: 'SAO BĂNG', zh: '流星' },
  { emoji: '🌌', en: 'GALAXY', vi: 'DẢI NGÂN HÀ', zh: '银河' },
  { emoji: '🪐', en: 'PLANET', vi: 'HÀNH TINH', zh: '行星' },
  { emoji: '🔭', en: 'TELESCOPE', vi: 'KÍNH THIÊN VĂN', zh: '望远镜' },
  { emoji: '🚀', en: 'ROCKET', vi: 'TÊN LỬA', zh: '火箭' },
  { emoji: '👩‍🚀', en: 'ASTRONAUT', vi: 'PHI HÀNH GIA', zh: '宇航员' },
  { emoji: '🛰️', en: 'SATELLITE', vi: 'VỆ TINH', zh: '卫星' },
  { emoji: '☄️', en: 'COMET', vi: 'SAO CHỔI', zh: '彗星' },
  { emoji: '🌑', en: 'NEW MOON', vi: 'TRĂNG NON', zh: '新月' },
  { emoji: '🌒', en: 'CRESCENT MOON', vi: 'TRĂNG LƯỠI LIỀM', zh: '娥眉月' },
  { emoji: '🌖', en: 'GIBBOUS MOON', vi: 'TRĂNG KHUYẾT', zh: '盈凸月' },
  { emoji: '🌙', en: 'NIGHT MOON', vi: 'TRĂNG ĐÊM', zh: '夜月' },
  { emoji: '🌠', en: 'SHOOTING STAR', vi: 'SAO BĂNG', zh: '流星' },
  { emoji: '🪐', en: 'SATURN', vi: 'SAO THỔ', zh: '土星' },
  { emoji: '🌋', en: 'VOLCANO PLANET', vi: 'HÀNH TINH NÚI LỬA', zh: '火山星' },
  { emoji: '🌫️', en: 'NEBULA', vi: 'TINH VÂN', zh: '星云' },
]

/* -------------------------------------------------------
   UI TEXT
------------------------------------------------------- */

const titles = {
  en: '🚀 Space Match Game',
  vi: '🚀 Trò chơi Ghép Chủ đề Không gian',
  zh: '🚀 太空配对游戏',
  'en-vi': '🚀 Space Match Game — Ghép Chủ đề Không gian',
  'en-zh': '🚀 Space Match Game — 太空配对游戏',
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
    en: 'Match the correct space word!',
    vi: 'Ghép đúng từ vựng không gian!',
    zh: '选择正确的太空词语！',
    'en-vi': 'Match the correct space word! / Ghép đúng từ vựng không gian!',
    'en-zh': 'Match the correct space word! / 选择正确的太空词语！',
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
    en: ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!'],
    vi: ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  },
}

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

export default function SpaceMatchGame({
  onBack,
  addStar,
  completeGame,
  resetRef,
}) {
  const { languageMode } = useLanguage()
  const { isLocked, setIsLocked, disableUI, isSpeaking } = useGameLock()

  const [questionItem, setQuestionItem] = useState(null)
  const [questionText, setQuestionText] = useState('')
  const [choices, setChoices] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  /* -----------------------------
     Generate a new round
  ----------------------------- */

  const nextRound = () => {
    if (disableUI) return

    const item = spaceItems[Math.floor(Math.random() * spaceItems.length)]
    setQuestionItem(item)

    const mode = languageMode

    let question, answer, wrongChoices

    /* -----------------------------
       SINGLE LANGUAGE MODES
       emoji → word
    ----------------------------- */

    if (mode === 'en' || mode === 'vi' || mode === 'zh') {
      question = item.emoji
      answer = item[mode]

      wrongChoices = spaceItems
        .filter((v) => v[mode] !== answer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((v) => v[mode])
    }

    /* -----------------------------
       DUAL LANGUAGE MODES
       Random direction:
       A → B or B → A
    ----------------------------- */

    if (mode === 'en-vi' || mode === 'en-zh') {
      const [langA, langB] = mode === 'en-vi' ? ['en', 'vi'] : ['en', 'zh']

      const flip = Math.random() > 0.5

      if (flip) {
        question = item[langA]
        answer = item[langB]
        wrongChoices = spaceItems
          .filter((v) => v[langB] !== answer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v[langB])
      } else {
        question = item[langB]
        answer = item[langA]
        wrongChoices = spaceItems
          .filter((v) => v[langA] !== answer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v[langA])
      }
    }

    const allChoices = [...wrongChoices, answer].sort(() => Math.random() - 0.5)

    setQuestionText(question)
    setCorrectAnswer(answer)
    setChoices(allChoices)
  }

  useEffect(() => {
    nextRound()
  }, [languageMode])

  /* -----------------------------
     Handle answer click
  ----------------------------- */

  const randomPraise = (lang) => {
    const arr = uiText.praise[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (choice) => {
    if (disableUI || isLocked) return

    if (choice === correctAnswer) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      const newScore = score + 1
      setScore(newScore)
      setStreak((prev) => prev + 1)

      if (newScore >= 5) completeGame('spacematch')

      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')}!`,
          vi: `${randomPraise('vi')}!`,
          zh: `${randomPraise('zh')}!`,
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

  /* -----------------------------
     Speak question
  ----------------------------- */

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: uiText.instruction,
      languageMode,
    })
  }

  /* -----------------------------
     Reset support
  ----------------------------- */

  useEffect(() => {
    if (resetRef) resetRef.current = resetSpaceGame
  }, [])

  const resetSpaceGame = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
    nextRound()
  }

  /* -----------------------------
     RENDER
  ----------------------------- */

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
          🚀🌟🎉
        </div>
      )}

      <p style={{ fontSize: 26, marginTop: 20 }}>
        {uiText.instruction[languageMode]}
      </p>

      <h1 style={{ fontSize: 70, marginTop: 10 }}>
        {questionText}
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
            {c}
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
        disabled={isLocked || isSpeaking}
        onClick={nextRound}
        style={{ ...nextButton, opacity: disableUI ? 0.5 : 1 }}
      >
        {uiText.next[languageMode]}
      </button>
    </>
  )
}
