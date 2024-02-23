import { notesIndex } from '@/lib/db/pinecone'
import { db } from '@/lib/db/prisma'
import { getEmbedding } from '@/lib/openai'
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

    // from openai
    const embedding = await getEmbeddingForNote(title, content)

    // transaction - does multiple db operations and only be applied when all operations succeed
    const note = await db.$transaction(async tx => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId
        }
      })

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId }
        }
      ])

      return note
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

    const embedding = await getEmbeddingForNote(title, content)

    const updatedNote = await db.$transaction(async tx => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content
        }
      })

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId }
        }
      ])

      return updatedNote
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

    await db.$transaction(async tx => {
      await db.note.delete({
        where: { id }
      })

      await notesIndex.deleteOne(id)
    })

    return Response.json({ message: 'Note deleted' }, { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// * Create and embeding when creating or updating a note
async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + '\n\n' + content ?? '')
}
