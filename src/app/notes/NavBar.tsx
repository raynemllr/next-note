'use client'

import AIChatButton from '@/components/AIChatButton'
import AddEditNoteDialog from '@/components/AddEditNoteDialog'
import Logo from '@/components/Logo'
import ThemeToggleButton from '@/components/ThemeToggleButton'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const NavBar = () => {
  const [shadowAddNoteDialog, setShowAddNoteDialog] = useState(false)

  return (
    <>
      <div className='sticky left-0 top-0 z-50 border-b bg-background p-4'>
        <div className='m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3'>
          <Link href='/notes' className='flex items-center gap-2'>
            <Logo className='size-10' />

            <span className='font-bold'>NextNote</span>
          </Link>

          <div className='flex items-center gap-3 md:gap-4'>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } }
              }}
            />

            <ThemeToggleButton />

            <Button onClick={() => setShowAddNoteDialog(true)}>
              <Plus size={20} className='mr-2' />
              Add Note
            </Button>

            <AIChatButton />
          </div>
        </div>
      </div>

      {/* Benefit of having open and setOpen is it doesn't clear the input if the component was unmounted */}
      <AddEditNoteDialog
        open={shadowAddNoteDialog}
        setOpen={setShowAddNoteDialog}
      />
    </>
  )
}
export default NavBar
