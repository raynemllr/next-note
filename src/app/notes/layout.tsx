import NavBar from '@/app/notes/NavBar'

export default function NotesLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavBar />
      <main className='mx-auto max-w-7xl p-4'>{children}</main>
    </>
  )
}