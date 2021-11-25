import { comparePassword } from '../models/User'
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

export const login = async (
  req: loginReq,
  res: loginRes,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const [user, projects] = await Promise.all([
        UserModel.findOne({ email: req.user.email }),
        ProjectModel.find({ id: req.user.projects })
      ])

      res.json({
        user: {
          ...user,
          projects: projects
        }
      } as loginResObj)
    } else if (req.body && req.body.email) {
      const user = await UserModel.findOne({ email: req.body.email })
      if (!user) {
        throw new Error('That user does not exist')
      }
      const passwordMatch = await comparePassword(
        req.body.password,
        user.password! // user always has a password since they are not a guest
      )
      if (!passwordMatch) {
        throw new Error('Incorrect Password')
      }

      const projects = await ProjectModel.find({ id: user.projects })

      res.json({
        user: {
          ...user,
          projects: projects
        }
      } as loginResObj)
    } else {
      res.end()
    }
  } catch (err) {
    next(err)
  }
}

router.post('/login', login)

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
        ...newUser,
        projects: [project]
      }
    } as registerResObj)
  } catch (err) {
    throw new Error('Could not register, is that email address already in use?')
  }
}

router.post('/register', register)

export const logout = async (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
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
        ...user,
        projects: [project]
      }
    } as guestLoginResObj)
  } catch (err) {
    throw new Error('Could not create guest, sorry!')
  }
}

router.post('/guestLogin', guestLogin)
