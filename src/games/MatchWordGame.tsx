import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

/* -------------------------------------------------------
   VOCABULARY SET (30 ITEMS)
------------------------------------------------------- */

const vocab = [
  // Animals
  { emoji: '🐶', en: 'DOG', vi: 'CHÓ', zh: '狗' },
  { emoji: '🐱', en: 'CAT', vi: 'MÈO', zh: '猫' },
  { emoji: '🐭', en: 'MOUSE', vi: 'CHUỘT', zh: '老鼠' },
  { emoji: '🐰', en: 'RABBIT', vi: 'THỎ', zh: '兔子' },
  { emoji: '🐻', en: 'BEAR', vi: 'GẤU', zh: '熊' },
  { emoji: '🦁', en: 'LION', vi: 'SƯ TỬ', zh: '狮子' },
  { emoji: '🐯', en: 'TIGER', vi: 'HỔ', zh: '老虎' },
  { emoji: '🐵', en: 'MONKEY', vi: 'KHỈ', zh: '猴子' },
  { emoji: '🐼', en: 'PANDA', vi: 'GẤU TRÚC', zh: '熊猫' },
  { emoji: '🐸', en: 'FROG', vi: 'ẾCH', zh: '青蛙' },

  // Fruits
  { emoji: '🍎', en: 'APPLE', vi: 'TÁO', zh: '苹果' },
  { emoji: '🍌', en: 'BANANA', vi: 'CHUỐI', zh: '香蕉' },
  { emoji: '🍇', en: 'GRAPES', vi: 'NHO', zh: '葡萄' },
  { emoji: '🍉', en: 'WATERMELON', vi: 'DƯA HẤU', zh: '西瓜' },
  { emoji: '🍓', en: 'STRAWBERRY', vi: 'DÂU', zh: '草莓' },
  { emoji: '🍍', en: 'PINEAPPLE', vi: 'DỨA', zh: '菠萝' },
  { emoji: '🍒', en: 'CHERRY', vi: 'ANH ĐÀO', zh: '樱桃' },
  { emoji: '🍑', en: 'PEACH', vi: 'ĐÀO', zh: '桃子' },
  { emoji: '🥝', en: 'KIWI', vi: 'KIWI', zh: '猕猴桃' },
  { emoji: '🍐', en: 'PEAR', vi: 'LÊ', zh: '梨' },

  // Objects
  { emoji: '🚗', en: 'CAR', vi: 'XE HƠI', zh: '汽车' },
  { emoji: '🚲', en: 'BICYCLE', vi: 'XE ĐẠP', zh: '自行车' },
  { emoji: '🎈', en: 'BALLOON', vi: 'BÓNG BAY', zh: '气球' },
  { emoji: '📚', en: 'BOOK', vi: 'SÁCH', zh: '书' },
  { emoji: '⭐', en: 'STAR', vi: 'NGÔI SAO', zh: '星星' },
  { emoji: '🧸', en: 'TEDDY BEAR', vi: 'GẤU BÔNG', zh: '泰迪熊' },
  { emoji: '🎁', en: 'GIFT', vi: 'QUÀ', zh: '礼物' },
  { emoji: '🕶️', en: 'SUNGLASSES', vi: 'KÍNH RÂM', zh: '太阳镜' },
  { emoji: '⏰', en: 'CLOCK', vi: 'ĐỒNG HỒ', zh: '时钟' },
  { emoji: '🎨', en: 'PAINT', vi: 'SƠN', zh: '颜料' },
]

/* -------------------------------------------------------
   UI TEXT
------------------------------------------------------- */

const titles = {
  en: '🎯 Match Game',
  vi: '🎯 Trò chơi Ghép từ',
  zh: '🎯 配对游戏',
  'en-vi': '🎯 Match Game — Trò chơi Ghép từ',
  'en-zh': '🎯 Match Game — 配对游戏',
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
    en: 'Match the correct word!',
    vi: 'Ghép từ đúng!',
    zh: '选择正确的词语！',
    'en-vi': 'Match the correct word! / Ghép từ đúng!',
    'en-zh': 'Match the correct word! / 选择正确的词语！',
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
   MATCH GAME COMPONENT
------------------------------------------------------- */

export default function MatchGame({
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

    const item = vocab[Math.floor(Math.random() * vocab.length)]
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

      wrongChoices = vocab
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
        // Show A → choose B
        question = item[langA]
        answer = item[langB]
        wrongChoices = vocab
          .filter((v) => v[langB] !== answer)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((v) => v[langB])
      } else {
        // Show B → choose A
        question = item[langB]
        answer = item[langA]
        wrongChoices = vocab
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

      if (newScore >= 5) completeGame('match')

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
    if (resetRef) resetRef.current = resetMatchGame
  }, [])

  const resetMatchGame = () => {
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
          🎉⭐🎉
        </div>
      )}

      <p style={{ fontSize: 26, marginTop: 20 }}>
        {uiText.instruction[languageMode]}
      </p>

      <h1 style={{ fontSize: 60, marginTop: 10 }}>
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
