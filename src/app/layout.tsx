import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NextNote',
  description:
    'A Note taking app with AI integration developed using NextJS 14',
  authors: [{ name: 'Rayne Mallari' }]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          {children}
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
