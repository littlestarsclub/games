import { speak } from './speak'

import {
 LanguageMode
} from '../context/LanguageContext'

export async function
speakLocalized({

 text,

 languageMode,

}:{

 text:{
  en?:string
  vi?:string
  zh?:string
 }

 languageMode:LanguageMode

}){

 if(
 languageMode==='en'
 ){

 await speak(
  text.en ?? ''
 )

}

else if(
 languageMode==='vi'
){

 await speak(
 text.vi ?? '',
 'vi-VN'
)

}

else if(
 languageMode==='zh'
){

 await speak(
 text.zh ?? '',
 'zh-CN'
)

}

else if(
 languageMode==='en-zh'
){

 await speak(
 text.en ?? ''
 )

 await speak(
 text.zh ?? '',
 'zh-CN'
 )

}

else{

 await speak(
 text.en ?? ''
 )

 await speak(
 text.vi ?? '',
 'vi-VN'
 )

}

}