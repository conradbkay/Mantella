import { comparePassword, UserModel } from './models/User'

export const passportStrategy = async (
  username: string,
  password: string,
  done: Function
) => {
  try {
    const user = UserModel.findOne({ username: username })
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
