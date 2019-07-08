import * as React from 'react'
import { connect } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Theme,
  createStyles,
  WithStyles,
  IconButton,
  withStyles,
  Checkbox,
  FormControlLabel
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { Change } from '../../types/types'
import { setColumnA } from '../../store/actions/column'
import { TProject } from '../../types/project'
import { useState } from 'react'
import {
  CreateColumnMutation,
  CreateColumnMutationVariables
} from '../../graphql/types'
import { GQL_CREATE_COLUMN } from '../../graphql/mutations/column'
import { useMutation } from '@apollo/react-hooks'

interface OwnProps {
  project: TProject
  onClose(): void
}

type CreateColumnProps = typeof actionCreators &
  OwnProps &
  WithStyles<typeof styles>

const styles = (theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

const CCreateColumn = (props: CreateColumnProps) => {
  const [name, setName] = useState('')
  const [isCompletedCol, setIsCompletedCol] = useState(false)
  const [WIPLimit, setWIPLimit] = useState(3)
  const [hasWIPLimit, setHasWIPLimit] = useState(false)

  const [createColumnExec] = useMutation<
    CreateColumnMutation,
    CreateColumnMutationVariables
  >(GQL_CREATE_COLUMN, {
    onCompleted: ({ createColumn }: CreateColumnMutation) => {
      if (createColumn && createColumn.project && createColumn.column) {
        props.setColumn({
          id: createColumn.column.id,
          projectId: props.project.id,
          newCol: {
            taskIds: [],
            id: createColumn.column.id,
            name: createColumn.column.name,
            isCompletedColumn: createColumn.column.isCompletedColumn || false,
            taskLimit: hasWIPLimit ? WIPLimit : undefined
          }
        })
      } else {
        console.log(
          'RESULT NOT INCLUDING PROJECT OR COLUMN IN CREATE_COLUMN: ',
          createColumn
        )
      }
      onClose()
    }
  })

  const { project, onClose, classes } = props
  return (
    <Dialog open={true} onClose={onClose}>
      <form
        onSubmit={e => {
          e.preventDefault()
          createColumnExec({
            variables: {
              name: name || 'Column',
              projId: props.project.id,
              isCompletedColumn: isCompletedCol || false,
              taskLimit: hasWIPLimit ? WIPLimit || undefined : undefined
            }
          })
        }}
      >
        <DialogTitle>Create Column</DialogTitle>
        <IconButton className={classes.closeButton} onClick={onClose}>
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText>
            Columns should contain either a type or date of task. Ex: "Amanda",
            "Completing", or "Writing"
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            label="Column Name"
            value={name}
            onChange={({ target }: Change) => setName(target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled={
                  Object.values(project.columns).filter(
                    col => col.isCompletedColumn
                  ).length !== 0
                }
                checked={isCompletedCol}
                onChange={e => setIsCompletedCol(e.target.checked)}
                value="isCompletedColumn"
              />
            }
            label="Completed Column"
          />
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasWIPLimit}
                  onChange={e => setHasWIPLimit(e.target.checked)}
                  value="isCompletedColumn"
                />
              }
              label="Has Work in Progress Limit"
            />
          </div>
          {hasWIPLimit && (
            <TextField
              label="WIP Limit"
              value={WIPLimit}
              type="number"
              onChange={e => {
                const val = parseInt(e.target.value)
                if (val >= 1) {
                  setWIPLimit(Math.floor(val)) // no decimals :P
                }
              }}
              fullWidth
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={onClose} color="secondary">
            Cancel
          </Button>

          <Button fullWidth variant="contained" color="primary" type="submit">
            Create Column
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const actionCreators = {
  setColumn: setColumnA
}

export const CreateColumn = connect(
  null,
  actionCreators
)(withStyles(styles)(CCreateColumn))
