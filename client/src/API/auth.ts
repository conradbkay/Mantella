import axios from 'axios'

export const APILogin = async (
  email: string,
  password: string,
  persist: boolean
) => {
  try {
    const res = await axios.post('/login', {
      email,
      password,
      persist
    })
    return res.data.user
  } catch (err) {
    console.error(err)
  }
}

export const APICookieLogin = async () => {
  try {
    const res = await axios.post('/cookieLogin', {}, { withCredentials: true })

    return res.data.user
  } catch (err) {
    // an error just means they don't have a login session
  }
}

export const APIRegister = async (registerData: {
  email: string
  username: string
  password: string
  persist: boolean
}) => {
  try {
    const res = await axios.post('/register', registerData)
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

// side effect of page refresh
export const APILogout = async () => {
  try {
    await axios.post('/logout')
    window.location.reload()
  } catch (err) {
    console.error(err)
    window.location.reload()
  }
}
