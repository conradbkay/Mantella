import axios from 'axios'
export const APICreateProject = async (name: string) => {
  try {
    const res = await axios.post('/createProject', { name })
    return res.data.project
  } catch (err) {
    console.error(err)
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
