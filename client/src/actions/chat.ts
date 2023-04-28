import { APICreateChannel, APIDeleteChannel, APIEditChannel } from '../API/chat'
import { SET_PROJECT } from '../store/projects'
import { AppDispatch } from '../store/store'
import { TProject } from '../types/project'

export const createChannel = async (
  dispatch: AppDispatch,
  projId: string,
  name: string
) => {
  try {
    const project: TProject = (await APICreateChannel(projId, name)) as any

    dispatch(SET_PROJECT({ project, id: project.id }))

    return project.channels[project.channels.length - 1]
  } catch (err) {
    console.log(err)
  }

  return null
}

export const editChannel = async (
  dispatch: AppDispatch,
  projId: string,
  id: string,
  name: string
) => {
  try {
    const project: TProject = (await APIEditChannel(projId, id, name)) as any

    dispatch(SET_PROJECT({ project, id: project.id }))
  } catch (err) {
    console.log(err)
  }

  return null
}

export const deleteChannel = async (
  dispatch: AppDispatch,
  projId: string,
  id: string
) => {
  try {
    const project = await APIDeleteChannel(projId, id)

    dispatch(SET_PROJECT({ project, id: projId }))
  } catch (err) {
    console.log(err)
  }
}
