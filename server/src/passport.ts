import { comparePassword, UserModel } from './models/User'

export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.user) return next()
  else
    return res.status(401).json({
      error: 'User not authenticated'
    })
}

export const passportStrategy = async (
  username: string,
  password: string,
  done: Function
) => {
  try {
    const user = await UserModel.findOne({ username: username })
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }
    const matches = await comparePassword(password, user.password!)
    if (!matches) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}
