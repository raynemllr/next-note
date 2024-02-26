import { notesIndex } from '@/lib/db/pinecone'
import { db } from '@/lib/db/prisma'
import openai, { getEmbedding } from '@/lib/openai'
import { auth } from '@clerk/nextjs'
import { ChatCompletionMessage } from 'openai/resources/index.mjs'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: ChatCompletionMessage[] = body.messages

    const messagesTruncated = messages.slice(-6)

    const embedding = await getEmbedding(
      messagesTruncated.map(message => message.content).join('\n')
    )

    const { userId } = auth()

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId }
    })

    const relevantNotes = await db.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map(match => match.id)
        }
      }
    })

    const systemMessage: ChatCompletionMessage = {
      role: 'assistant',
      content:
        "You are and itelligent note-taking app. You answer the user's question based on their existing notes. " +
        'The relevant notes for this query are: \n' +
        relevantNotes
          .map(note => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join('\n\n')
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [systemMessage, ...messages]
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
