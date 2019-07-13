import React, { Dispatch, SetStateAction } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Button,
  TextField,
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core'
import {
  ArrowBack,
  DeleteForever,
  Add,
  ArrowForward,
  MoreHoriz
} from '@material-ui/icons'
import { setColumnA } from '../../../store/actions/column'
import { TColumn } from '../../../types/project'
import { GQL_EDIT_COLUMN } from '../../../graphql/mutations/list'
import {
  EditColumnMutationVariables,
  EditColumnMutation,
  EditProjectMutation,
  EditProjectMutationVariables
} from '../../../graphql/types'
import { useMutation } from '@apollo/react-hooks'
import { connect } from 'react-redux'
import { setProjectA } from '../../../store/actions/project'
import { GQL_EDIT_PROJECT } from '../../../graphql/mutations/project'
import { TProject } from '../../../types/project'
import { moveInArray } from '../../../utils/utilities'

type OwnProps = {
  setDeleting: Dispatch<SetStateAction<boolean>>
  setCreatingTask: Dispatch<SetStateAction<boolean>> // should be removed later for a floating action button below each column :)
  project: TProject
  column: TColumn
  collapse: () => void
  index: number | 'end'
  disableAdd: boolean
} & WithStyles<typeof styles>

/** @todo set name to be an input when hovering/clicking */

const styles = (theme: Theme) =>
  createStyles({
    input: {
      marginTop: 'auto',
      marginBottom: 'auto',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: 18,
      outline: 'none',
      backgroundColor: '#f5f5f5',
      borderRadius: 4,
      padding: 4,
      marginLeft: 5,
      width: '100%',
      border: '1px solid transparent',
      '&:hover': {
        backgroundColor: 'white'
      },
      '&:focus': {
        borderColor: '#27b6ba'
      }
    },
    root: {
      backgroundColor: '#f2f2f2',
      padding: '4px 0px',
      display: 'flex',
      flexDirection: 'row'
    },
    lengthMarker: {
      margin: 'auto 4px',
      fontSize: '1rem',
      color: 'rgba(0,0,0,0.56)'
    }
  })

const ColumnHeaderComp = withStyles(styles)(
  (props: OwnProps & typeof actionCreators) => {
    const [anchorEl, setAnchorEl] = React.useState(null as React.ReactNode)
    const [editingWIPLimit, setEditingWIPLimit] = React.useState(false)
    const [name, setName] = React.useState(props.column.name)
    const [wipLimit, setWipLimit] = React.useState(
      props.column.taskLimit
        ? props.column.taskLimit
        : props.column.taskIds.length
    )

    const [gqlEditProject] = useMutation<
      EditProjectMutation,
      EditProjectMutationVariables
    >(GQL_EDIT_PROJECT, {
      onCompleted: ({ editProject }) => {
        if (editProject) {
          props.setProject({
            id: editProject.id,
            newProj: editProject
          })
        }
      }
    })

    const [gqlEditColumn] = useMutation<
      EditColumnMutation,
      EditColumnMutationVariables
    >(GQL_EDIT_COLUMN, {
      onCompleted: ({ editColumn }) => {
        if (editColumn && editColumn.column && editColumn.column) {
          const col = editColumn.column

          props.setColumn({
            id: editColumn.column.id,
            projectId: props.project.id,
            newCol: {
              name: col.name,
              id: col.id,
              taskIds: col.taskIds || [],
              taskLimit: col.taskLimit || 0
            }
          })
        }
      }
    })

    const { setDeleting, column, collapse, setCreatingTask, classes } = props
    return (
      <>
        <div className={classes.root}>
          <IconButton
            style={{ marginLeft: 5 }}
            disabled={props.disableAdd}
            onClick={() => setCreatingTask(true)}
            color="primary"
          >
            <Add />
          </IconButton>
          <input
            className={classes.input}
            value={name}
            onBlur={() => {
              gqlEditColumn({
                variables: {
                  newCol: { name: name },
                  id: props.column.id,
                  projectId: props.project.id
                }
              })
            }}
            onChange={e => {
              setName(e.target.value)
            }}
          />
          <span className={classes.lengthMarker}>
            ({column.taskIds.length}
            {column.taskLimit ? '/' + column.taskLimit : ''})
          </span>
          <IconButton
            style={{ marginLeft: 'auto', marginRight: 5 }}
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <MoreHoriz />
          </IconButton>
        </div>
        <Menu
          anchorEl={anchorEl as any}
          open={Boolean(anchorEl)}
          style={{ minWidth: 200 }}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              gqlEditProject({
                variables: {
                  id: props.project.id,
                  newProj: {
                    columnIds: moveInArray(
                      props.project.columnOrder,
                      props.project.columnOrder.indexOf(props.column.id),
                      -1
                    )
                  }
                }
              })
              setAnchorEl(null)
            }}
          >
            <ListItemIcon>
              <ArrowBack />
            </ListItemIcon>
            Move to Left
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null)

              const newArr = moveInArray(
                props.project.columnOrder,
                props.project.columnOrder.indexOf(props.column.id),
                1
              )

              gqlEditProject({
                variables: {
                  id: props.project.id,
                  newProj: {
                    columnIds: newArr
                  }
                }
              })
              setAnchorEl(null)
            }}
          >
            <ListItemIcon>
              <ArrowForward />
            </ListItemIcon>
            Move to Right
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              setDeleting(true)
            }}
          >
            <ListItemIcon>
              <DeleteForever />
            </ListItemIcon>
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              setEditingWIPLimit(true)
              setAnchorEl(null)
            }}
          >
            Set WIP Limit
          </MenuItem>
          <MenuItem
            onClick={() => {
              collapse()
            }}
          >
            Collapse Column
          </MenuItem>
        </Menu>
        <Dialog
          onClose={() => setEditingWIPLimit(false)}
          open={editingWIPLimit}
        >
          <div style={{ minWidth: 400 }}>
            <DialogTitle>Set {column.name} WIP Limit</DialogTitle>
            <DialogContent>
              <TextField
                type="number"
                fullWidth
                value={wipLimit}
                onChange={e => {
                  if (parseInt(e.target.value) >= column.taskIds.length) {
                    setWipLimit(parseInt(e.target.value))
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                fullWidth
                color="secondary"
                onClick={() => setEditingWIPLimit(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  gqlEditColumn({
                    variables: {
                      newCol: {
                        taskLimit: wipLimit
                      },
                      id: props.column.id,
                      projectId: props.project.id
                    }
                  })
                  setEditingWIPLimit(false)
                }}
                fullWidth
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </>
    )
  }
)

const actionCreators = {
  setColumn: setColumnA,
  setProject: setProjectA
}

export const ColumnHeader = connect(
  null,
  actionCreators
)(ColumnHeaderComp)
