import axios from 'axios'

export const APILogin = async (
  email?: string,
  password?: string,
  isCookie?: boolean
) => {
  try {
    const res = await axios.post(isCookie ? '/cookieLogin' : '/login', {
      email,
      password
    })
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

export const APILogout = async () => {
  try {
    await axios.post('/logout')
    location.reload()
  } catch (err) {
    console.error(err)
  }
}
