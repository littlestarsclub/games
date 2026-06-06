import { createContext, useContext, useState, ReactNode,} from 'react'

export type LanguageMode =
 | 'en'
 | 'vi'
 | 'en-vi'
 | 'zh'
 | 'en-zh'

type LanguageContextType = {

 languageMode: LanguageMode

 setLanguageMode:
 React.Dispatch<
  React.SetStateAction<LanguageMode>
 >
}

const LanguageContext =
 createContext<
  LanguageContextType | undefined
 >(undefined)

export function LanguageProvider({
 children,
}:{
 children:ReactNode
}) {

 const [ languageMode,  setLanguageMode, ] = useState<LanguageMode>( 'en-vi' )

 return (

<LanguageContext.Provider
 value={{
 languageMode,
 setLanguageMode,
}}
>

{children}

</LanguageContext.Provider>

 )

}

export function useLanguage(){

 const context=  useContext(LanguageContext)

 if(!context){ throw new Error( 'useLanguage must be inside provider' )}

 return context

}