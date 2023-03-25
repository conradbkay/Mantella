import { UserModel } from '../models/User'
import { ProjectModel } from '../models/Project'
import { v4 as uuid } from 'uuid'
import {
  createProjectReq,
  createProjectRes,
  deleteProjectReq,
  deleteProjectRes,
  editProjectReq,
  editProjectRes,
  leaveProjectReq,
  leaveProjectRes,
  removeMemberFromProjectReq,
  removeMemberFromProjectRes
} from './types'
import { Request, Response } from 'express'
import { router } from './router'
import { isAuthenticated } from '../passport'
import { ChatModel } from '../models/Chat'

export const createProject = async (
  req: createProjectReq,
  res: createProjectRes
) => {
  const creatingId = uuid()
  const listId = uuid()
  const chatId = uuid()

  if (req.user) {
    ;(req.user as any).projects.push(creatingId)

    const [created] = await Promise.all([
      ProjectModel.create({
        id: creatingId,
        name: req.body.name,
        ownerId: (req.user as any).id,
        users: [
          {
            id: (req.user as any).id,
            username: (req.user as any).username,
            email: (req.user as any).email,
            profileImg: (req.user as any).profileImg
          }
        ],
        lists: [
          {
            id: listId,
            name: 'Generic',
            taskIds: [[], [], []]
          }
        ],
        tasks: [],
        chatId: chatId,
        enrolledUsers: [],
        columnOrder: [listId],
        isPrivate: false
      }),
      (req.user as any).save(),
      ChatModel.create({ id: chatId, messages: [], projectId: creatingId })
    ])
    res.json({ project: created.toObject() })
  } else {
    throw new Error('user id not provided in token')
  }
}

router.post('/createProject', isAuthenticated, createProject)

export const editProject = async (req: editProjectReq, res: editProjectRes) => {
  if (req.body.id) {
    const project = await ProjectModel.findOne({ id: req.body.id })
    if (project) {
      project.name = req.body.newProj.name
        ? req.body.newProj.name
        : project.name

      const newProj = await project.save()

      if (newProj) {
        res.json({ project: newProj.toObject() })
      }
    }
  } else {
    throw new Error('not signed in')
  }
}

router.post('/editProject', isAuthenticated, editProject)

export const deleteProject = async (
  req: deleteProjectReq,
  res: deleteProjectRes
) => {
  const users = await UserModel.find({ projects: req.body.id })

  if (users) {
    for (const user of users) {
      user.projects = user.projects.filter((proj: any) => proj !== req.body.id)
      if (!user.projects.length) {
        throw new Error('cannot delete only project')
      }
      await user.save()
    }
  }

  const deleted = await ProjectModel.findOneAndDelete({ id: req.body.id })

  if (deleted) {
    res.json({
      id: deleted.id
    })
  } else {
    throw new Error('proj not found')
  }
}

router.post('/deleteProject', isAuthenticated, deleteProject)

export const leaveProject = async (
  req: leaveProjectReq,
  res: leaveProjectRes
) => {
  const id = (req.user as any).id
  if (id) {
    const project = await ProjectModel.findOne({ id: req.body.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }
    const user = await UserModel.findOneAndUpdate(
      { id: id },
      {
        $pull: {
          projects: project.id
        }
      }
    )

    if (user) {
      res.json({ project: project.toObject() })
    } else {
      throw new Error('could not join project')
    }
  } else {
    throw new Error('User not signed in')
  }
}

router.post('/leaveProject', isAuthenticated, leaveProject)

export const kickUserFromProject = async (
  req: removeMemberFromProjectReq,
  res: removeMemberFromProjectRes
) => {
  const id = req.body.userId
  if (id) {
    let project = await ProjectModel.findOne({ id: req.body.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }

    if (project.ownerId !== (req.user as any).id) {
      throw new Error('You cannot kick members from this project')
    }

    const kicking = await UserModel.findOne({ id })

    if (!kicking) {
      throw new Error('User does not exist')
    }
    kicking.projects = kicking.projects.filter(
      (proj: any) => proj !== project!.id
    )

    project.users.splice(
      project.users.findIndex((user) => user.id === id),
      1
    )

    let modifiedTasks = false

    for (let i = 0; i < project.tasks.length; i++) {
      if (project.tasks[i].assignedTo.includes(id)) {
        project.tasks[i].assignedTo.splice(
          project.tasks[i].assignedTo.indexOf(id),
          1
        )
        modifiedTasks = true
      }
    }

    if (modifiedTasks) {
      project.markModified('tasks')
    }

    project.markModified('users')
    project = await project.save()
    kicking.markModified('projects')
    await kicking.save()
    res.json({ project: project.toObject() })
  } else {
    throw new Error('User not signed in')
  }
}

router.post('/kickUser', isAuthenticated, kickUserFromProject)

export const getProjectById = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.id })

  if (proj) {
    return proj.toObject()
  } else {
    throw new Error('proj not found')
  }
}

router.get('/getProjectById', isAuthenticated, getProjectById)

export const shareProject = async (req: Request, res: Response) => {
  let user = await UserModel.findOne({ email: req.body.email })

  if (!user) {
    res.status(400).json({ message: 'User could not be found' })
    return
  }

  if (user.projects.includes(req.body.projectId)) {
    res.status(400).json({ message: 'User already in project' })
    return
  }

  let project = await ProjectModel.findOne({ id: req.body.projectId })

  if (!project) {
    throw new Error('project does not exist')
  }

  project.users.push({
    email: user.email,
    username: user.username,
    profileImg: user.profileImg || '',
    id: user.id
  })
  project.markModified('users')

  project = await project.save()

  user.projects.push(req.body.projectId)

  await user.save()

  res.status(200).json({ message: 'Success', project })
}

router.post('/shareProject', isAuthenticated, shareProject)

export const getProjectMembers = async (req: Request, res: Response) => {
  let users = await UserModel.find({ projects: { $in: [req.body.projectId] } })

  res.json({ users })
}

router.post('/getProjectMembers', isAuthenticated, getProjectMembers)
