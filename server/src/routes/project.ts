import { UserModel } from '../models/User'
import { ProjectModel } from '../models/Project'
import { nanoid } from 'nanoid'
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
import { defaultColors } from '../data'
import { resolveProjectUsers } from '../utils/userResolver'

export const createProject = async (
  req: createProjectReq,
  res: createProjectRes
) => {
  const creatingId = nanoid()
  const listId = nanoid()
  const chatId = nanoid()
  const adminRoleId = nanoid()

  if (req.user) {
    ;(req.user as any).projects.push(creatingId)

    const [created] = await Promise.all([
      ProjectModel.create({
        colors: defaultColors,
        privacy: {
          public: req.body.public || false
        },
        roles: [
          {
            name: 'Admin',
            color: '#FF0000',
            id: adminRoleId
          }
        ],
        id: creatingId,
        name: req.body.name,
        ownerId: (req.user as any).id,
        users: [
          {
            id: (req.user as any).id,
            roles: [adminRoleId]
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
        channels: [[chatId, 'General']],
        enrolledUsers: [],
        columnOrder: [listId],
        isPrivate: false
      }),
      (req.user as any).save(),
      ChatModel.create({ id: chatId, messages: [], projectId: creatingId })
    ])

    // Resolve users before returning
    const resolvedProject = await resolveProjectUsers(created.toObject())
    res.json({ project: resolvedProject })
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

      project.colors = req.body.newProj.colors
        ? req.body.newProj.colors
        : project.colors

      const newProj = await project.save()

      if (newProj) {
        const resolvedProject = await resolveProjectUsers(newProj.toObject())
        res.json({ project: resolvedProject })
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
    const resolvedProject = await resolveProjectUsers(project.toObject())
    res.json({ project: resolvedProject })
  } else {
    throw new Error('User not signed in')
  }
}

router.post('/kickUser', isAuthenticated, kickUserFromProject)

export const getProjectById = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.id })

  if (proj) {
    const resolvedProject = await resolveProjectUsers(proj.toObject())
    res.json({ project: resolvedProject })
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
    id: user.id,
    roles: []
  })
  project.markModified('users')

  project = await project.save()

  user.projects.push(req.body.projectId)

  await user.save()

  // Resolve users before returning
  const resolvedProject = await resolveProjectUsers(project.toObject())
  res.status(200).json({ message: 'Success', project: resolvedProject })
}

router.post('/shareProject', isAuthenticated, shareProject)

export const getProjectMembers = async (req: Request, res: Response) => {
  let users = await UserModel.find({ projects: { $in: [req.body.projectId] } })

  res.json({ users })
}

router.post('/getProjectMembers', isAuthenticated, getProjectMembers)

export const setRole = async (req: Request, res: Response) => {
  const project = await ProjectModel.findOne({ id: req.body.projectId })

  if (!project) {
    throw new Error('project does not exist')
  }

  const role = req.body.role as any

  const roleIdx = project.roles.findIndex((compare) => {
    return typeof role === 'string'
      ? compare.id === role
      : compare.id === role.id
  })

  if (roleIdx === -1) {
    project.roles.push(role)
  } else if (typeof role === 'string') {
    project.roles.splice(roleIdx, 1)
  } else {
    project.roles[roleIdx] = role
  }

  project.markModified('roles')
  const savedProject = await project.save()

  const resolvedProject = await resolveProjectUsers(savedProject.toObject())
  res.json({ project: resolvedProject })
}

router.post('/setRole', isAuthenticated, setRole)

export const setUserRoles = async (req: Request, res: Response) => {
  const project = await ProjectModel.findOne({ id: req.body.projectId })

  if (!project) {
    throw new Error('project does not exist')
  }

  const userIdx = project.users.findIndex((compare) => {
    return compare.id === req.body.userId
  })

  project.users[userIdx].roles = req.body.roles

  project.markModified('users')
  const savedProject = await project.save()

  const resolvedProject = await resolveProjectUsers(savedProject.toObject())
  res.json({ project: resolvedProject })
}

router.post('/setUserRoles', isAuthenticated, setUserRoles)

export const moveRole = async (req: Request, res: Response) => {
  const project = await ProjectModel.findOne({ id: req.body.projectId })

  if (!project) {
    throw new Error('project does not exist')
  }

  project.roles.splice(
    req.body.to,
    0,
    project.roles.splice(req.body.from, 1)[0]
  )

  project.markModified('roles')
  await project.save()

  res.json({ message: 'done' })
}

router.post('/moveRole', isAuthenticated, moveRole)
