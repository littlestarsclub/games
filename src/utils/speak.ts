/*export const speak = (
  text: string,
  lang = 'en-US'
) => {
  const utterance =
    new SpeechSynthesisUtterance(text)

  utterance.lang = lang
  utterance.rate = 0.9

  speechSynthesis.speak(utterance)
}*/
/*
export const speak = (
  text: string,
  lang = 'en-US'
) => {
  return new Promise(resolve => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.onend = resolve
    speechSynthesis.speak(utter)
  })
}*/


export const speak = (text: string, lang = 'en-US') => {
  return new Promise(resolve => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang

    const pickVoice = () => {
      const voices = speechSynthesis.getVoices()

      // Customize your preferred voices here
      const preferredVoices: Record<string, string[]> = {
        'en-US': [
          'Google US English',
          'Microsoft Ana Online (Natural)',
          'Samantha'
        ],
        'vi-VN': [
          'Google Vietnamese',
          'Microsoft HoaiMy Online (Natural)',
          'Microsoft NamMinh Online (Natural)'
        ]
      }

      const prefs = preferredVoices[lang] || []
      utter.voice =
        voices.find(v => prefs.includes(v.name)) ||
        voices.find(v => v.lang === lang) ||
        null
    }

    // Voices may not be loaded yet
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        pickVoice()
        speechSynthesis.speak(utter)
      }
    } else {
      pickVoice()
      speechSynthesis.speak(utter)
    }

    utter.onend = resolve
  })
}
