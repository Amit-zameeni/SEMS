import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEMS — Smart Emergency Muster System',
  description: 'Enterprise-grade emergency evacuation and automatic employee accountability platform.',
  keywords: 'emergency muster, evacuation, employee accountability, industrial safety, HSE',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#0a0b0d" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
