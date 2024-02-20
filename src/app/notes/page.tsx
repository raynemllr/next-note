import { db } from '@/lib/db/prisma'
import { auth } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NextNote - Notes'
}

export default async function NotesPage() {
  const { userId } = auth()

  if (!userId) {
    throw new Error('userId undefined')
  }

  const allNotes = await db.note.findMany({ where: { userId } })

  return <div>{JSON.stringify(allNotes)}</div>
}
