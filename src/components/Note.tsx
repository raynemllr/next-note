'use client'

import { Note as NoteModel } from '@prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useState } from 'react'
import AddEditNoteDialog from './AddEditNoteDialog'

type NoteProps = {
  note: NoteModel
}

const Note = ({ note }: NoteProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const wasUpdated = note.updatedAt > note.createdAt

  const createdUpdatedAtDate = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString()

  const updatedAtTimestamp = note.updatedAt.toLocaleTimeString()

  return (
    <>
      <Card
        className='cursor-pointer transition-shadow hover:shadow-lg'
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtDate}
            {wasUpdated && ` at ${updatedAtTimestamp} (updated)`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className='whitespace-pre-line'>{note.content}</p>
        </CardContent>
      </Card>

      <AddEditNoteDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        noteToEdit={note}
      />
    </>
  )
}
export default Note
