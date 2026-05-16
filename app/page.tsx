import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SilverCare — AI Healthcare for Singapore Seniors',
  description: 'Elder risk prediction, AI companionship, and caregiver monitoring.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
