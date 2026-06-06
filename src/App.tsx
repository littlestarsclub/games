import { useEffect,  useRef, useState,} from 'react'
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
import WeathermatchGame from  './games/WeathermatchGame'
import BalloonPopNumberGame from './games/BalloonPopNumberGame'
import { useLanguage } from './context/LanguageContext'
import { speakLocalized } from './utils/speakLocalized'

const uiText = {
 /* appTitle: {
    en: 'Little Stars Club',
	vi: 'Bé Học Vui',
    zh: '小星星俱乐部',
    'en-vi': 'Little Stars Club - Câu lạc bộ Ngôi Sao Nhỏ',
    'en-zh': 'Little Stars Club - 小星星俱乐部'
  },*/
  
  appTitle: {
    en: 'Little Stars Club <br/>Bé Học Vui |小星星俱乐部',
	vi: 'Little Stars Club <br/>Bé Học Vui |小星星俱乐部',
    zh: 'Little Stars Club <br/>Bé Học Vui |小星星俱乐部',
	'en-vi': 'Little Stars Club <br/>Bé Học Vui |小星星俱乐部',
    'en-zh': 'Little Stars Club <br/>Bé Học Vui |小星星俱乐部',
  },

  settings: {
    en: 'Rewards & Settings',
    vi: 'Phần thưởng & Cài đặt',
    zh: '奖励和设置',
    'en-vi': 'Rewards & Settings / Phần thưởng & Cài đặt',
    'en-zh': 'Rewards & Settings / 奖励和设置'
  },

  quickPanel: {
    en: '🌟 Quick Panel',
    vi: '🌟 Bảng điều khiển nhanh',
    zh: '🌟 快速面板',
    'en-vi': '🌟 Quick Panel / Bảng điều khiển nhanh',
    'en-zh': '🌟 Quick Panel / 快速面板'
  },

  dailyReward: {
    en: '🎁 Daily Reward',
    vi: '🎁 Phần thưởng hàng ngày',
    zh: '🎁 每日奖励',
    'en-vi': '🎁 Daily Reward / Phần thưởng hàng ngày',
    'en-zh': '🎁 Daily Reward / 每日奖励'
  },

  rewardClaimed: {
    en: 'Reward Claimed!',
    vi: 'Đã nhận thưởng!',
    zh: '奖励已领取！',
    'en-vi': 'Reward Claimed! / Đã nhận thưởng!',
    'en-zh': 'Reward Claimed! / 奖励已领取！'
  },

  rewardTap: {
    en: 'Tap to get 5 stars!',
    vi: 'Chạm để nhận 5 sao!',
    zh: '点击领取 5 颗星！',
    'en-vi': 'Tap to get 5 stars! / Chạm để nhận 5 sao!',
    'en-zh': 'Tap to get 5 stars! / 点击领取 5 颗星！'
  },

  buddy: {
    en: '🐶 Buddy',
    vi: '🐶 Bạn đồng hành',
    zh: '🐶 小伙伴',
    'en-vi': '🐶 Buddy / Bạn đồng hành',
    'en-zh': '🐶 Buddy / 小伙伴'
  },

  challenge: {
    en: '🌞 Challenge',
    vi: '🌞 Thử thách',
    zh: '🌞 挑战',
    'en-vi': '🌞 Challenge / Thử thách',
    'en-zh': '🌞 Challenge / 挑战'
  },

  difficulty: {
    en: '🎯 Difficulty',
    vi: '🎯 Độ khó',
    zh: '🎯 难度',
    'en-vi': '🎯 Difficulty / Độ khó',
    'en-zh': '🎯 Difficulty / 难度'
  },

  easy: {
    en: 'Easy',
    vi: 'Dễ',
    zh: '简单',
    'en-vi': 'Easy / Dễ',
    'en-zh': 'Easy / 简单'
  },

  medium: {
    en: 'Medium',
    vi: 'Trung bình',
    zh: '中等',
    'en-vi': 'Medium / Trung bình',
    'en-zh': 'Medium / 中等'
  },

  hard: {
    en: 'Hard',
    vi: 'Khó',
    zh: '困难',
    'en-vi': 'Hard / Khó',
    'en-zh': 'Hard / 困难'
  },

  themes: {
    en: '🎨 Themes',
    vi: '🎨 Chủ đề nền',
    zh: '🎨 主题',
    'en-vi': '🎨 Themes / Chủ đề nền',
    'en-zh': '🎨 Themes / 主题'
  },

  choosePlayer: {
    en: '👧 Choose Player',
    vi: '👧 Chọn người chơi',
    zh: '👧 选择玩家',
    'en-vi': '👧 Choose Player / Chọn người chơi',
    'en-zh': '👧 Choose Player / 选择玩家'
  },
  
  stickersTitle: {
    en: '🧸 Sticker Collection',
    vi: '🧸 Sưu tập nhãn dán',
    zh: '🧸 贴纸收藏',
    'en-vi': '🧸 Sticker Collection / Sưu tập nhãn dán',
    'en-zh': '🧸 Sticker Collection / 贴纸收藏'
  },

  unlocked: {
    en: 'Unlocked!',
    vi: 'Đã mở khóa!',
    zh: '已解锁！',
    'en-vi': 'Unlocked! / Đã mở khóa!',
    'en-zh': 'Unlocked! / 已解锁！'
  },

  musicOn: {
    en: '🔊 Music ON',
    vi: '🔊 Âm nhạc BẬT',
    zh: '🔊 音乐开启',
    'en-vi': '🔊 Music ON / Âm nhạc BẬT',
    'en-zh': '🔊 Music ON / 音乐开启'
  },

  musicOff: {
    en: '🔇 Music OFF',
    vi: '🔇 Âm nhạc TẮT',
    zh: '🔇 音乐关闭',
    'en-vi': '🔇 Music OFF / Âm nhạc TẮT',
    'en-zh': '🔇 Music OFF / 音乐关闭'
  },

  resetProgress: {
    en: 'Reset Progress',
    vi: 'Đặt lại tiến trình',
    zh: '重置进度',
    'en-vi': 'Reset Progress / Đặt lại tiến trình',
    'en-zh': 'Reset Progress / 重置进度'
  },

  footerText: {
    en: 'Learn English & Vietnamese the fun way!',
    vi: 'Học tiếng Anh & tiếng Việt thật vui!',
    zh: '用有趣的方式学习英语和越南语！',
    'en-vi': 'Learn English & Vietnamese the fun way! / Học tiếng Anh & tiếng Việt thật vui!',
    'en-zh': 'Learn English & Vietnamese the fun way! / 用有趣的方式学习英语和越南语！'
  },

  exploreWorlds: {
    en: '🏡 Explore Worlds',
    vi: '🏡 Khám phá các thế giới',
    zh: '🏡 探索世界',
    'en-vi': '🏡 Explore Worlds / Khám phá các thế giới',
    'en-zh': '🏡 Explore Worlds / 探索世界'
  },

  worldUnlocked: {
    en: '✅ Unlocked!',
    vi: '✅ Đã mở khóa!',
    zh: '✅ 已解锁！',
    'en-vi': '✅ Unlocked! / Đã mở khóa!',
    'en-zh': '✅ Unlocked! / 已解锁！'
  },

  worldLocked: {
    en: stars => `🔒 ${stars} ⭐ Required`,
    vi: stars => `🔒 Cần ${stars} ⭐`,
    zh: stars => `🔒 需要 ${stars} ⭐`,
    'en-vi': stars => `🔒 ${stars} ⭐ Required / Cần ${stars} ⭐`,
    'en-zh': stars => `🔒 ${stars} ⭐ Required / 需要 ${stars} ⭐`
  },
  
  backToWorlds: {
    en: '⬅ Back to Worlds',
    vi: '⬅ Quay lại Thế giới',
    zh: '⬅ 返回世界',
    'en-vi': '⬅ Back to Worlds / Quay lại Thế giới',
    'en-zh': '⬅ Back to Worlds / 返回世界'
  },

  classroomTitle: {
    en: '🏫 Classroom',
    vi: '🏫 Lớp học',
    zh: '🏫 教室',
    'en-vi': '🏫 Classroom / Lớp học',
    'en-zh': '🏫 Classroom / 教室'
  },

  playgroundTitle: {
    en: '🌳 Playground',
    vi: '🌳 Sân chơi',
    zh: '🌳 游乐场',
    'en-vi': '🌳 Playground / Sân chơi',
    'en-zh': '🌳 Playground / 游乐场'
  },
  
  zooTitle: {
    en: '🦁 Zoo',
    vi: '🦁 Sở thú',
    zh: '🦁 动物园',
    'en-vi': '🦁 Zoo / Sở thú',
    'en-zh': '🦁 Zoo / 动物园'
  },

  spaceTitle: {
    en: '🚀 Space Room',
    vi: '🚀 Phòng Vũ trụ',
    zh: '🚀 太空房间',
    'en-vi': '🚀 Space Room / Phòng Vũ trụ',
    'en-zh': '🚀 Space Room / 太空房间'
  },

  oceanTitle: {
    en: '🌊 Ocean World',
    vi: '🌊 Thế giới biển',
    zh: '🌊 海洋世界',
    'en-vi': '🌊 Ocean World / Thế giới biển',
    'en-zh': '🌊 Ocean World / 海洋世界'
  },

  gameTitles: {
	  
    apple: {
      en: 'Apple Game',
      vi: 'Trò chơi Táo',
      zh: '苹果游戏',
      'en-vi': 'Apple Game / Trò chơi Táo',
      'en-zh': 'Apple Game / 苹果游戏'
    },
	
    color: {
      en: 'Color Game',
      vi: 'Trò chơi Màu sắc',
      zh: '颜色游戏',
      'en-vi': 'Color Game / Trò chơi Màu sắc',
      'en-zh': 'Color Game / 颜色游戏'
    },
	
    shape: {
      en: 'Shape Game',
      vi: 'Trò chơi Hình khối',
      zh: '形状游戏',
      'en-vi': 'Shape Game / Trò chơi Hình khối',
      'en-zh': 'Shape Game / 形状游戏'
    },
	
    word: {
      en: 'Word Game',
      vi: 'Trò chơi Từ vựng',
      zh: '单词游戏',
      'en-vi': 'Word Game / Trò chơi Từ vựng',
      'en-zh': 'Word Game / 单词游戏'
    },
	
    balloon: {
      en: 'Balloon Pop',
      vi: 'Bong bóng nổ',
      zh: '气球爆破',
      'en-vi': 'Balloon Pop / Bong bóng nổ',
      'en-zh': 'Balloon Pop / 气球爆破'
    },
	
    updown: {
      en: 'Up Down Game',
      vi: 'Trò chơi Lên Xuống',
      zh: '上下游戏',
      'en-vi': 'Up Down Game / Trò chơi Lên Xuống',
      'en-zh': 'Up Down Game / 上下游戏'
    },
	
    hotcold: {
      en: 'Hot Cold Game',
      vi: 'Trò chơi Nóng Lạnh',
      zh: '冷热游戏',
      'en-vi': 'Hot Cold Game / Trò chơi Nóng Lạnh',
      'en-zh': 'Hot Cold Game / 冷热游戏'
    },
	
    fastslow: {
      en: 'Fast Slow Game',
      vi: 'Trò chơi Nhanh Chậm',
      zh: '快慢游戏',
      'en-vi': 'Fast Slow Game / Trò chơi Nhanh Chậm',
      'en-zh': 'Fast Slow Game / 快慢游戏'
    },
	
    runwalk: {
      en: 'Run Walk Game',
      vi: 'Trò chơi Chạy Đi bộ',
      zh: '跑步走路游戏',
      'en-vi': 'Run Walk Game / Trò chơi Chạy Đi bộ',
      'en-zh': 'Run Walk Game / 跑步走路游戏'
    },
	
	 animal: {
      en: 'Animal Game',
      vi: 'Trò chơi Động vật',
      zh: '动物游戏',
      'en-vi': 'Animal Game / Trò chơi Động vật',
      'en-zh': 'Animal Game / 动物游戏'
    },
	
    animalSounds: {
      en: 'Animal Sounds',
      vi: 'Âm thanh động vật',
      zh: '动物声音',
      'en-vi': 'Animal Sounds / Âm thanh động vật',
      'en-zh': 'Animal Sounds / 动物声音'
    },
	
    memory: {
      en: 'Memory Game',
      vi: 'Trò chơi Ghi nhớ',
      zh: '记忆游戏',
      'en-vi': 'Memory Game / Trò chơi Ghi nhớ',
      'en-zh': 'Memory Game / 记忆游戏'
    },
	
    bigSmall: {
      en: 'Big Small Game',
      vi: 'Trò chơi Lớn Nhỏ',
      zh: '大小游戏',
      'en-vi': 'Big Small Game / Trò chơi Lớn Nhỏ',
      'en-zh': 'Big Small Game / 大小游戏'
    },

    count: {
      en: 'Count Game',
      vi: 'Trò chơi Đếm số',
      zh: '数数游戏',
      'en-vi': 'Count Game / Trò chơi Đếm số',
      'en-zh': 'Count Game / 数数游戏'
    },
	
    rocket: {
      en: 'Rocket Game',
      vi: 'Trò chơi Tên lửa',
      zh: '火箭游戏',
      'en-vi': 'Rocket Game / Trò chơi Tên lửa',
      'en-zh': 'Rocket Game / 火箭游戏'
    },
	
    planetMatch: {
      en: 'Space Match Game',
      vi: 'Trò chơi Ghép Hành tinh',
      zh: '行星配对游戏',
      'en-vi': 'Space Match Game / Trò chơi Ghép Hành tinh',
      'en-zh': 'Space Match Game / 行星配对游戏'
    },
	
    shapeGalaxy: {
      en: 'Shape Galaxy Game',
      vi: 'Trò chơi Hình khối Vũ trụ',
      zh: '太空形状游戏',
      'en-vi': 'Shape Galaxy Game / Trò chơi Hình khối Vũ trụ',
      'en-zh': 'Shape Galaxy Game / 太空形状游戏'
    },

    oceanMatch: {
      en: 'Ocean Match Game',
      vi: 'Trò chơi Ghép Động vật biển',
      zh: '海洋配对游戏',
      'en-vi': 'Ocean Match Game / Ghép Động vật biển',
      'en-zh': 'Ocean Match Game / 海洋配对游戏'
    },
	
    crabCount: {
      en: 'Crab Count Game',
      vi: 'Trò chơi Đếm Cua',
      zh: '螃蟹计数游戏',
      'en-vi': 'Crab Count Game / Trò chơi Đếm Cua',
      'en-zh': 'Crab Count Game / 螃蟹计数游戏'
    },
	
    tentacleCount: {
      en: 'Tentacle Count Game',
      vi: 'Trò chơi Đếm Xúc tu',
      zh: '触手计数游戏',
      'en-vi': 'Tentacle Count Game / Trò chơi Đếm Xúc tu',
      'en-zh': 'Tentacle Count Game / 触手计数游戏'
    },
	
	weathermatch: {
	 en: 'Weather Match Game',
     vi: 'Trò chơi Ghép Thời tiết',
     zh: '天气配对游戏',
     'en-vi': 'Weather Match Game / Trò chơi Ghép Thời tiết',
     'en-zh': 'Weather Match Game / 天气配对游戏'
    },

  },

  gameDescriptions: {
	  
    apple: {
      en: 'Find fruits!',
      vi: 'Tìm trái cây!',
      zh: '找水果！',
      'en-vi': 'Find fruits! / Tìm trái cây!',
      'en-zh': 'Find fruits! / 找水果！'
    },
	
    color: {
      en: 'Learn colors!',
      vi: 'Học về màu sắc!',
      zh: '学习颜色！',
      'en-vi': 'Learn colors! / Học về màu sắc!',
      'en-zh': 'Learn colors! / 学习颜色！'
    },
	
    shape: {
      en: 'Learn shapes!',
      vi: 'Học về các hình khối!',
      zh: '学习形状！',
      'en-vi': 'Learn shapes! / Học về các hình khối!',
      'en-zh': 'Learn shapes! / 学习形状！'
    },
	
    word: {
      en: 'Match words!',
      vi: 'Ghép từ!',
      zh: '配对单词！',
      'en-vi': 'Match words! / Ghép từ!',
      'en-zh': 'Match words! / 配对单词！'
    },
	
    balloon: {
      en: 'Learn numbers!',
      vi: 'Học số!',
      zh: '学习数字！',
      'en-vi': 'Learn numbers! / Học số!',
      'en-zh': 'Learn numbers! / 学习数字！'
    },
	
    updown: {
      en: 'Learn directions!',
      vi: 'Học các hướng!',
      zh: '学习方向！',
      'en-vi': 'Learn directions! / Học các hướng!',
      'en-zh': 'Learn directions! / 学习方向！'
    },
	
    hotcold: {
      en: 'Learn hot and cold!',
      vi: 'Học về nóng và lạnh!',
      zh: '学习冷热！',
      'en-vi': 'Learn hot and cold! / Học về nóng và lạnh!',
      'en-zh': 'Learn hot and cold! / 学习冷热！'
    },
	
    fastslow: {
      en: 'Learn fast and slow!',
      vi: 'Học về nhanh và chậm!',
      zh: '学习快慢！',
      'en-vi': 'Learn fast and slow! / Học về nhanh và chậm!',
      'en-zh': 'Learn fast and slow! / 学习快慢！'
    },
	
    runwalk: {
      en: 'Learn running and walking!',
      vi: 'Học về chạy và đi bộ!',
      zh: '学习跑步和走路！',
      'en-vi': 'Learn running and walking! / Học về chạy và đi bộ!',
      'en-zh': 'Learn running and walking! / 学习跑步和走路！'
    },
	
	animal: {
      en: 'Learn animal names!',
      vi: 'Học tên động vật!',
      zh: '学习动物名称！',
      'en-vi': 'Learn animal names! / Học tên động vật!',
      'en-zh': 'Learn animal names! / 学习动物名称！'
    },
	
    animalSounds: {
      en: 'Hear sounds!',
      vi: 'Học nghe âm thanh!',
      zh: '听动物声音！',
      'en-vi': 'Hear sounds! / Học nghe âm thanh!',
      'en-zh': 'Hear sounds! / 听动物声音！'
    },
	
    memory: {
      en: 'Match cards!',
      vi: 'Ghép thẻ!',
      zh: '配对卡片！',
      'en-vi': 'Match cards! / Ghép thẻ!',
      'en-zh': 'Match cards! / 配对卡片！'
    },
	
    bigSmall: {
      en: 'Learn big and small!',
      vi: 'Học về lớn và nhỏ!',
      zh: '学习大小！',
      'en-vi': 'Learn big and small! / Học về lớn và nhỏ!',
      'en-zh': 'Learn big and small! / 学习大小！'
    },

    count: {
      en: 'Practice counting skills!',
      vi: 'Luyện học đếm!',
      zh: '练习数数！',
      'en-vi': 'Practice counting skills! / Luyện học đếm!',
      'en-zh': 'Practice counting skills! / 练习数数！'
    },
	
    rocket: {
      en: 'Count rockets in space!',
      vi: 'Đếm số tên lửa trong không gian!',
      zh: '数太空火箭！',
      'en-vi': 'Count rockets in space! / Đếm số tên lửa trong không gian!',
      'en-zh': 'Count rockets in space! / 数太空火箭！'
    },
	
    planetMatch: {
      en: 'Match planets and words!',
      vi: 'Ghép các hành tinh và từ ngữ!',
      zh: '配对行星和单词！',
      'en-vi': 'Match planets and words! / Ghép các hành tinh và từ ngữ!',
      'en-zh': 'Match planets and words! / 配对行星和单词！'
    },
	
    shapeGalaxy: {
      en: 'Learn shapes in space!',
      vi: 'Học về các hình khối trong không gian!',
      zh: '学习太空中的形状！',
      'en-vi': 'Learn shapes in space! / Học về các hình khối trong không gian!',
      'en-zh': 'Learn shapes in space! / 学习太空中的形状！'
    },

    oceanMatch: {
      en: 'Match ocean animals!',
      vi: 'Ghép các loài động vật biển!',
      zh: '配对海洋动物！',
      'en-vi': 'Match ocean animals! / Ghép các loài động vật biển!',
      'en-zh': 'Match ocean animals! / 配对海洋动物！'
    },
	
    crabCount: {
      en: 'Count the crabs!',
      vi: 'Đếm những con cua!',
      zh: '数螃蟹！',
      'en-vi': 'Count the crabs! / Đếm những con cua!',
      'en-zh': 'Count the crabs! / 数螃蟹！'
    },
	
    tentacleCount: {
      en: 'Count the octopus tentacles!',
      vi: 'Đếm các xúc tu của con bạch tuộc!',
      zh: '数章鱼触手！',
      'en-vi': 'Count the octopus tentacles! / Đếm các xúc tu của con bạch tuộc!',
      'en-zh': 'Count the octopus tentacles! / 数章鱼触手！'
    },
	weathermatch: {
	 en: 'Match the weather symbols with the correct words!',
     vi: 'Ghép biểu tượng thời tiết với từ đúng!',
     zh: '将天气图标与正确的词语配对！',
     'en-vi': 'Match the weather symbols with the correct words! / Ghép biểu tượng thời tiết với từ đúng!',
     'en-zh': 'Match the weather symbols with the correct words! / 将天气图标与正确的词语配对！'
    },
  }, 
  
  // ⭐ Badge names
  badges: {
	  
    superGenius: {
      en: '👑 Super Genius',
      vi: '👑 Thiên tài',
      zh: '👑 超级天才',
      'en-vi': '👑 Super Genius / Thiên tài',
      'en-zh': '👑 Super Genius / 超级天才'
    },
	
    learningHero: {
      en: '🚀 Learning Hero',
      vi: '🚀 Anh hùng học tập',
      zh: '🚀 学习英雄',
      'en-vi': '🚀 Learning Hero / Anh hùng học tập',
      'en-zh': '🚀 Learning Hero / 学习英雄'
    },
	
    smartStar: {
      en: '🌟 Smart Star',
      vi: '🌟 Ngôi sao thông minh',
      zh: '🌟 聪明之星',
      'en-vi': '🌟 Smart Star / Ngôi sao thông minh',
      'en-zh': '🌟 Smart Star / 聪明之星'
    },
	
    beginner: {
      en: '⭐ Beginner',
      vi: '⭐ Người mới',
      zh: '⭐ 初学者',
      'en-vi': '⭐ Beginner / Người mới',
      'en-zh': '⭐ Beginner / 初学者'
    },
	
    newLearner: {
      en: '🐣 New Learner',
      vi: '🐣 Người học mới',
      zh: '🐣 新学习者',
      'en-vi': '🐣 New Learner / Người học mới',
      'en-zh': '🐣 New Learner / 新学习者'
    }
  },

  // ⭐ Pet moods
  petMood: {
	  
    unicorn: {
      en: 'Super Unicorn!',
      vi: 'Kỳ lân siêu cấp!',
      zh: '超级独角兽！',
      'en-vi': 'Super Unicorn! / Kỳ lân siêu cấp!',
      'en-zh': 'Super Unicorn! / 超级独角兽！'
    },
	
    puppy: {
      en: 'Happy Puppy!',
      vi: 'Chú cún vui vẻ!',
      zh: '快乐小狗！',
      'en-vi': 'Happy Puppy! / Chú cún vui vẻ!',
      'en-zh': 'Happy Puppy! / 快乐小狗！'
    },
	
    kitty: {
      en: 'Playful Kitty!',
      vi: 'Mèo con tinh nghịch!',
      zh: '调皮小猫！',
      'en-vi': 'Playful Kitty! / Mèo con tinh nghịch!',
      'en-zh': 'Playful Kitty! / 调皮小猫！'
    },
	
    chick: {
      en: 'Little Chick!',
      vi: 'Gà con dễ thương!',
      zh: '小鸡宝宝！',
      'en-vi': 'Little Chick! / Gà con dễ thương!',
      'en-zh': 'Little Chick! / 小鸡宝宝！'
    }
  },

  // ⭐ Daily reward speech
  dailyRewardSpeech: {
    en: 'Daily reward unlocked!',
    vi: 'Đã mở khóa phần thưởng hàng ngày!',
    zh: '每日奖励已解锁！',
    'en-vi': 'Daily reward unlocked! / Đã mở khóa phần thưởng hàng ngày!',
    'en-zh': 'Daily reward unlocked! / 每日奖励已解锁！'
  },

  // ⭐ Daily challenges
  dailyChallenges: {
	  
    animals: {
      en: '🐶 Find 5 animals!',
      vi: '🐶 Tìm 5 con vật!',
      zh: '🐶 找到 5 只动物！',
      'en-vi': '🐶 Find 5 animals! / Tìm 5 con vật!',
      'en-zh': '🐶 Find 5 animals! / 找到 5 只动物！'
    },
	
    colors: {
      en: '🎨 Find 5 colors!',
      vi: '🎨 Tìm 5 màu sắc!',
      zh: '🎨 找到 5 种颜色！',
      'en-vi': '🎨 Find 5 colors! / Tìm 5 màu sắc!',
      'en-zh': '🎨 Find 5 colors! / 找到 5 种颜色！'
    },
	
    fruits: {
      en: '🍎 Find 5 fruits!',
      vi: '🍎 Tìm 5 loại trái cây!',
      zh: '🍎 找到 5 种水果！',
      'en-vi': '🍎 Find 5 fruits! / Tìm 5 loại trái cây!',
      'en-zh': '🍎 Find 5 fruits! / 找到 5 种水果！'
    },
	
    vehicles: {
      en: '🚗 Find 5 vehicles!',
      vi: '🚗 Tìm 5 phương tiện!',
      zh: '🚗 找到 5 种交通工具！',
      'en-vi': '🚗 Find 5 vehicles! / Tìm 5 phương tiện!',
      'en-zh': '🚗 Find 5 vehicles! / 找到 5 种交通工具！'
    },
	
    stars: {
      en: '⭐ Earn 10 stars!',
      vi: '⭐ Kiếm 10 sao!',
      zh: '⭐ 获得 10 颗星！',
      'en-vi': '⭐ Earn 10 stars! / Kiếm 10 sao!',
      'en-zh': '⭐ Earn 10 stars! / 获得 10 颗星！'
    },
  },
  
  worldDescriptions: {
	  
	classroom: {
		en: 'Learning Games',
		vi: 'Trò chơi học tập',
		zh: '学习游戏',
		'en-vi': 'Learning Games / Trò chơi học tập',
		'en-zh': 'Learning Games / 学习游戏'
	},
	
	playground: {
		en: 'Action Games',
		vi: 'Trò chơi vận động',
		zh: '动作游戏',
		'en-vi': 'Action Games / Trò chơi vận động',
		'en-zh': 'Action Games / 动作游戏'
	},
	
	zoo: {
		en: 'Animal Games',
		vi: 'Trò chơi động vật',
		zh: '动物游戏',
		'en-vi': 'Animal Games / Trò chơi động vật',
		'en-zh': 'Animal Games / 动物游戏'
	},
	
	space: {
		en: 'Math Games',
		vi: 'Trò chơi toán học',
		zh: '数学游戏',
		'en-vi': 'Math Games / Trò chơi toán học',
		'en-zh': 'Math Games / 数学游戏'
	},
	
	ocean: {
		en: 'Sea Animals',
		vi: 'Động vật biển',
		zh: '海洋动物',
		'en-vi': 'Sea Animals / Động vật biển',
		'en-zh': 'Sea Animals / 海洋动物'
	}
  },
  
  progressComplete: {
	en: 'Complete',
	vi: 'Hoàn thành',
	zh: '完成',
	'en-vi': 'Complete / Hoàn thành',
	'en-zh': 'Complete / 完成'
  }
}

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
  | 'WeathermatchGame'
  | 'BalloonPopNumberGame'

export default function App() {
  const [gameMode, setGameMode] =
    useState<GameMode>('home')
	const [showPanel, setShowPanel] = useState(false)
const { languageMode, setLanguageMode }=useLanguage()
const appleGameResetRef = useRef<() => void>(() => {})
const colorGameResetRef = useRef<() => void>(() => {})
const balloonGameResetRef = useRef<() => void>(() => {})
const updownGameResetRef = useRef<() => void>(() => {})
const hotcoldGameResetRef = useRef<() => void>(() => {})
const fastslowGameResetRef = useRef<() => void>(() => {})
const runwalkGameResetRef = useRef<() => void>(() => {})
const animalsoundGameResetRef = useRef<() => void>(() => {})
const bigsmallGameResetRef = useRef<() => void>(() => {})
const countGameResetRef = useRef<() => void>(() => {})
const numberrocketResetRef = useRef<() => void>(() => {})
const crabcountGameResetRef = useRef<() => void>(() => {})
const tentaclecountGameResetRef = useRef<() => void>(() => {})
const animalGameResetRef = useRef<() => void>(() => {})
const oceanmatchGameResetRef = useRef<() => void>(() => {})
const planetmatchGameResetRef = useRef<() => void>(() => {})
const weathermatchGameResetRef = useRef<() => void>(() => {})

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
	  const savedStars = localStorage.getItem(`little-stars-total-${currentKid}` )
      return savedStars
        ? Number(savedStars)
        : 0
    })
	
const [completedGames, setCompletedGames] = useState<string[]>([])
  const musicRef = useRef(
    new Audio('music/happy.mp3')
  )

const [difficulty, setDifficulty] =  useState('easy')
  
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
        speakLocalized({ text: uiText.badges.beginner, languageMode });
      }

      if (newTotal === 25) {
        speakLocalized({ text: uiText.badges.smartStar, languageMode });
      }

      if (newTotal === 50) {
        speakLocalized({ text: uiText.badges.learningHero, languageMode });
      }

      return newTotal
    })
  }

const completeGame = (
  gameName: string
) => {
  setCompletedGames((prev) => {
    if (prev.includes(gameName)) {
      return prev
    }

    return [...prev, gameName]
  })
}

  const goHome = () => {
    setGameMode('home')
  }

  const getBadge = () => {
  if (totalStars >= 100)
    return uiText.badges.superGenius[languageMode]

  if (totalStars >= 50)
    return uiText.badges.learningHero[languageMode]

  if (totalStars >= 25)
    return uiText.badges.smartStar[languageMode]

  if (totalStars >= 10)
    return uiText.badges.beginner[languageMode]

  return uiText.badges.newLearner[languageMode]
}

const getPetMood = () => {
  const moodMap = {
    unicorn: '🦄',
    puppy: '🐶',
    kitty: '🐱',
    chick: '🐣'
  }

  if (totalStars >= 100) return {
    emoji: moodMap.unicorn,
    text: uiText.petMood.unicorn?.[languageMode] ?? 'Unicorn!'
  }

  if (totalStars >= 50) return {
    emoji: moodMap.puppy,
    text: uiText.petMood.puppy?.[languageMode] ?? 'Puppy!'
  }

  if (totalStars >= 25) return {
    emoji: moodMap.kitty,
    text: uiText.petMood.kitty?.[languageMode] ?? 'Kitty!'
  }

  return {
    emoji: moodMap.chick,
    text: uiText.petMood.chick?.[languageMode] ?? 'Little Chick!'
  }
}


  const pet = getPetMood()

  const claimDailyReward = () => {
    if (rewardClaimed) return

    setTotalStars((prev) => prev + 5)

    speakLocalized({ text: uiText.dailyRewardSpeech, languageMode});

    setRewardClaimed(true)
  }

  const dailyChallenges = [
  uiText.dailyChallenges.animals[languageMode],
  uiText.dailyChallenges.colors[languageMode],
  uiText.dailyChallenges.fruits[languageMode],
  uiText.dailyChallenges.vehicles[languageMode],
  uiText.dailyChallenges.stars[languageMode],
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
  
  const classroomGames = [
  'apple',
  'color',
  'shape',
  'MatchWordGame',
]

const playgroundGames = [
  'UpDownGame',
  'RunWalkGame',
  'HotColdGame',
  'FastSlowGame',
]

const zooGames = [
  'AnimalsGame',
  'animalSound',
  'memory',
  'BigOrSmallGame',
]

const spaceGames = [
  'count',
  'NumberRocketGame',
  'PlanetMatchGame',
]

const oceanGames = [
  'OceanMatchGame',
  'CrabCountGame',
  'TentacleCountGame',
]

const getProgress = (
  games: string[]
) => {
  return games.filter((game) =>
    completedGames.includes(game)
  ).length
}

const getWorlds = () => [
  {
    emoji: '🏫',
    key: 'Classroom',
    title: uiText.classroomTitle?.[languageMode] ?? 'Classroom',
    text: uiText.worldDescriptions?.classroom?.[languageMode] ?? 'Learning Games',
    stars: 0,
  },
  {
    emoji: '🌳',
    key: 'Playground',
    title: uiText.playgroundTitle?.[languageMode] ?? 'Playground',
    text: uiText.worldDescriptions?.playground?.[languageMode] ?? 'Action Games',
    stars: 10,
  },
  {
    emoji: '🦁',
    key: 'Zoo',
    title: uiText.zooTitle?.[languageMode] ?? 'Zoo',
    text: uiText.worldDescriptions?.zoo?.[languageMode] ?? 'Animal Games',
    stars: 25,
  },
  {
    emoji: '🚀',
    key: 'Space Room',
    title: uiText.spaceTitle?.[languageMode] ?? 'Space Room',
    text: uiText.worldDescriptions?.space?.[languageMode] ?? 'Math Games',
    stars: 50,
  },
  {
    emoji: '🌊',
    key: 'Ocean World',
    title: uiText.oceanTitle?.[languageMode] ?? 'Ocean World',
    text: uiText.worldDescriptions?.ocean?.[languageMode] ?? 'Sea Animals',
    stars: 75,
  },
]

const [showResetConfirm, setShowResetConfirm] = useState(false);

//const resetAllProgress = () => {
  // clears localStorage, stars, daily reward, etc.
//  localStorage.clear();
 // setTotalStars(0);
 // setRewardClaimed(false);

  // NEW: also reset AppleGame state
 // resetAppleGameState();

//};



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
        <div style={floatingStar3}>✨</div>
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
<select

value={languageMode}

onChange={(e)=>

setLanguageMode(
e.target.value
)

}

>
<option value="en">
English
</option>

<option value="vi">
Vietnamese
</option>

<option value="en-vi">
English + Vietnamese
</option>

<option value="en-zh">
English + Chinese
</option>

</select>
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
   {uiText.settings[languageMode]}

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
    <h2 style={{ marginBottom: 20 }}>{uiText.quickPanel[languageMode]}</h2>
    {/* DAILY REWARD */}
    <div
      style={{
        background: '#ffeaa7',
        padding: 20,
        borderRadius: 24,
        marginBottom: 20,
      }}
    >
     <h3>{uiText.dailyReward[languageMode]}</h3>

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
      <p> {rewardClaimed ? 
		uiText.rewardClaimed[languageMode]
        : uiText.rewardTap[languageMode]}</p>
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
     <h3>{uiText.buddy[languageMode]}</h3>
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
      <h3>{uiText.challenge[languageMode]}</h3>
      <p style={{ fontSize: 20, fontWeight: 'bold' }}>
        {dailyChallenge}
      </p>
    </div>
	
	
	
	{/* DIFFICULTY */}
<div
  style={{
    background: '#eef7ff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  }}
>
  <h3>{uiText.difficulty[languageMode]}</h3>
  <div
    style={{
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap',
    }}
  >
    <button
      onClick={() =>
        setDifficulty('easy')
      }
      style={{
        padding: '12px 20px',
        borderRadius: 18,
        border: 'none',
        cursor: 'pointer',
        background:
          difficulty === 'easy'
            ? '#55efc4'
            : '#dfe6e9',
      }}
    >
      🟢 {uiText.easy[languageMode]}
    </button>

    <button
      onClick={() =>
        setDifficulty('medium')
      }
      style={{
        padding: '12px 20px',
        borderRadius: 18,
        border: 'none',
        cursor: 'pointer',
        background:
          difficulty === 'medium'
            ? '#ffeaa7'
            : '#dfe6e9',
      }}
    >
      🟡 {uiText.medium[languageMode]}
    </button>

    <button
      onClick={() =>
        setDifficulty('hard')
      }
      style={{
        padding: '12px 20px',
        borderRadius: 18,
        border: 'none',
        cursor: 'pointer',
        background:
          difficulty === 'hard'
            ? '#fab1a0'
            : '#dfe6e9',
      }}
    >
      🔴 {uiText.hard[languageMode]}
    </button>
  </div>
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
    <h3>{uiText.themes[languageMode]}</h3>
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
    <h3>{uiText.choosePlayer[languageMode]}</h3>
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
              {uiText.stickersTitle[languageMode]}
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
  ? uiText.unlocked[languageMode]
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
				? uiText.musicOn[languageMode]
				: uiText.musicOff[languageMode]}

          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
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
            {uiText.resetProgress[languageMode]}
          </button>

          <p
            style={{
              color: '#666',
              fontSize: 22,
              marginBottom: 30,
            }}
          >
            {uiText.footerText[languageMode]}
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
                {uiText.exploreWorlds[languageMode]}
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
                {getWorlds().map(
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
    fontWeight: 'bold',
    marginTop: 10,
  }}
>
  {world.key === 'Classroom' &&
    `${getProgress(classroomGames)} / ${classroomGames.length} ${uiText.progressComplete[languageMode]}`}

  {world.key === 'Playground' &&
    `${getProgress(playgroundGames)} / ${playgroundGames.length} ${uiText.progressComplete[languageMode]}`}

  {world.key === 'Zoo' &&
    `${getProgress(zooGames)} / ${zooGames.length} ${uiText.progressComplete[languageMode]}`}

  {world.key === 'Space Room' &&
    `${getProgress(spaceGames)} / ${spaceGames.length} ${uiText.progressComplete[languageMode]}`}

  {world.key === 'Ocean World' &&
    `${getProgress(oceanGames)} / ${oceanGames.length} ${uiText.progressComplete[languageMode]}`}
</p>

                        <p
                          style={{
                            marginTop: 12,
                            fontWeight:
                              'bold',
                          }}
                        >
                         {unlocked
  ? uiText.worldUnlocked[languageMode]
  : uiText.worldLocked[languageMode](world.stars)}

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
                 {uiText.backToWorlds[languageMode]}

                </button>
              )}

              {/* CLASSROOM */}
              {selectedWorld ===
                'Classroom' && (
                <>
                  <h2>
                    {uiText.classroomTitle[languageMode]}
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
                      title={uiText.gameTitles.apple[languageMode]}
  				      description={uiText.gameDescriptions.apple[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'apple'
                        )
                      }
                    />

                    <GameCard
                      emoji="🎨"
                      title={uiText.gameTitles.color[languageMode]}
  				      description={uiText.gameDescriptions.color[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'color'
                        )
                      }
                    />

                    <GameCard
                      emoji="🔺"
                      title={uiText.gameTitles.shape[languageMode]}
  				      description={uiText.gameDescriptions.shape[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'shape'
                        )
                      }
                    />
					<GameCard
                      emoji="🔤"
                      title={uiText.gameTitles.word[languageMode]}
  				      description={uiText.gameDescriptions.word[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'MatchWordGame'
                        )
                      }
                    />	
					<GameCard
                      emoji="🎈"
                      title={uiText.gameTitles.balloon[languageMode]}
  				      description={uiText.gameDescriptions.balloon[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'BalloonPopNumberGame'
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
                    {uiText.playgroundTitle[languageMode]}
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
                      title={uiText.gameTitles.updown[languageMode]}
  				      description={uiText.gameDescriptions.updown[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'UpDownGame'
                        )
                      }
                    />  
					 <GameCard
                      emoji="🔥"
                      title={uiText.gameTitles.hotcold[languageMode]}
  				      description={uiText.gameDescriptions.hotcold[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'HotColdGame'
                        )
                      }
                    />  
					 <GameCard
                      emoji="⚡"
                      title={uiText.gameTitles.fastslow[languageMode]}
  				      description={uiText.gameDescriptions.fastslow[languageMode]}
                      onClick={() =>
                        setGameMode(
                          'FastSlowGame'
                        )
                      }
                    /> 
					 <GameCard
                      emoji="🏃"
                      title={uiText.gameTitles.runwalk[languageMode]}
  				      description={uiText.gameDescriptions.runwalk[languageMode]}
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
                  <h2>{uiText.zooTitle[languageMode]}</h2>
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
                      title={uiText.gameTitles.animal[languageMode]}
description={uiText.gameDescriptions.animal[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'AnimalsGame'
                        )
                      }
                    />

                    <GameCard
                      emoji="🐾"
                      title={uiText.gameTitles.animalSounds[languageMode]}
description={uiText.gameDescriptions.animalSounds[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'animalSound'
                        )
                      }
                    />

                    <GameCard
                      emoji="🧠"
                      title={uiText.gameTitles.memory[languageMode]}
description={uiText.gameDescriptions.memory[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'memory'
                        )
                      }
                    />
					<GameCard
                      emoji="🐘"
                      title={uiText.gameTitles.bigSmall[languageMode]}
description={uiText.gameDescriptions.bigSmall[languageMode]}

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
                  <h2>{uiText.spaceTitle[languageMode]}</h2>
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
                     title={uiText.gameTitles.count[languageMode]}
description={uiText.gameDescriptions.count[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'count'
                        )
                      }
                    />
					 <GameCard
                      emoji="🚀"
                     title={uiText.gameTitles.rocket[languageMode]}
description={uiText.gameDescriptions.rocket[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'NumberRocketGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🪐"
                     title={uiText.gameTitles.planetMatch[languageMode]}
description={uiText.gameDescriptions.planetMatch[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'PlanetMatchGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🌙"
                     title={uiText.gameTitles.weathermatch[languageMode]}
description={uiText.gameDescriptions.weathermatch[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'WeathermatchGame'
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
                 <h2>{uiText.oceanTitle[languageMode]}</h2>
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
                     title={uiText.gameTitles.oceanMatch[languageMode]}
description={uiText.gameDescriptions.oceanMatch[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'OceanMatchGame'
                        )
                      }
                    />
					<GameCard
                      emoji="🦀"
                     title={uiText.gameTitles.crabCount[languageMode]}
description={uiText.gameDescriptions.crabCount[languageMode]}

                      onClick={() =>
                        setGameMode(
                          'CrabCountGame'
                        )
                      }
                    />	
					<GameCard
                      emoji="🐙"
                     title={uiText.gameTitles.tentacleCount[languageMode]}
description={uiText.gameDescriptions.tentacleCount[languageMode]}

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
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={appleGameResetRef}
            />
          )}

          {gameMode === 'count' && (
            <CountGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={countGameResetRef}  
            />
          )}
		  
		  {gameMode === 'NumberRocketGame' && (
            <NumberRocketGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={numberrocketResetRef}
            />
          )}
          {gameMode === 'color' && (
            <ColorGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={colorGameResetRef}
            />
          )}

          {gameMode === 'shape' && (
            <ShapeGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={appleGameResetRef}
            />
          )}
		  
		  {gameMode === 'MatchWordGame' && (
            <MatchWordGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}

            />
          )}

          {gameMode === 'memory' && (
            <MemoryGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
            />
          )}

          {gameMode === 'AnimalsGame' && (
            <AnimalGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={animalGameResetRef}   
            />
          )}

          {gameMode ===
            'animalSound' && (
            <AnimalSoundGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={animalsoundGameResetRef} 
            />
          )}
		    {gameMode ===
            'BigOrSmallGame' && (
            <BigOrSmallGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={bigsmallGameResetRef} 
			  
            />
          )}
		   {gameMode ===
            'OceanMatchGame' && (
            <OceanMatchGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={oceanmatchGameResetRef}  
            />
          )}
		  {gameMode ===
            'PlanetMatchGame' && (
            <PlanetMatchGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={planetmatchGameResetRef}  
            />
          )}
		  {gameMode ===
            'CrabCountGame' && (
            <CrabCountGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={crabcountGameResetRef} 
            />
          )}
		   {gameMode ===
            'TentacleCountGame' && (
            <TentacleCountGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={tentaclecountGameResetRef} 
            />
          )}
		   {gameMode ===
            'UpDownGame' && (
            <UpDownGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={updownGameResetRef}
            />
          )}
		   {gameMode ===
            'HotColdGame' && (
            <HotColdGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={hotcoldGameResetRef} 
            />
          )}
		  {gameMode ===
            'FastSlowGame' && (
            <FastSlowGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={fastslowGameResetRef} 	  
            />
          )}
		  {gameMode ===
            'RunWalkGame' && (
            <RunWalkGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={runwalkGameResetRef}
            />
          )}
		  {gameMode ===
            'WeathermatchGame' && (
            <WeathermatchGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={weathermatchGameResetRef}
            />
          )}
		  {gameMode ===
            'BalloonPopNumberGame' && (
            <BalloonPopNumberGame
              onBack={goHome}
              addStar={addStar}
			  difficulty={difficulty}
			  completeGame={completeGame}
			  resetRef={balloonGameResetRef}
            />
          )}
	  
		  {showResetConfirm && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: 30,
        borderRadius: 20,
        width: '80%',
        maxWidth: 350,
        textAlign: 'center',
      }}
    >
      <h3 style={{ marginBottom: 20 }}>
        Are you sure you want to reset ALL progress?
      </h3>

      <button
        onClick={() => {
          // Clear saved stars
          localStorage.removeItem(`little-stars-total-${currentKid}`);
          setTotalStars(0);
		  setRewardClaimed(false);
		  
		  // Close popup
          setShowResetConfirm(false);
		  
          // reset games safely
		  try { appleGameResetRef.current?.() } catch {}
		  try { colorGameResetRef.current?.() } catch {}
		  try { shapeGameResetRef.current?.() } catch {}
	      try { balloonGameResetRef.current?.() } catch {}  
		  try { updownGameResetRef.current?.() } catch {} 
		  try { hotcoldGameResetRef.current?.() } catch {}
		  try { fastslowGameResetRef.current?.() } catch {}
		  try { runwalkGameResetRef.current?.() } catch {}  
		  try { animalsoundGameResetRef.current?.() } catch {}  
		  try { bigsmallGameResetRef.current?.() } catch {} 
          try { countGameResetRef.current?.() } catch {} 
		  try { numberrocketResetRef.current?.() } catch {}  
		  try { crabcountGameResetRef.current?.() } catch {} 
          try { tentaclecountGameResetRef.current?.() } catch {} 
          try { animalGameResetRef.current?.() } catch {} 
		  try { oceanmatchGameResetRef.current?.() } catch {} 
          try { planetmatchGameResetRef.current?.() } catch {} 
		  try { weathermatchGameResetRef.current?.() } catch {} 		  
		  
        }}
        style={{
          background: '#ff7675',
          border: 'none',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 14,
          cursor: 'pointer',
          width: '100%',
          marginBottom: 10,
          fontSize: 16,
        }}
      >
        Yes, reset everything
      </button>

      <button
        onClick={() => setShowResetConfirm(false)}
        style={{
          background: '#dfe6e9',
          border: 'none',
          padding: '12px 20px',
          borderRadius: 14,
          cursor: 'pointer',
          width: '100%',
          fontSize: 16,
        }}
      >
        Cancel
      </button>
    </div>
  </div>
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