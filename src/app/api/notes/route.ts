import { db } from '@/lib/db/prisma'
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema
} from '@/lib/validation/note'
import { auth } from '@clerk/nextjs'

// * Create a new note
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parseResult = createNoteSchema.safeParse(body)

    if (!parseResult.success) {
      console.error(parseResult.error)
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { title, content } = parseResult.data

    const { userId } = auth()

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const note = await db.note.create({
      data: {
        title,
        content,
        userId
      }
    })

    return Response.json({ note }, { status: 201 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// * Update a note
export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const parseResult = updateNoteSchema.safeParse(body)

    if (!parseResult.success) {
      console.error(parseResult.error)
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { id, title, content } = parseResult.data

    const note = await db.note.findUnique({
      where: {
        id
      }
    })

    if (!note) {
      return Response.json({ error: 'Note not found' }, { status: 404 })
    }

    const { userId } = auth()

    if (!userId || userId !== note.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updatedNote = await db.note.update({
      where: { id },
      data: {
        title,
        content
      }
    })

    return Response.json({ updatedNote }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// * Delete a note
export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    const parseResult = deleteNoteSchema.safeParse(body)

    if (!parseResult.success) {
      console.error(parseResult.error)
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { id } = parseResult.data

    const note = await db.note.findUnique({
      where: {
        id
      }
    })

    if (!note) {
      return Response.json({ error: 'Note not found' }, { status: 404 })
    }

    const { userId } = auth()

    if (!userId || userId !== note.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.note.delete({
      where: { id }
    })

    return Response.json({ message: 'Note deleted' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
