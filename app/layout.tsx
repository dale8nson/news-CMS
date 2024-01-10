import type { Metadata } from 'next'
import './globals.css'
import 'primeicons/primeicons.css';
        


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
      <body>{children}</body>
    </html>
  )
}
