import axios from 'axios'

export const APICreateChannel = async (projId: string, name: string) => {
  const res = await axios.post('/createChannel', { projId, name })
  return res.data.project
}

export const APIEditChannel = async (
  projId: string,
  id: string,
  name: String
) => {
  const res = await axios.post('/editChannel', { projId, id, name })
  return res.data
}

export const APIDeleteChannel = async (projId: string, id: string) => {
  const res = await axios.post('/deleteChannel', { projId, id })
  return res.data.project
}
