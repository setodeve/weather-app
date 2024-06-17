import '@/styles/globals.css'
import React from 'react'
import { UIProvider } from '@yamada-ui/react'

export default function App({ Component, pageProps }: any) {
  return (
    <UIProvider>
      <Component {...pageProps} />
    </UIProvider>
  )
}
