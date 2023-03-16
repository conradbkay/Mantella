import { TList } from '../types/project'
import axios from 'axios'

export const APICreateList = async (
  projectId: string,
  name: string
): Promise<TList> => {
  const res = await axios.post('/createList', { projId: projectId, name })
  return res.data.list
}
