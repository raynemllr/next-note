import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from './ThemeProvider'

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
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute='class' defaultTheme='light'>
            <div className='antialiased bg-grid-black/[0.03] dark:bg-grid-white/[0.02]'>
              {children}
            </div>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
