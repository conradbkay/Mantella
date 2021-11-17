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
  const user = await UserModel.findOne({ id: req.body.userId })

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
    if (created) {
      res.json({ project: created.toObject() })
    }
  } else {
    throw new Error('user id not provided in token')
  }
}

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

export const deleteProject = async (
  req: deleteProjectReq,
  res: deleteProjectRes
) => {
  const user = await UserModel.findOne({ id: req.body.userId })

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

export const joinProject = async (req: joinProjectReq, res: joinProjectRes) => {
  const id = req.body.userId
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

export const leaveProject = async (
  req: leaveProjectReq,
  res: leaveProjectRes
) => {
  const id = req.body.userId
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

export const removeMemberFromProject = async (
  req: removeMemberFromProjectReq,
  res: removeMemberFromProjectRes
) => {
  const id = req.body.userId
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

    project.users.splice(project.users.indexOf(req.body.userId), 1)
    const deletingUser = await UserModel.findOne({ id: req.body.userId })
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

export const getProjects = async (req: Request, res: Response) => {
  const projects = await ProjectModel.find({
    _id: {
      $in: req.body.ids
    }
  })

  res.json({ projects: projects.map((proj) => proj.toObject()) || [] })
}
export const getProjectById = async (req: Request, res: Response) => {
  const proj = await ProjectModel.findOne({ id: req.body.id })

  if (proj) {
    return proj.toObject()
  } else {
    throw new Error('proj not found')
  }
}
