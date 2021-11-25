import axios from 'axios'

export const APILogin = async (email?: string, password?: string) => {
  try {
    const res = await axios.post('/login', { email, password })
    return res.data.user
  } catch (err) {
    console.error(err)
  }
}

export const APIRegister = async (data: {
  email: string
  username: string
  password: string
}) => {
  try {
    const res = await axios.post('/register', data)
    return res.data.user
  } catch (err) {
    console.error(err)
  }
}

export const APIGuestLogin = async () => {
  try {
    const res = await axios.post('/guestLogin')
    return res.data.user
  } catch (err) {
    console.error(err)
  }
}
