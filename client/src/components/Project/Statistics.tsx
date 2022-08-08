import { Dialog, DialogContentText, DialogTitle } from '@material-ui/core'

type OwnProps = {
  projectId: string
  open: boolean
  handleClose: () => void
}

export const ProjStats = (props: OwnProps) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Project Statistics</DialogTitle>
      <DialogContentText style={{ marginLeft: 24, marginRight: 12 }}>
        Track productivity and figure out where your time goes
      </DialogContentText>
    </Dialog>
  )
}
