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

type AddNoteDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AddNoteDialog = ({ open, setOpen }: AddNoteDialogProps) => {
  const router = useRouter()

  const form = useForm<CreateNoteSchemaType>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  async function onSubmit(input: CreateNoteSchemaType) {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify(input)
      })

      if (!response.ok) {
        throw Error(`Status code: ${response.status}`)
      }

      form.reset()
      router.refresh()

      setOpen(false)
      toast.success('Note successfully added')
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
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
                    <Input placeholder='Note title' {...field} />
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

            <DialogFooter className='flex justify-center'>
              <LoadingButton
                type='submit'
                loading={form.formState.isSubmitting}
                className='w-full'
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNoteDialog
