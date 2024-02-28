import Note from '@/components/Note'
import { db } from '@/lib/db/prisma'
import { auth } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NextNote - Notes'
}

export default async function NotesPage() {
  const { userId } = auth()

  if (!userId) {
    throw Error('userId undefined')
  }

  const allNotes = await db.note.findMany({ where: { userId } })

  return (
    <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {allNotes.map(note => (
        <Note note={note} key={note.id} />
      ))}

      {allNotes.length === 0 && (
        <div className='col-span-full text-center'>
          You don&apos;t have any notes yet. Why don&apos;tyou create one?
        </div>
      )}
    </div>
  )
}
