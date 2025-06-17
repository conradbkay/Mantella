import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { OPEN_SNACKBAR } from '../store/snackbar'
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useShareProjectMutation,
  useKickUserMutation
} from '../store/api'
import { useNavigate } from '@tanstack/react-router'

export const useCreateProjectAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [createProjectMutation] = useCreateProjectMutation()

  return async (name: string = 'New Project', navigate: any) => {
    try {
      const res = await createProjectMutation({ name }).unwrap()
      if (res && res.id) {
        navigate({ to: '/project/$id', params: { id: res.id } })
        dispatch(
          OPEN_SNACKBAR({
            message: 'Project Created Successfully',
            variant: 'success'
          })
        )
      }
    } catch (err) {
      dispatch(
        OPEN_SNACKBAR({
          message: 'Project Could Not Be Created',
          variant: 'warning'
        })
      )
    }
  }
}

export const useDeleteProjectAction = () => {
  const navigate = useNavigate()
  const [deleteProjectMutation] = useDeleteProjectMutation()

  return (id: string) => {
    deleteProjectMutation(id)
    navigate({ to: '/dashboard' })
  }
}

export const useShareProjectAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [shareProjectMutation] = useShareProjectMutation()

  return async (projectId: string, email: string) => {
    try {
      await shareProjectMutation({
        projectId,
        email
      }).unwrap()

      dispatch(OPEN_SNACKBAR({ message: 'User invited', variant: 'success' }))
    } catch (err) {
      dispatch(
        OPEN_SNACKBAR({
          message:
            'User could not be invited, did you enter the correct email?',
          variant: 'error'
        })
      )
    }
  }
}

export const useKickUserAction = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [kickUserMutation] = useKickUserMutation()

  return async (projectId: string, kickingId: string) => {
    try {
      await kickUserMutation({ projectId, userId: kickingId }).unwrap()
    } catch (err) {
      dispatch(
        OPEN_SNACKBAR({
          message: 'User could not be kicked, do you have correct permissions?',
          variant: 'error'
        })
      )
    }
  }
}
