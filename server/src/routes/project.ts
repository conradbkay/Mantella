import { UserModel } from '../models/User'
import { ProjectModel } from '../models/Project'
import uuid from 'uuid'
import {
  createProjectReq,
  createProjectRes,
  deleteProjectReq,
  deleteProjectRes,
  editProjectReq,
  editProjectRes,
  joinProjectReq,
  joinProjectRes,
  leaveProjectReq,
  leaveProjectRes,
  removeMemberFromProjectReq,
  removeMemberFromProjectRes
} from './types'
import { Request, Response } from 'express'
import { router } from './router'
import { isAuthenticated } from '../passport'

const generateColumn = (name: string, id: string, isInProgress: boolean) => ({
  id,
  name,
  collapsedUsers: [],
  inProgress: isInProgress,
  taskIds: []
})

export const createProject = async (
  req: createProjectReq,
  res: createProjectRes
) => {
  const creatingId = uuid()
  const listId = uuid()
  const user = await UserModel.findOne({ id: req.user.id })
  if (user) {
    user.projects.push(creatingId)

    const [created] = await Promise.all([
      ProjectModel.create({
        id: creatingId,
        name: req.body.name,
        ownerId: user.id,
        users: [user.id],
        columns: [
          generateColumn('Created', uuid(), false),
          generateColumn('In Progress', uuid(), true),
          generateColumn('Created', uuid(), false)
        ],
        lists: [
          {
            id: listId,
            name: 'Generic',
            taskIds: []
          }
        ],
        tasks: [],
        enrolledUsers: [],
        columnOrder: [listId],
        isPrivate: false
      }),
      user.save()
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
  const user = await UserModel.findOne({ id: req.user.id })

  if (user) {
    user.projects = user.projects.filter((proj: any) => proj !== req.body.id)
    if (!user.projects.length) {
      throw new Error('cannot delete only project')
    }
    await user.save()
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

export const joinProject = async (req: joinProjectReq, res: joinProjectRes) => {
  const id = req.user.id
  if (id) {
    const project = await ProjectModel.findOne({ id: req.body.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }
    const user = await UserModel.findOneAndUpdate(
      { id: id },
      {
        $push: {
          projects: project.id
        }
      }
    )

    if (user) {
      res.json({ project: project.toObject() })
    }
    throw new Error('could not join project')
  } else {
    throw new Error('User not signed in')
  }
}

router.post('/joinProject', isAuthenticated, joinProject)

export const leaveProject = async (
  req: leaveProjectReq,
  res: leaveProjectRes
) => {
  const id = req.user.id
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
  const id = req.user.id
  if (id) {
    const project = await ProjectModel.findOne({ id: req.body.projectId })
    if (!project) {
      throw new Error('Project does not exist')
    }
    const user = await UserModel.findOneAndUpdate(
      { id: id },
      {
        $push: {
          projects: project
        }
      }
    )

    if (!user) {
      throw new Error('Session expired')
    }
    if (project.ownerId !== user.id) {
      throw new Error('You cannot kick members from this project')
    }

    project.users.splice(project.users.indexOf(req.user.id), 1)
    const deletingUser = await UserModel.findOne({ id: req.user.id })
    if (!deletingUser) {
      throw new Error('user being kicked does not exist')
    }
    deletingUser.projects = deletingUser.projects.filter(
      (proj: any) => proj !== project.id
    )
    await deletingUser.save()

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

  user.projects.push(req.body.projectId)

  await user.save()

  res.status(200).json({ message: 'Success' })
}

router.post('/shareProject', isAuthenticated, shareProject)

export const getProjectMembers = async (req: Request, res: Response) => {
  let users = await UserModel.find({ projects: { $in: [req.body.projectId] } })

  res.json({ users })
}

router.post('/getProjectMembers', isAuthenticated, getProjectMembers)
