import { comparePassword, UserModel } from './models/User'

export const isAuthenticated = (req: any, res: any, next: any) => {
  console.log('checking ', req.user)
  if (req.user) return next()
  else
    return res.status(401).json({
      error: 'User not authenticated'
    })
}

export const passportStrategy = async (
  email: string,
  password: string,
  done: Function
) => {
  try {
    console.log('passportStrategy ', email, password)
    const user = await UserModel.findOne({ email })
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

export const serializeUser = (user: any, done: any) => {
  console.log('serializing ', user.id)
  done(null, user.id)
}

export const deserializeUser = async (id: string, done: any) => {
  try {
    console.log('deserializing ', id)
    const user = await UserModel.findOne({ id })
    done(null, user?.toObject())
  } catch (err) {
    done(err)
  }
}
