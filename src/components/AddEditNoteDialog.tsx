import { CreateNoteSchemaType, createNoteSchema } from '@/lib/validation/note'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import LoadingButton from '@/components/ui/loading-button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Note } from '@prisma/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AddEditNoteDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  noteToEdit?: Note
}

const AddEditNoteDialog = ({
  open,
  setOpen,
  noteToEdit
}: AddEditNoteDialogProps) => {
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false)

  const router = useRouter()

  const form = useForm<CreateNoteSchemaType>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || '',
      content: noteToEdit?.content || ''
    }
  })

  // * Form submit - create / update a note
  async function onSubmit(input: CreateNoteSchemaType) {
    try {
      const hasChanges =
        JSON.stringify(input) !==
        JSON.stringify({
          title: noteToEdit?.title || '',
          content: noteToEdit?.content || ''
        })

      if (!hasChanges) {
        toast.warning('No changes detected. Note not updated.')
        return
      }

      if (noteToEdit) {
        const response = await fetch('/api/notes', {
          method: 'PUT',
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input
          })
        })

        if (!response.ok) {
          throw Error(`Status code: ${response.status}`)
        }

        toast.success('Note successfully updated')
      } else {
        const response = await fetch('/api/notes', {
          method: 'POST',
          body: JSON.stringify(input)
        })

        if (!response.ok) {
          throw Error(`Status code: ${response.status}`)
        }

        form.reset()
        toast.success('Note successfully added')
      }

      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  // * Open delete confirmation dialog
  function deleteConfirmation() {
    if (!noteToEdit) return
    setOpenConfirmationDelete(true)
    setOpen(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{noteToEdit ? 'Edit note' : 'Add Note'}</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Note title'
                        {...field}
                        className={cn(
                          form.formState.errors.title &&
                            'border-red-500 focus-visible:ring-red-500'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note content</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Note content' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className='gap-1 sm:gap-0'>
                {noteToEdit && (
                  <Button
                    type='button'
                    variant='destructive'
                    onClick={deleteConfirmation}
                    disabled={form.formState.isSubmitting}
                  >
                    Delete note
                  </Button>
                )}
                <LoadingButton
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  loading={form.formState.isSubmitting}
                >
                  {noteToEdit ? 'Update' : 'Submit'}
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {openConfirmationDelete && noteToEdit && (
        <DeleteConfirmationDialog
          open={openConfirmationDelete}
          setOpen={setOpenConfirmationDelete}
          noteToEdit={noteToEdit}
        />
      )}
    </>
  )
}

export default AddEditNoteDialog

// * Confirm delete dialog
const DeleteConfirmationDialog = ({
  noteToEdit,
  open,
  setOpen
}: AddEditNoteDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  const router = useRouter()

  async function deleteNote() {
    if (!noteToEdit) return

    setDeleteInProgress(true)

    try {
      const response = await fetch('/api/notes', {
        method: 'DELETE',
        body: JSON.stringify({ id: noteToEdit.id })
      })

      if (!response.ok) {
        throw Error(`Status code: ${response.status}`)
      }

      router.refresh()
      setOpen(false)

      toast.success('Note successfully deleted')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setDeleteInProgress(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Note delete confirmation</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete &quot;
          <span className='font-bold'>{noteToEdit?.title}</span>&quot; note?
        </p>

        <DialogFooter className='gap-1 sm:gap-0'>
          {noteToEdit && (
            <>
              <LoadingButton
                type='button'
                variant='destructive'
                loading={deleteInProgress}
                disabled={deleteInProgress}
                onClick={deleteNote}
              >
                Yes
              </LoadingButton>

              <Button
                type='button'
                onClick={() => setOpen(false)}
                disabled={deleteInProgress}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
