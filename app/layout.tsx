import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Lily's Playspace",
  description: "A fun learning and playing space for Lily!",
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
