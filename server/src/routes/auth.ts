import bcrypt from 'bcryptjs'
import { UserModel } from '../models/User'
import { ProjectModel } from '../models/Project'
import { generateDefaultProject, generateGuestUser, generateIds } from '../data'
import {
  guestLoginReq,
  guestLoginRes,
  guestLoginResObj,
  loginReq,
  loginRes,
  loginResObj,
  registerReq,
  registerRes,
  registerResObj
} from './types'
import { NextFunction, Request, Response } from 'express'
import { router } from './router'
import passport from 'passport'
import { isAuthenticated } from '../passport'

export const login = async (
  req: loginReq,
  res: loginRes,
  next: NextFunction
) => {
  try {
    const [user, projects] = await Promise.all([
      UserModel.findOne({ email: req.user.email }).lean(),
      ProjectModel.find({ id: req.user.projects }).lean()
    ])

    res.json({
      user: {
        ...user,
        projects: projects
      }
    } as loginResObj)
  } catch (err) {
    next(err)
  }
}

/* for some reason session: true is required for persistent login */
router.post('/login', passport.authenticate('local', { session: true }), login)
router.post('/cookieLogin', isAuthenticated, login)

const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4

export const register = async (req: registerReq, res: registerRes) => {
  try {
    const salt = await bcrypt.genSalt(SALT_LENGTH)
    const password = await bcrypt.hash(req.body.password, salt)

    const [projectId, userId] = generateIds(2)

    const [project, newUser] = await Promise.all([
      ProjectModel.create(generateDefaultProject(userId, projectId)),
      await UserModel.create({
        ...generateGuestUser(projectId, userId),
        password,
        email: req.body.email,
        username: req.body.username
      })
    ])

    res.json({
      user: {
        ...newUser.toObject(),
        projects: [project.toObject()]
      }
    } as registerResObj)
  } catch (err) {
    throw new Error('Could not register, is that email address already in use?')
  }
}

router.post('/register', register)

// TODO: login doesn't work
export const logout = async (req: Request, res: Response) => {
  req.session!.destroy((err) => {
    res.redirect('/')
  })
}

router.post('/logout', logout)

export const guestLogin = async (req: guestLoginReq, res: guestLoginRes) => {
  try {
    const [projectId, userId] = generateIds(2)

    const [project, user] = await Promise.all([
      ProjectModel.create(generateDefaultProject(userId, projectId)),
      await UserModel.create(generateGuestUser(projectId, userId))
    ])

    res.json({
      user: {
        ...user.toObject(),
        projects: [project.toObject()]
      }
    } as guestLoginResObj)
  } catch (err) {
    throw new Error('Could not create guest, sorry!')
  }
}

router.post('/guestLogin', guestLogin)