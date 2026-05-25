import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { speak } from './utils/speak'

import AppleGame from './games/AppleGame'
import CountGame from './games/CountGame'
import ColorGame from './games/ColorGame'
import ShapeGame from './games/ShapeGame'
import MemoryGame from './games/MemoryGame'
import AnimalGame from './games/AnimalsGame'
import AnimalSoundGame from './games/AnimalSoundGame'
import BigOrSmallGame from  './games/BigOrSmallGame'
import MatchWordGame from  './games/MatchWordGame'
import OceanMatchGame from  './games/OceanMatchGame'
import NumberRocketGame from  './games/NumberRocketGame'
import PlanetMatchGame from  './games/PlanetMatchGame'
import CrabCountGame from  './games/CrabCountGame'
import TentacleCountGame from  './games/TentacleCountGame'
import UpDownGame from  './games/UpDownGame'
import HotColdGame from  './games/HotColdGame'
import FastSlowGame from  './games/FastSlowGame'
import RunWalkGame from  './games/RunWalkGame'
import ShapeGalaxyGame from  './games/ShapeGalaxyGame'


type GameMode =
  | 'home'
  | 'apple'
  | 'count'
  | 'color'
  | 'shape'
  | 'memory'
  | 'AnimalsGame'
  | 'animalSound'
  | 'MatchWordGame'
  | 'BigOrSmallGame'
  | 'OceanMatchGame'
  | 'NumberRocketGame'
  | 'PlanetMatchGame'
  | 'CrabCountGame'
  | 'TentacleCountGame'
  | 'UpDownGame'
  | 'HotColdGame'
  | 'FastSlowGame'
  | 'RunWalkGame'
  | 'ShapeGalaxyGame'

export default function App() {
  const [gameMode, setGameMode] =
    useState<GameMode>('home')
	const [showPanel, setShowPanel] = useState(false)


  const [selectedWorld, setSelectedWorld] =
    useState<string | null>(null)

  const [currentKid, setCurrentKid] =
    useState('Emma')

  const [theme, setTheme] =
    useState('default')

  const [musicOn, setMusicOn] =
    useState(false)

  const [rewardClaimed, setRewardClaimed] =
    useState(false)

  const [totalStars, setTotalStars] =
    useState(() => {
      //const savedStars = localStorage.getItem(`little-stars-total-Emma`)
	  const savedStars = localStorage.getItem(`little-stars-total-${currentKid}` )
      return savedStars
        ? Number(savedStars)
        : 0
    })

  const musicRef = useRef(
    new Audio('music/happy.mp3')
  )

  useEffect(() => {
    const savedStars =
      localStorage.getItem(
        `little-stars-total-${currentKid}`
      )

    setTotalStars(
      savedStars
        ? Number(savedStars)
        : 0
    )
  }, [currentKid])

  useEffect(() => {
    localStorage.setItem(
      `little-stars-total-${currentKid}`,
      String(totalStars)
    )
  }, [totalStars, currentKid])

  useEffect(() => {
    musicRef.current.loop = true
  }, [])

  const toggleMusic = () => {
    if (musicOn) {
      musicRef.current.pause()
    } else {
      musicRef.current.play()
    }

    setMusicOn(!musicOn)
  }

  const addStar = () => {
    setTotalStars((prev) => {
      const newTotal = prev + 1

      if (newTotal === 10) {
        speak(
          'You unlocked Beginner!'
        )
      }

      if (newTotal === 25) {
        speak(
          'You unlocked Smart Star!'
        )
      }

      if (newTotal === 50) {
        speak(
          'You unlocked Learning Hero!'
        )
      }

      return newTotal
    })
  }

  const goHome = () => {
    setGameMode('home')
  }

  const getBadge = () => {
    if (totalStars >= 100)
      return '👑 Super Genius'

    if (totalStars >= 50)
      return '🚀 Learning Hero'

    if (totalStars >= 25)
      return '🌟 Smart Star'

    if (totalStars >= 10)
      return '⭐ Beginner'

    return '🐣 New Learner'
  }

  const getPetMood = () => {
    if (totalStars >= 100)
      return {
        emoji: '🦄',
        text: 'Super Unicorn!',
      }

    if (totalStars >= 50)
      return {
        emoji: '🐶',
        text: 'Happy Puppy!',
      }

    if (totalStars >= 25)
      return {
        emoji: '🐱',
        text: 'Playful Kitty!',
      }

    return {
      emoji: '🐣',
      text: 'Little Chick!',
    }
  }

  const pet = getPetMood()

  const claimDailyReward = () => {
    if (rewardClaimed) return

    setTotalStars((prev) => prev + 5)

    speak('Daily reward unlocked!')

    setRewardClaimed(true)
  }

  const dailyChallenges = [
    '🐶 Find 5 animals!',
    '🎨 Find 5 colors!',
    '🍎 Find 5 fruits!',
    '🚗 Find 5 vehicles!',
    '⭐ Earn 10 stars!',
  ]

  const today =
    new Date().getDate()

  const dailyChallenge =
    dailyChallenges[
      today % dailyChallenges.length
    ]

  const themes = {
    default:
      'linear-gradient(to bottom, #FFF6B7 0%, #FFD7EC 100%)',

    rainbow:
      'linear-gradient(to bottom, #ff9ff3, #feca57, #48dbfb)',

    night:
      'linear-gradient(to bottom, #2d3436, #000000)',

    cloud:
      'linear-gradient(to bottom, #dfe6e9, #ffffff)',
	  
	// NEW THEMES
  ocean: 'linear-gradient(135deg, #74b9ff, #0984e3)',
  forest: 'linear-gradient(135deg, #55efc4, #00b894)',
  candy: 'linear-gradient(135deg, #ff7675, #fab1a0)',
  galaxy: 'linear-gradient(135deg, #6c5ce7, #341f97)',
  sunshine: 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
  bubblegum: 'linear-gradient(135deg, #ff9ff3, #f368e0)',
  }

  const stickers = [
  {
    emoji: '🐶',
    stars: 10,
    name: 'Happy Puppy',
  },

  {
    emoji: '🐱',
    stars: 15,
    name: 'Cute Kitty',
  },

  {
    emoji: '🐸',
    stars: 20,
    name: 'Jumping Frog',
  },

  {
    emoji: '🦁',
    stars: 25,
    name: 'Brave Lion',
  },

  {
    emoji: '🚗',
    stars: 30,
    name: 'Speedy Car',
  },

  {
    emoji: '🚀',
    stars: 40,
    name: 'Rocket Explorer',
  },

  {
    emoji: '🦄',
    stars: 50,
    name: 'Magic Unicorn',
  },

  {
    emoji: '🐼',
    stars: 60,
    name: 'Panda Buddy',
  },

  {
    emoji: '🦋',
    stars: 70,
    name: 'Rainbow Butterfly',
  },

  {
    emoji: '🌈',
    stars: 80,
    name: 'Lucky Rainbow',
  },

  {
    emoji: '👑',
    stars: 100,
    name: 'Royal Crown',
  },

  {
    emoji: '🐙',
    stars: 120,
    name: 'Octo Friend',
  },

  {
    emoji: '🦕',
    stars: 150,
    name: 'Dino Pal',
  },

  {
    emoji: '🛸',
    stars: 175,
    name: 'Space UFO',
  },

  {
    emoji: '🏆',
    stars: 200,
    name: 'Champion Trophy',
  },
]

  const worlds = [
    {
      emoji: '🏫',
	  key: 'Classroom',
      title: 'Classroom - Lớp học',
      text: 'Learning Games',
      stars: 0,
    },

    {
      emoji: '🌳',
	  key: 'Playground',
      title: 'Playground - Sân chơi',
      text: 'Action Games',
      stars: 10,
    },

    {
      emoji: '🦁',
	  key: 'Zoo',
      title: 'Zoo - Sở thú',
      text: 'Animal Games',
      stars: 25,
    },

    {
      emoji: '🚀',
	  key: 'Space Room',
      title: 'Space Room - Phòng Vũ trụ',
      text: 'Math Games',
      stars: 50,
    },

    {
      emoji: '🌊',
	  key: 'Ocean World',
      title: 'Ocean World - Thế giới biển',
      text: 'Sea Animals',
      stars: 75,
    },
  ]

  const kids = [
    'Emma',
    'Noah',
    'Mia',
  ]

  return (
    <>
      <style>
        {`
          @keyframes pop {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }

            50% {
              transform: scale(1.2);
              opacity: 1;
            }

            100% {
              transform: scale(1);
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-20px);
            }

            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>

      <div
        style={{
          minHeight: '100vh',
          background: themes[theme],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: 20,
          fontFamily: 'Arial, sans-serif',
        }}
      >
	   {/* Floating Background */}
        <div style={floatingStar1}>⭐</div>
        <div style={floatingStar2}>☁️</div>
        <div style={floatingStar3}>🌈</div>
        <div style={floatingStar4}>✨</div>
       <div
  style={{
    background: 'white',
    borderRadius: 32,
    padding: 40,
    maxWidth: 1100,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    overflowY: 'auto',
    maxHeight: '90vh',
  }}
>
          <div style={{ fontSize: 70 }}>
            🌟
          </div>

          <h1
            style={{
              fontSize: 42,
              color: '#ff7b00',
            }}
          >
            Little Stars Club - Bé Học Vui
          </h1>

{/* TOP BAR */}
<div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
    marginBottom: 30,
    background: '#fff9db',
    padding: 20,
    borderRadius: 28,
  }}
>
  <div>
    <h2 style={{ margin: 0, color: '#ff7b00' }}>
      ⭐ {totalStars} Stars
    </h2>

    <p style={{ margin: 0, fontWeight: 'bold' }}>
      🏆 {getBadge()}
    </p>
  </div>

  <div
    style={{
      fontSize: 60,
      animation: 'float 2s ease-in-out infinite',
    }}
  >
    {pet.emoji}
  </div>

  <button
    onClick={() => setShowPanel(!showPanel)}
    style={{
      border: 'none',
      borderRadius: 20,
      padding: '12px 20px',
      cursor: 'pointer',
      background: '#74b9ff',
      color: 'white',
      fontSize: 18,
    }}
  >
    ⚙️ Rewards & Settings <br />
  Phần thưởng & Cài đặt
  </button>
</div>

{/* COLLAPSIBLE PANEL */}
{showPanel && (
  <div
    style={{
      background: '#f8f9fa',
      padding: 24,
      borderRadius: 28,
      marginBottom: 30,
      textAlign: 'left',
    }}
  >
    <h2 style={{ marginBottom: 20 }}>🌟 Quick Panel - Bảng điều khiển nhanh</h2>

    {/* DAILY REWARD */}
    <div
      style={{
        background: '#ffeaa7',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
      <h3>🎁 Daily Reward - Phần thưởng hàng ngày</h3>

      <button
        onClick={claimDailyReward}
        disabled={rewardClaimed}
        style={{
          fontSize: 50,
          border: 'none',
          background: 'transparent',
          cursor: rewardClaimed ? 'not-allowed' : 'pointer',
        }}
      >
        {rewardClaimed ? '✅' : '🎁'}
      </button>

      <p>{rewardClaimed ? 'Reward Claimed!' : 'Tap to get 5 stars!'}</p>
    </div>

    {/* LEARNING BUDDY */}
    <div
      style={{
        background: '#dff9fb',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
      <h3>🐶 Buddy - Bạn</h3>

      <div style={{ fontSize: 60 }}>{pet.emoji}</div>
      <p>{pet.text}</p>
    </div>

    {/* DAILY CHALLENGE */}
    <div
      style={{
        background: '#fff4b8',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
      <h3>🌞 Challenge - Thử thách</h3>

      <p style={{ fontSize: 20, fontWeight: 'bold' }}>
        {dailyChallenge}
      </p>
    </div>

    {/* THEMES */}
    <div
      style={{
        background: 'white',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
      <h3>🎨 Themes - Chủ đề nền</h3>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <button onClick={() => setTheme('default')}>🌟 Default</button>
        <button onClick={() => setTheme('rainbow')}>🌈 Rainbow</button>
        <button onClick={() => setTheme('night')}>🌙 Night</button>
        <button onClick={() => setTheme('cloud')}>☁️ Cloud</button>
		{/* NEW THEMES */}
		<button onClick={() => setTheme('ocean')}>🌊 Ocean</button>
		<button onClick={() => setTheme('forest')}>🌲 Forest</button>
		<button onClick={() => setTheme('candy')}>🍬 Candy</button>
		<button onClick={() => setTheme('galaxy')}>🪐 Galaxy</button>
		<button onClick={() => setTheme('sunshine')}>🌞 Sunshine</button>
		<button onClick={() => setTheme('bubblegum')}>🍭 Bubblegum</button>
	</div>
    </div>

    {/* PLAYER SELECTOR */}
    <div style={{ marginTop: 30 }}>
      <h3>👧 Choose Player - Chọn người chơi</h3>

      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {kids.map((kid) => (
          <button
            key={kid}
            onClick={() => setCurrentKid(kid)}
            style={{
              padding: '12px 20px',
              borderRadius: 18,
              border: 'none',
              cursor: 'pointer',
              background: currentKid === kid ? '#74b9ff' : '#dfe6e9',
              color: currentKid === kid ? 'white' : 'black',
              fontSize: 18,
            }}
          >
            {kid}
          </button>
        ))}
      </div>
    </div>
  </div>
)}


          {/* STICKERS */}
          <div
            style={{
              background: '#fff9db',
              padding: 24,
              borderRadius: 28,
              marginBottom: 20,
            }}
          >
            <h2>
              <div> 🧸 Sticker Collection - Sưu tập nhãn dán</div>

            </h2>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent:
                  'center',
                flexWrap: 'wrap',
                marginTop: 20,
              }}
            >
              {stickers.map(
                (sticker) => {
                  const unlocked =
                    totalStars >=
                    sticker.stars

                  return (
                    <div
                      key={
                        sticker.emoji
                      }
                      style={{
                        fontSize: 60,
						animation: unlocked
						? 'pop 0.5s ease'
						: 'none',

                        opacity:
                          unlocked
                            ? 1
                            : 0.25,

                        background:
                          'white',

                        borderRadius: 20,

                        padding: 16,

                        width: 100,
                      }}
                    >
                      <div>
                        {
                          sticker.emoji
                        }
                      </div>
						
                     <div
  style={{
    fontSize: 14,
    marginTop: 8,
  }}
>
  <div
    style={{
      fontWeight: 'bold',
      marginBottom: 4,
    }}
  >
    {sticker.name}
  </div>

  <div>
    {unlocked
      ? 'Unlocked!'
      : `${sticker.stars} ⭐`}
  </div>
</div>
                    </div>
                  )
                }
              )}
            </div>
          </div>

 <button
            onClick={toggleMusic}
            style={{
              background: '#6c5ce7',
              border: 'none',
              color: 'white',
              padding: '14px 22px',
              borderRadius: 18,
              cursor: 'pointer',
              marginBottom: 20,
              fontSize: 18,
              marginRight: 12,
            }}
          >
            {musicOn
              ? '🔊 Music ON'
              : '🔇 Music OFF'}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                `little-stars-total-${currentKid}`
              )

              setTotalStars(0)
            }}
            style={{
              background: '#ff7675',
              border: 'none',
              color: 'white',
              padding: '14px 22px',
              borderRadius: 18,
              cursor: 'pointer',
              marginBottom: 20,
              fontSize: 18,
            }}
          >
            Reset Progress
          </button>

          <p
            style={{
              color: '#666',
              fontSize: 22,
              marginBottom: 30,
            }}
          >
            Learn English & Vietnamese
            the fun way! 
          </p>
          {/* WORLD MAP */}
          {gameMode === 'home' && (
            <>
              <h2
                style={{
                  marginBottom: 20,
                  color: '#ff7b00',
                }}
              >
                🏡 Explore Worlds <br/>Khám phá các thế giới
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                  marginBottom: 40,
                }}
              >
                {worlds.map(
                  (world) => {
                    const unlocked =
                      totalStars >=
                      world.stars

                    return (
                      <button
                        key={
                          world.key
                        }
                        onClick={() => {
                          if (
                            unlocked
                          ) {
                            setSelectedWorld(
                              world.key
                            )
                          }
                        }}
                        style={{
                          background:
                            'white',

                          borderRadius: 28,

                          padding: 24,

                          border: 'none',

                          cursor:
                            unlocked
                              ? 'pointer'
                              : 'not-allowed',

                          boxShadow:
                            '0 8px 20px rgba(0,0,0,0.12)',

                          opacity:
                            unlocked
                              ? 1
                              : 0.45,

                          transition:
                            '0.2s',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 70,
                          }}
                        >
                          {
                            world.emoji
                          }
                        </div>

                        <h2>
                          {
                            world.title
                          }
                        </h2>

                        <p>
                          {world.text}
                        </p>

                        <p
                          style={{
                            marginTop: 12,
                            fontWeight:
                              'bold',
                          }}
                        >
                          {unlocked
                            ? '✅ Unlocked!'
                            : `🔒 ${world.stars} ⭐ Required`}
                        </p>
                      </button>
                    )
                  }
                )}
              </div>

              {/* BACK TO WORLDS */}
              {selectedWorld && (
                <button
                  onClick={() =>
                    setSelectedWorld(
                      null
                    )
                  }
                  style={{
                     marginBottom: 20,
					 marginTop: 35,
					 background: '#00b894',
					 border: 'none',
					 color: 'white',
					 padding: '16px 28px',
                     borderRadius: 18,
                     fontSize: 22,
                     cursor: 'pointer',
                  }}
                >
                  ⬅ Back to Worlds
                </button>
              )}

              {/* CLASSROOM */}
              {selectedWorld ===
                'Classroom' && (
                <>
                  <h2>
                    🏫 Classroom - Lớp học
                  </h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <GameCard
                      emoji="🍎"
                      title="Apple Game"
                      description="Find fruits! Tìm trái cây!"
                      onClick={() =>
                        setGameMode(
                          'apple'
                        )
                      }
                    />

                    <GameCard
                      emoji="🎨"
                      title="Color Game"
                      description="Learn colors! Học về màu sắc!"
                      onClick={() =>
                        setGameMode(
                          'color'
                        )
                      }
                    />

                    <GameCard
                      emoji="🔺"
                      title="Shape Game"
                      description="Learn shapes! Học về các hình khối!"
                      onClick={() =>
                        setGameMode(
                          'shape'
                        )
                      }
                    />
					<GameCard
                      emoji="🔤"
                      title="Word Game"
                      description="Match words! Ghép từ"
                      onClick={() =>
                        setGameMode(
                          'MatchWordGame'
                        )
                      }
                    />			
                  </div>
                </>
              )}
			  
			  {/* PLAYGROUND */}
              {selectedWorld ===
                'Playground' && (
                <>
                  <h2>
                    🌳 Playground - Sân chơi
                  </h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <GameCard
                      emoji="⬆️⬇️"
                      title="Up Down Game"
                      description="Learn directions! Học các hướng!"
                      onClick={() =>
                        setGameMode(
                          'UpDownGame'
                        )
                      }
                    />  
					 <GameCard
                      emoji="🔥"
                      title="Hot Cold Game"
                      description="Learn hot and cold! Học về nóng và lạnh!"
                      onClick={() =>
                        setGameMode(
                          'HotColdGame'
                        )
                      }
                    />  
					 <GameCard
                      emoji="⚡"
                      title="Fast Slow Game"
                      description="Learn fast and slow! Học về nhanh và chậm!"
                      onClick={() =>
                        setGameMode(
                          'FastSlowGame'
                        )
                      }
                    /> 
					 <GameCard
                      emoji="🏃"
                      title="Run Walk Game"
                      description="Learn running and walking!Học về chạy và đi bộ!"
                      onClick={() =>
                        setGameMode(
                          'RunWalkGame'
                        )
                      }
                    /> 
							
                  </div>
                </>
              )}

              {/* ZOO */}
              {selectedWorld ===
                'Zoo' && (
                <>
                  <h2>🦁 Zoo - Sở thú</h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <GameCard
                      emoji="🐶"
                      title="Animal Game"
                      description="Learn animal names! Học tên động vật!"
                      onClick={() =>
                        setGameMode(
                          'AnimalsGame'
                        )
                      }
                    />

                    <GameCard
                      emoji="🐾"
                      title="Animal Sounds"
                      description="Hear sounds! Học nghe âm thanh!"
                      onClick={() =>
                        setGameMode(
                          'animalSound'
                        )
                      }
                    />

                    <GameCard
                      emoji="🧠"
                      title="Memory Game"
                      description="Match cards! Ghép thẻ!"
                      onClick={() =>
                        setGameMode(
                          'memory'
                        )
                      }
                    />
					<GameCard
                      emoji="🐘"
                      title="Big Small Game"
                      description="Learn big and small! Học về lớn và nhỏ!"
                      onClick={() =>
                        setGameMode(
                          'BigOrSmallGame'
                        )
                      }
                    />
                  </div>
                </>
              )}

              {/* SPACE */}
              {selectedWorld ===
                'Space Room' && (
                <>
                  <h2>
                    🚀 Space Room - Phòng Vũ trụ
                  </h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 20,
                    }}
                  >
                    <GameCard
                      emoji="⭐"
                      title="Count Game"
                      description="Practice counting skills! Luyện học đếm!"
                      onClick={() =>
                        setGameMode(
                          'count'
                        )
                      }
                    />
					 <GameCard
                      emoji="🚀"
                      title="Rocket Game"
                      description="Count rockets in space! Đếm số tên lửa trong không gian!"
                      onClick={() =>
                        setGameMode(
                          'NumberRocketGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🪐"
                      title="Planet Match Game"
                      description="Match planets and words! Ghép các hành tinh và từ ngữ!"
                      onClick={() =>
                        setGameMode(
                          'PlanetMatchGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🌙"
                      title="Shape Galaxy Game"
                      description="Learn shapes in space! Học về các hình khối trong không gian!"
                      onClick={() =>
                        setGameMode(
                          'ShapeGalaxyGame'
                        )
                      }
                    />
					
                  </div>
                </>
              )}  
			   {/* Ocean World */}
              {selectedWorld ===
                'Ocean World' && (
                <>
                  <h2>🌊 Ocean World - Thế giới biển</h2>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: 20,
                    }}
                  >          
					<GameCard
                      emoji="🐠"
                      title="Ocean Match Game"
                      description="Match ocean animals! Ghép từ các loài động vật biển!"
                      onClick={() =>
                        setGameMode(
                          'OceanMatchGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🦀"
                      title="Crab Count Game"
                      description="Count the crabs! Đếm những con cua!"
                      onClick={() =>
                        setGameMode(
                          'CrabCountGame'
                        )
                      }
                    />	
					<GameCard
                      emoji="🐙"
                      title="Tentacle Count Game"
                      description="Count the octopus tentacles! Đếm các xúc tu của con bạch tuộc!"
                      onClick={() =>
                        setGameMode(
                          'TentacleCountGame'
                        )
                      }
                    />						
                  </div>
                </>
              )}
            </>
          )}

          {/* GAME SCREENS */}
          {gameMode === 'apple' && (
            <AppleGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'count' && (
            <CountGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  
		  {gameMode === 'NumberRocketGame' && (
            <NumberRocketGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
          {gameMode === 'color' && (
            <ColorGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'shape' && (
            <ShapeGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  
		  {gameMode === 'MatchWordGame' && (
            <MatchWordGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'memory' && (
            <MemoryGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'AnimalsGame' && (
            <AnimalGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode ===
            'animalSound' && (
            <AnimalSoundGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		    {gameMode ===
            'BigOrSmallGame' && (
            <BigOrSmallGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		   {gameMode ===
            'OceanMatchGame' && (
            <OceanMatchGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  {gameMode ===
            'PlanetMatchGame' && (
            <PlanetMatchGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  {gameMode ===
            'CrabCountGame' && (
            <CrabCountGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		   {gameMode ===
            'TentacleCountGame' && (
            <TentacleCountGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		   {gameMode ===
            'UpDownGame' && (
            <UpDownGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		   {gameMode ===
            'HotColdGame' && (
            <HotColdGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  {gameMode ===
            'FastSlowGame' && (
            <FastSlowGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  {gameMode ===
            'RunWalkGame' && (
            <RunWalkGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  {gameMode ===
            'ShapeGalaxyGame' && (
            <ShapeGalaxyGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		   <div
            style={{
              marginTop: 40,
              fontSize: 18,
              color: '#777',
            }}
          >
            Little Stars Club | Bé Học Vui 🌟
          </div>
		  <div
  style={{
    marginTop: 16,
  }}
>
  <a
    href="https://facebook.com/littlestarsclub"
    target="_blank"
    rel="noreferrer"
    style={{
      display: 'inline-block',
      background: '#1877f2',
      color: 'white',
      padding: '12px 20px',
      borderRadius: 20,
      textDecoration: 'none',
      fontWeight: 'bold',
    }}
  >
    📘 Follow Us on Facebook
  </a>
</div>
        </div>
      </div>
    </>
  )
}

function GameCard({
  emoji,
  title,
  description,
  onClick,
}: {
  emoji: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        borderRadius: 28,
        padding: 24,
        background: 'white',
        boxShadow:
          '0 8px 20px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        transition: '0.2s',
      }}
    >
      <div style={{ fontSize: 70 }}>
        {emoji}
      </div>

      <h2>{title}</h2>

      <p>{description}</p>
    </button>
  )
}

const floatingStar1 = {
  position: 'absolute' as const,
  top: '10%',
  left: '8%',
  fontSize: 50,
  animation: 'float 6s ease-in-out infinite',
}

const floatingStar2 = {
  position: 'absolute' as const,
  top: '20%',
  right: '10%',
  fontSize: 70,
  animation: 'float 8s ease-in-out infinite',
}

const floatingStar3 = {
  position: 'absolute' as const,
  bottom: '15%',
  left: '12%',
  fontSize: 60,
  animation: 'float 7s ease-in-out infinite',
}

const floatingStar4 = {
  position: 'absolute' as const,
  bottom: '12%',
  right: '8%',
  fontSize: 45,
  animation: 'float 5s ease-in-out infinite',
}