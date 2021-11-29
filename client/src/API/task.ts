import axios from 'axios'

export const APICreateTask = async (
  projId: string,
  listId: string,
  taskInfo: any
) => {
  const res = await axios.post('/createTask', { projId, listId, taskInfo })

  return res.data
}

export type DragTaskInfo = {
  projectId: string
  oldListId: string
  newListId: string
  id: string
  newProgress: number
  newIndex: number
}

export const APIDragTask = async (info: DragTaskInfo) => {
  const res = await axios.post('/dragTask', info)
  console.log(res.data)
  return res.data
}
