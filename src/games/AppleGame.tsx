import { useEffect, useState } from 'react' 
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  {
    emoji: '🍎',
    translations: {
      en: 'APPLE',
      vi: 'TÁO',
      zh: '苹果',
    },
  },

  {
    emoji: '🍌',
    translations: {
      en: 'BANANA',
      vi: 'CHUỐI',
      zh: '香蕉',
    },
  },

  {
    emoji: '🚌',
    translations: {
      en: 'BUS',
      vi: 'XE BUÝT',
      zh: '公交车',
    },
  },
]

const mediumItems = [
  {
    emoji: '🍎',
    translations: {
      en: 'APPLE',
      vi: 'TÁO',
      zh: '苹果',
    },
  },

  {
    emoji: '🍌',
    translations: {
      en: 'BANANA',
      vi: 'CHUỐI',
      zh: '香蕉',
    },
  },

  {
    emoji: '🚌',
    translations: {
      en: 'BUS',
      vi: 'XE BUÝT',
      zh: '公交车',
    },
  },

  {
    emoji: '🍇',
    translations: {
      en: 'GRAPES',
      vi: 'NHO',
      zh: '葡萄',
    },
  },

  {
    emoji: '🍓',
    translations: {
      en: 'STRAWBERRY',
      vi: 'DÂU',
      zh: '草莓',
    },
  },
]

const hardItems = [
  {
    emoji: '🍎',
    translations: {
      en: 'APPLE',
      vi: 'TÁO',
      zh: '苹果',
    },
  },

  {
    emoji: '🍌',
    translations: {
      en: 'BANANA',
      vi: 'CHUỐI',
      zh: '香蕉',
    },
  },

  {
    emoji: '🚌',
    translations: {
      en: 'BUS',
      vi: 'XE BUÝT',
      zh: '公交车',
    },
  },

  {
    emoji: '🍇',
    translations: {
      en: 'GRAPES',
      vi: 'NHO',
      zh: '葡萄',
    },
  },

  {
    emoji: '🍓',
    translations: {
      en: 'STRAWBERRY',
      vi: 'DÂU',
      zh: '草莓',
    },
  },

  {
    emoji: '🥝',
    translations: {
      en: 'KIWI',
      vi: 'KIWI',
      zh: '猕猴桃',
    },
  },

  {
    emoji: '🥥',
    translations: {
      en: 'COCONUT',
      vi: 'DỪA',
      zh: '椰子',
    },
  },
]

const titles = {
  en: '🍎 Find the Item!',
  vi: '🍎 Tìm vật phẩm!',
  zh: '🍎 找到物品！',
  'en-vi': '🍎 Find the Item! Tìm vật phẩm!',
  'en-zh': '🍎 Find the Item! 找到物品！'
};

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回'
  },
  hearQuestion: {
    en: '🔊 Hear the Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear the Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear the Question / 听问题'
  },
  nextQuestion: {
    en: '➡️ Next Question',
    vi: '➡️ Câu tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next Question / Câu tiếp theo',
    'en-zh': '➡️ Next Question / 下一题'
  },
  score: {
    en: '⭐ Score',
    vi: '⭐ Điểm',
    zh: '⭐ 分数',
    'en-vi': '⭐ Score / Điểm',
    'en-zh': '⭐ Score / 分数'
  },
  streak: {
    en: '🔥 Streak',
    vi: '🔥 Chuỗi đúng',
    zh: '🔥 连续答对',
    'en-vi': '🔥 Streak / Chuỗi đúng',
    'en-zh': '🔥 Streak / 连续答对'
  },
  streakMessage: {
    en: '🔥 Amazing Streak!',
    vi: '🔥 Chuỗi đúng tuyệt vời!',
    zh: '🔥 惊人的连胜！',
    'en-vi': '🔥 Amazing Streak! / Chuỗi đúng tuyệt vời!',
    'en-zh': '🔥 Amazing Streak! / 惊人的连胜！'
  },
  
  streakSpeech: {
	streak2: {
		en: 'Amazing streak!',
		vi: 'Chuỗi đúng tuyệt vời!',
		zh: '惊人的连胜！'
	},
	streak4: {
		en: 'Super learner!',
		vi: 'Siêu học sinh!',
		zh: '超级学习者！'
	},
	streak9: {
		en: 'WOW! Superstar!',
		vi: 'WOW! Siêu sao!',
		zh: '哇！超级明星！'
	}
  }
}

export default function AppleGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}: {
  onBack: () => void
  addStar: () => void
  difficulty: string
  completeGame: (
    gameName: string
  ) => void
  resetRef?: React.MutableRefObject<() => void>
}) {
	
  const items =  difficulty === 'easy' ? easyItems : difficulty === 'medium' ? mediumItems : hardItems
  const [target, setTarget] = useState(items[0])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)
  const {isLocked, setIsLocked, isSpeaking, disableUI, } = useGameLock()
  const { languageMode } = useLanguage()
  
  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
  if (disableUI) return

  let randomItem =
    items[Math.floor(Math.random() * items.length)]

  while (randomItem.translations.en === target.translations.en) {
    randomItem =
      items[Math.floor(Math.random() * items.length)]
  }

  setTarget(randomItem)
}

const speakQuestion = async () => {
  if (disableUI) return
    await speakLocalized({
	  text:
	    { en: `Can you find ${target.translations.en}?`,
	      vi: `Bạn có thể tìm thấy ${target.translations.vi} không?`,
	     zh: `你能找到${target.translations.zh}吗？`
	    },
	  languageMode
    })
}

const praises = [
  'Amazing!',
  'Wonderful!',
  'Great job!',
  'Awesome!',
  'Yay!',
]
const praisesCN  =  
  [
    '太棒了！',   // Fantastic!
    '太精彩了！', // Wonderful!
    '干得好！',   // Great job!
    '厉害！',    // Awesome!
    '耶！',      // Yay!
  ]
const praisesVN = ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!']
const randomPraise = () => {return praises[ Math.floor(Math.random() * praises.length) ]}
const randomPraiseVN = () => {return praisesVN[ Math.floor(Math.random() * praises.length) ]}
const randomPraiseCN= () => {return praisesCN [ Math.floor(Math.random() * praisesCN .length) ]}
 
  const handleClick = async( item: typeof items[0]) => {
	  if (disableUI) return
    if (item.translations.en === target.translations.en) {
      playCorrect()
	  setIsLocked(true)
	  if (streak === 2) {
  speakLocalized({
    text: uiText.streakSpeech.streak2,
    languageMode
  })
}

if (streak === 4) {
  speakLocalized({
    text: uiText.streakSpeech.streak4,
    languageMode
  })
}

if (streak === 9) {
  speakLocalized({
    text: uiText.streakSpeech.streak9,
    languageMode
  })
}
	  addStar()
	  setStreak((prev) => prev + 1)
	  const newScore = score + 1
	  setScore(newScore)
	  if (newScore >= 5) { completeGame('apple')}
	  setShowCelebrate(true)
      speakLocalized({
	      text:
	      { en: `${randomPraise()} ${target.translations.en}`,
	        vi: `${randomPraiseVN()} ${target.translations.vi}`,
	        zh: `${randomPraiseCN()} ${target.translations.zh}`
	      },
	      languageMode
      })

      setTimeout(() => {   setShowCelebrate(false);   nextRound(); setIsLocked(false)}, 5000)
    } else {
      playWrong()
	  setIsLocked(true)
	  setStreak(0)
      speakLocalized({
	      text:
	      { en: `Try again! ${target.translations.en}`,
	        vi: `Thử lại nhé! ${target.translations.vi}`,
	        zh: `再试一次！${target.translations.zh}`
	      },
	      languageMode
      })

	  setTimeout(() => { setIsLocked(false)}, 3000)	   
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
  if (resetRef) {
    resetRef.current = resetAppleGameState;
  }
}, []);

const resetAppleGameState = () => {
  setScore(0);
  setStreak(0);
  setShowCelebrate(false);
  setIsLocked(false);
  nextRound();
};

  return (
    <>
	 <button
        onClick={onBack}
        style={nextButton}
      >
        {uiText.back[languageMode]}
      </button>

      <h2>{titles[languageMode]}</h2>
<h2
  style={{
    color: '#ff7b00',
    marginTop: 10,
  }}
>
  {uiText.score[languageMode]}: {score}
</h2>
<h3>
  {uiText.streak[languageMode]}: {streak}
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
    {uiText.streakMessage[languageMode]}
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
            style={gameButton}
          >
            {item.emoji}
          </button>
        ))}
      </div>

      <button
	    disabled={disableUI}
        onClick={speakQuestion}
        style={{
    ...speakButton,
    opacity: disableUI ? 0.5 : 1
  }}
      >
        {uiText.hearQuestion[languageMode]}
      </button>

      <button
	    disabled={disableUI}
        onClick={nextRound}
        style={{
    ...nextButton,
    opacity: disableUI ? 0.5 : 1
  }}
      >
        {uiText.nextQuestion[languageMode]}
	  </button>
    </>
  )
}

const gameButton = {
  fontSize: 90,
  border: 'none',
  borderRadius: 24,
  padding: 30,
  cursor: 'pointer',
  background: '#fff9d9',
}

