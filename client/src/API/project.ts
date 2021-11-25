import axios from 'axios'
export const APICreateProject = async (name: string) => {
  try {
    const res = await axios.post('/createProject', { name })
    return res.data.projects
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
