import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core'
import { connect } from 'react-redux'
import { TProject } from '../../types/project'
import { setProjectA, setSwimlaneA } from '../../store/actions/project'
import { Delete, Add } from '@material-ui/icons'
import {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  DeleteSwimlaneMutation,
  DeleteSwimlaneMutationVariables,
  EditSwimlaneMutation,
  EditSwimlaneMutationVariables,
  CreateSwimlaneMutation,
  CreateSwimlaneMutationVariables
} from '../../graphql/types'
import { GQL_DELETE_PROJECT } from '../../graphql/mutations/project'
import { useMutation } from '@apollo/react-hooks'
import {
  GQL_DELETE_SWIMLANE,
  GQL_EDIT_SWIMLANE,
  GQL_CREATE_SWIMLANE
} from '../../graphql/mutations/swimlane'
import { resToNiceSwimlanes, resToNiceProject } from '../../API/utils'

type TProps = {
  onClose: () => void
  project: TProject
} & typeof actionCreators

const CProjectSettings = (props: TProps) => {
  const [hasClicked, setClicked] = React.useState(false)

  const [deleteProjectExec] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(GQL_DELETE_PROJECT, {
    onCompleted: ({ deleteProject }) => {
      if (deleteProject && deleteProject.id) {
        props.setProject({ id: deleteProject.id, newProj: null })
      }
    }
  })

  /*
  const [setCommentExec] = useMutation<
    SetCommentMutation,
    SetCommentMutationVariables
  >(GQL_SET_COMMENT, {
    onCompleted: ({ setComment }) => {}
  })

  const [setSubtaskExec] = useMutation<
    SetSubtaskMutation,
    SetSubtaskMutationVariables
  >(GQL_SET_SUBTASK, {
    onCompleted: ({ setSubtask }) => {}
  })
  */

  const [deleteSwimlaneExec] = useMutation<
    DeleteSwimlaneMutation,
    DeleteSwimlaneMutationVariables
  >(GQL_DELETE_SWIMLANE, {
    onCompleted: ({ deleteSwimlane }) => {
      if (deleteSwimlane && deleteSwimlane.project) {
        props.setProject({
          newProj: resToNiceProject(deleteSwimlane.project),
          id: deleteSwimlane.project.id
        })
      }
    }
  })

  const [editSwimlaneExec] = useMutation<
    EditSwimlaneMutation,
    EditSwimlaneMutationVariables
  >(GQL_EDIT_SWIMLANE, {
    onCompleted: ({ editSwimlane }) => {
      if (editSwimlane && editSwimlane.swimlane) {
        const edited = resToNiceSwimlanes([editSwimlane.swimlane])[
          editSwimlane.swimlane.id
        ]

        props.setSwimlane({
          newSwimlane: edited,
          projectId: props.project.id,
          id: edited.id
        })
      }
    }
  })

  const [createSwimlaneExec] = useMutation<
    CreateSwimlaneMutation,
    CreateSwimlaneMutationVariables
  >(GQL_CREATE_SWIMLANE, {
    onCompleted: ({ createSwimlane }) => {
      if (createSwimlane && createSwimlane.project) {
        props.setProject({
          newProj: resToNiceProject(createSwimlane.project),
          id: createSwimlane.project.id
        })
      }
    }
  })

  return (
    <Dialog onClose={props.onClose} open={true}>
      <div style={{ minWidth: '500px' }} />
      <DialogTitle>Project Settings</DialogTitle>
      <DialogContent>
        <Typography style={{ fontSize: 20 }}>
          <span style={{ color: 'red', marginRight: 8 }}>Danger Zone!</span>
        </Typography>
        <ListItem>
          <ListItemAvatar>
            <Delete />
          </ListItemAvatar>
          <ListItemText
            primary="Delete this project"
            secondary="Once deleted, projects cannot be restored"
          />
          <Button
            size="medium"
            onClick={() => {
              if (hasClicked) {
                deleteProjectExec({ variables: { id: props.project.id } })
              } else {
                setClicked(true)
              }
            }}
            color="primary"
            variant={hasClicked ? 'contained' : 'outlined'}
            style={{ marginLeft: 16, maxHeight: 36, marginTop: 'auto' }}
          >
            {hasClicked ? 'Confirm' : 'Delete'}
          </Button>
        </ListItem>
        <Typography
          style={{
            margin: '10px 0px',
            fontSize: 20
          }}
          variant="subtitle1"
        >
          Swimlanes
        </Typography>
        {props.project.swimlaneOrder
          .map(swimlaneId => props.project.swimlanes[swimlaneId])
          .map(swimlane => (
            <div key={swimlane.id} style={{ display: 'flex' }}>
              <TextField
                fullWidth
                onChange={e => {
                  props.setSwimlane({
                    newSwimlane: { ...swimlane, name: e.target.value },
                    projectId: props.project.id,
                    id: swimlane.id
                  })
                }}
                onBlur={() => {
                  editSwimlaneExec({
                    variables: {
                      projId: props.project.id,
                      swimId: swimlane.id,
                      newSwim: { name: swimlane.name }
                    }
                  })
                }}
                value={swimlane.name}
                style={{ marginRight: 16 }}
              />
              <IconButton
                onClick={() => {
                  deleteSwimlaneExec({
                    variables: { projId: props.project.id, swimId: swimlane.id }
                  })
                }}
              >
                <Delete />
              </IconButton>
            </div>
          ))}
        <IconButton
          onClick={() => {
            createSwimlaneExec({
              variables: { projId: props.project.id, name: 'Swimlane' }
            })
          }}
          style={{ backgroundColor: '#3f51b5' }}
        >
          <Add style={{ color: 'white' }} />
        </IconButton>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Continue</Button>
      </DialogActions>
    </Dialog>
  )
}

const actionCreators = {
  setProject: setProjectA,
  setSwimlane: setSwimlaneA
}

export const ProjectSettings = connect(
  null,
  actionCreators
)(CProjectSettings)
