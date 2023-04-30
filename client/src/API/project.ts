import axios from 'axios'
import { TProject, TRole } from '../types/project'

export const APICreateProject = async (name: string) => {
  try {
    const res = await axios.post('/createProject', { name })
    return res.data.project
  } catch (err) {
    console.error(err)
  }
}

export const APIEditProject = async (
  projectId: string,
  newProj: { name: string }
) => {
  try {
    const res = await axios.post('/editProject', { id: projectId, newProj })
    return res.data.project
  } catch (err) {
    console.log(err)
  }
}

export const APISetSubtask = async (data: {
  projId: string
  taskId: string
  subtaskId: string
  info?: { name: string; completed: boolean }
}) => {
  const res = await axios.post('/setSubtask', data)

  return res.data
}

export const APIShareProject = async (data: {
  projectId: string
  email: string
}) => {
  const res = await axios.post('/shareProject', data)

  return [res.status, res.data.project]
}

export const APIDeleteProject = async (projectId: string) => {
  try {
    const res = await axios.post('/deleteProject', { id: projectId })
    return res.data.id
  } catch (err) {
    console.log(err)
  }
}

export const APIKickUser = async (projectId: string, kickingId: string) => {
  const res = await axios.post('/kickUser', { projectId, userId: kickingId })

  return res.data
}

export const APISetRole = async (
  projectId: string,
  role: TRole | string
): Promise<TProject> => {
  const res = await axios.post('/setRole', { projectId, role })

  return res.data.project as TProject
}

export const APISetUserRoles = async (
  projectId: string,
  userId: string,
  roles: string[]
): Promise<TProject> => {
  const res = await axios.post('/setUserRoles', { projectId, userId, roles })

  return res.data.project as TProject
}

export const APIMoveRole = async (
  projectId: string,
  from: number,
  to: number
) => {
  const res = await axios.post('/moveRole', { projectId, from, to })

  return res
}
