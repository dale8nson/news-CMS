'use client';
import { useRef } from 'react';
import type { Metadata } from 'next'
import './globals.css'
import 'primeicons/primeicons.css';
// import 'primereact/resources/themes/md-light-indigo/theme.css'
import 'primereact/resources/themes/md-dark-indigo/theme.css'
import StoreProvider from './StoreProvider';


export const metadata: Metadata = {
  title: 'News CMS',
  description: ''
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <StoreProvider>
        <body className='w-screen h-screen'>{children}</body>
      </StoreProvider>
    </html>
  )
}
