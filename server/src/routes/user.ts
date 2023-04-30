import { router } from './router'
import { Request, Response } from 'express'
import { isAuthenticated } from '../passport'
import { ProjectModel } from '../models/Project'
import { UserModel } from '../models/User'
import bcrypt from 'bcryptjs'

// TODO: we could return the updated project, but they can just refresh
export const setEmail = async (req: Request, res: Response) => {
  const user = req.user as any

  const withEmail = await UserModel.findOne({ email: req.body.email })

  if (withEmail) {
    res.status(400).json({ error: 'Email already in use' })
    return
  }

  user.email = req.body.email

  const projects = await ProjectModel.find({
    users: { $elemMatch: { id: user.id } }
  })

  for (let project of projects) {
    const idx = project.users.findIndex((u) => u.id === user.id)
    project.users[idx].email = req.body.email
    project.markModified('users')

    project.save()
  }

  await user.save()

  res.json({ email: req.body.email })
}

export const setName = async (req: Request, res: Response) => {
  const user = req.user as any

  user.username = req.body.username

  const projects = await ProjectModel.find({
    users: { $elemMatch: { id: user.id } }
  })

  for (let project of projects) {
    const idx = project.users.findIndex((u) => u.id === user.id)
    project.users[idx].username = req.body.username
    project.markModified('users')
    project.save()
  }

  await user.save()

  res.json({ name: user.username })
}

const SALT_LENGTH = process.env.NODE_ENV === 'production' ? 10 : 4

export const setPassword = async (req: Request, res: Response) => {
  const user = req.user as any

  const salt = await bcrypt.genSalt(SALT_LENGTH)
  const password = await bcrypt.hash(req.body.password, salt)

  user.password = password
  user.guest = false

  await user.save()

  res.json({ user })
}

router.post('/setEmail', isAuthenticated, setEmail)
router.post('/setName', isAuthenticated, setName)
router.post('/setPassword', isAuthenticated, setPassword)
