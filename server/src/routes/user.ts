import { router } from './router'
import { Request, Response } from 'express'
import { isAuthenticated } from '../passport'
import { ProjectModel } from '../models/Project'
import { UserModel } from '../models/User'

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

router.post('/setEmail', isAuthenticated, setEmail)
router.post('/setName', isAuthenticated, setName)
