import { comparePassword } from '../models/User'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/User'
import { ProjectModel } from '../models/Project'
import { taskObjects, projectData } from '../data'
import jsonwebtoken from 'jsonwebtoken'
import uuid from 'uuid'
import {
  guestLoginReq,
  guestLoginRes,
  loginReq,
  loginRes,
  loginWithCookieReq,
  loginWithCookieRes,
  registerReq,
  registerRes
} from './types'
import { Request, Response } from 'express'
import { router } from './router'

const generateCookieToken = (id: string) => {
  return jsonwebtoken.sign({ id }, process.env.PRIVATE!, {
    expiresIn: '1d'
  })
}

export const cookieLogin = async (
  req: loginWithCookieReq,
  res: loginWithCookieRes
) => {
  if (!req.signedCookies.userId) {
    throw new Error('Unauthenticated user')
  }

  const user = await UserModel.findOne({
    id: req.signedCookies.userId.id
  })

  if (!user) {
    throw new Error('Token Corrupt!')
  }

  const projects = await ProjectModel.find({ id: user.projects })

  res.json({
    user: {
      ...(user as any).toObject(),
      projects: projects.map((proj) => proj.toObject())
    }
  })
}

router.post('/cookieLogin', cookieLogin)

export const login = async (req: loginReq, res: loginRes) => {
  const user = await UserModel.findOne({ email: req.body.email })
  if (user) {
    const passwordMatch = await comparePassword(
      req.body.password,
      user.password! // user always has a password since they are not a guest
    )

    if (passwordMatch) {
      const token = generateCookieToken(user.id)

      res.cookie('auth-token', token, { signed: true, httpOnly: true })

      const projects = await ProjectModel.find({ id: user.projects })

      res.json({
        user: {
          ...(user as any).toObject(),
          projects: projects.map((proj) => proj.toObject())
        }
      })
    }
    throw new Error('Incorrect Password')
  } else {
    throw new Error('User with Email does not exist!')
  }
}

router.post('/login', login)

export const register = async (req: registerReq, res: registerRes) => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  const projectId = uuid()
  const userId = uuid()

  const ids: string[] = []

  for (let i = 0; i < 16; i += 1) {
    ids.push(uuid())
  }

  await ProjectModel.create(
    projectData(ids, taskObjects(ids), userId, projectId)
  )

  let newUser = await UserModel.create({
    password,
    id: userId,
    email: req.body.email,
    username: req.body.username,
    projects: [projectId],
    profileImg:
      'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
  })

  newUser = newUser.toObject() as any

  // TODO: Allow users to opt out of being remembered
  const token = generateCookieToken(newUser.id)
  res.cookie('auth-token', token, { httpOnly: true })

  if (newUser) {
    let projects: any = await ProjectModel.find({
      id: { $in: newUser.projects }
    })

    projects = projects.map((proje: any) => proje.toObject())

    res.json({
      user: {
        ...newUser,
        projects: projects
      }
    })
  } else {
    throw new Error('email already in use')
  }
}

router.post('/register', register)

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('auth-token')
  res.json({ message: 'logged out' })
}

router.post('/logout', logout)

export const guestLogin = async (req: guestLoginReq, res: guestLoginRes) => {
  const projectId = uuid()
  const userId = uuid()

  const ids: string[] = []

  for (let i = 0; i < 16; i += 1) {
    ids.push(uuid())
  }

  await ProjectModel.create(
    projectData(ids, taskObjects(ids), userId, projectId)
  )

  let newUser = await UserModel.create({
    id: userId,
    email: uuid() + '.gmail.com',
    username: 'Guest',
    projects: [projectId],
    profileImg:
      'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
  })

  if (newUser) {
    let projects: any = await ProjectModel.find({
      id: { $in: newUser.projects }
    })

    projects = projects.map((proje: any) => proje.toObject())

    res.json({
      user: {
        ...newUser.toObject(),
        projects: projects
      }
    })
  } else {
    throw new Error(
      'Could not create guest, try signing in or registering, sorry'
    )
  }
}

router.post('/guestLogin', guestLogin)
