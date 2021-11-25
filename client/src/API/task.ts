import axios from 'axios'

export const APICreateTask = async (
  projId: string,
  listId: string,
  taskInfo: any
) => {
  const res = await axios.post('/createTask', { projId, listId, taskInfo })

  return res.data
}
