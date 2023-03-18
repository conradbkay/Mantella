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

export const login = async (
  req: loginReq,
  res: loginRes,
  next: NextFunction
) => {
  try {
    const projects = await ProjectModel.find({
      id: (req.user as any).projects
    }).lean()

    res.json({
      user: {
        ...(req.user as any).toObject(),
        password: undefined,
        _id: undefined,
        projects: projects
      }
    } as loginResObj)
  } catch (err) {
    next(err)
  }
}

const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4

export const register = async (req: registerReq, res: registerRes) => {
  try {
    const salt = await bcrypt.genSalt(SALT_LENGTH)
    const password = await bcrypt.hash(req.body.password, salt)

    const [projectId, userId] = generateIds(2)

    const [project, newUser] = await Promise.all([
      ProjectModel.create(
        generateDefaultProject(
          {
            id: userId,
            email: req.body.email,
            username: req.body.username,
            profileImg:
              'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
          },
          projectId
        )
      ),
      await UserModel.create({
        ...generateGuestUser(projectId, userId),
        password,
        email: req.body.email,
        username: req.body.username
      })
    ])

    req.login(newUser, (err: any) => {
      if (err) {
        console.log('could not passport login during signup', err)
      }
    })

    res.json({
      user: {
        ...newUser.toObject(),
        password: undefined,
        _id: undefined,
        projects: [project.toObject()]
      }
    } as registerResObj)
  } catch (err) {
    throw new Error('Could not register, is that email address already in use?')
  }
}
export const logout = async (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.log(err)
        res.status(400).send('unable to log out')
      }

      res.redirect('/')
    })
  } else {
    res.end()
  }
}

export const guestLogin = async (req: guestLoginReq, res: guestLoginRes) => {
  try {
    const [projectId, userId] = generateIds(2)

    const [project, user] = await Promise.all([
      ProjectModel.create(
        generateDefaultProject(
          {
            email: 'No Email Registered',
            username: 'Guest',
            id: userId,
            profileImg:
              'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
          },
          projectId
        )
      ),
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
