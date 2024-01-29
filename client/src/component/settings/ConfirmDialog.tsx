import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Button } from "../ui/button"

interface Props {
  button: any
  title: string
  body: string
  confirm: () => void
}

const ConfirmDialog = ({ button, title, body, confirm}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {button}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black dark:text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {body}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="dark:text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => confirm()}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 

export default ConfirmDialog