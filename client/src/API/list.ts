import { TList } from '../types/project'
import axios from 'axios'

export const APICreateList = async (
  projectId: string,
  name: string
): Promise<TList> => {
  const res = await axios.post('/createList', { projId: projectId, name })
  return res.data.list
}

export const APIReplaceListIds = async (
  projectId: string,
  newLists: { id: string; taskIds: [string[], string[], string[]] }[]
) => {
  const res = await axios.post('/replaceListIds', {
    projectId: projectId,
    lists: newLists
  })
  return res.data
}
