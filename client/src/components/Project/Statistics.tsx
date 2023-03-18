import { Dialog, DialogContentText, DialogTitle } from '@mui/material'
import { TProject } from '../../types/project'

type OwnProps = {
  project: TProject
}

export const ProjStats = ({ project }: OwnProps) => {
  return (
    <Dialog open>
      <DialogTitle>Project Statistics</DialogTitle>
      <DialogContentText style={{ marginLeft: 24, marginRight: 12 }}>
        Track productivity and figure out where your time goes
      </DialogContentText>
    </Dialog>
  )
}
