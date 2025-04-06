import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Neunzig WTF?!?',
  description: 'Jochen & Nille werden alt',
  generator: 'Many AI Tools',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet"/>
      </head>
      <body>{children}</body>
    </html>
  )
}
