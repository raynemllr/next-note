import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Spotlight } from '@/components/ui/spotlight'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
  const { userId } = auth()

  if (userId) {
    redirect('/notes')
  }

  return (
    <main className='relative flex min-h-screen w-full overflow-hidden rounded-md antialiased bg-grid-white/[0.02] dark:bg-black/[0.96] md:items-center md:justify-center'>
      <Spotlight
        className='-top-40 left-0 md:-top-20 md:left-60'
        fill='white'
      />
      <div className='relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center space-y-6 p-4 pt-20 md:pt-0'>
        <div className='flex items-center gap-4'>
          <Logo className='size-12 sm:size-16 md:size-20 lg:size-24' />
          <h1 className='bg-opacity-50 bg-gradient-to-t from-neutral-400 to-neutral-800 bg-clip-text text-center text-4xl font-bold text-transparent dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-400 md:text-7xl'>
            NextNote
          </h1>
        </div>

        <p className='mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-700 dark:text-neutral-300'>
          A note-taking app with AI integration, constructed using Next.js and
          powered by OpenAI&apos;s API, creator of ChatGPT.
        </p>

        <Button size='lg' asChild>
          <Link href='/sign-in' className='mt-20'>
            Open
          </Link>
        </Button>
      </div>
    </main>
  )
}
