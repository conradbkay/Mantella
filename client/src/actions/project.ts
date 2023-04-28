import {
  APICreateProject,
  APIDeleteProject,
  APIEditProject,
  APIKickUser,
  APIShareProject
} from '../API/project'
import { SET_PROJECT } from '../store/projects'
import { OPEN_SNACKBAR } from '../store/snackbar'
import { AppDispatch } from '../store/store'
import { TProject } from '../types/project'

export const createProject = async (
  dispatch: AppDispatch,
  name: string = 'New Project',
  push: (addr: string) => void
) => {
  const res = await APICreateProject(name)
  if (res && res.id) {
    dispatch(
      SET_PROJECT({
        id: res.id,
        project: res
      })
    )

    push('/project/' + res.id)
    dispatch(
      OPEN_SNACKBAR({
        message: 'Project Created Successfully',
        variant: 'success'
      })
    )
  } else {
    dispatch(
      OPEN_SNACKBAR({
        message: 'Project Could Not Be Created',
        variant: 'warning'
      })
    )
  }
}

export const setProjectName = (
  dispatch: AppDispatch,
  project: TProject,
  name: string = 'Untitled Project'
) => {
  dispatch(
    SET_PROJECT({
      id: project.id,
      project: { ...project, name }
    })
  )

  APIEditProject(project.id, { name })
}

export const deleteProject = (
  dispatch: AppDispatch,
  push: (addr: string) => void,
  id: string
) => {
  dispatch(SET_PROJECT({ id, project: undefined }))
  APIDeleteProject(id)
  push('/dashboard')
}

export const shareProject = async (
  dispatch: AppDispatch,
  projectId: string,
  email: string
) => {
  try {
    const res = await APIShareProject({
      email,
      projectId
    })

    const newProj = res[1]

    dispatch(SET_PROJECT({ id: newProj.id, project: newProj }))

    dispatch(OPEN_SNACKBAR({ message: 'User invited', variant: 'success' }))
  } catch (err) {
    dispatch(
      OPEN_SNACKBAR({
        message: 'User could not be invited, did you enter the correct email?',
        variant: 'error'
      })
    )
  }
}

export const kickUser = async (
  dispatch: AppDispatch,
  projectId: string,
  kickingId: string
) => {
  try {
    const res = await APIKickUser(projectId, kickingId)

    dispatch(SET_PROJECT({ id: res.project.id, project: res.project }))
  } catch (err) {
    dispatch(
      OPEN_SNACKBAR({ message: 'User could not be kicked', variant: 'error' })
    )
  }
}
