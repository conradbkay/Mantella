import { Checkbox, IconButton, TextField } from '@mui/material'
import Delete from '@mui/icons-material/Delete'

import { TSubtask } from '../../types/project'

type Props = {
  setSubtask: (id: string, toMergeSubtask: Partial<TSubtask> | null) => void
  subtask: TSubtask
}

export const EditSubtask = ({ setSubtask, subtask }: Props) => {
  return (
    <div key={subtask.id} style={{ display: 'flex', marginTop: 8 }}>
      <Checkbox
        style={{ marginRight: 10, width: 32, height: 32 }}
        disableRipple
        checked={subtask.completed}
        onChange={(e) => {
          setSubtask(subtask.id, {
            completed: !subtask.completed
          })
        }}
      />
      <TextField
        margin="none"
        required
        fullWidth
        value={subtask.name}
        onChange={(e) => {
          setSubtask(subtask.id, { name: e.target.value })
        }}
      />
      <IconButton
        style={{
          marginLeft: 10,
          width: 48,
          height: 48,
          marginTop: 'auto'
        }}
        onClick={() => {
          setSubtask(subtask.id, null)
        }}
      >
        <Delete />
      </IconButton>
    </div>
  )
}
