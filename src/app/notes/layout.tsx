import NavBar from '@/app/notes/NavBar'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function NotesLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    redirect('/')
  }

  return (
    <div className='min-h-screen'>
      <NavBar />
      <main className='mx-auto max-w-7xl p-4'>{children}</main>
    </div>
  )
}
