import { ProjectModel } from '../models/Project'
import { nanoid } from 'nanoid'
import { router } from './router'
import {
  createListReq,
  createListRes,
  deleteListReq,
  deleteListRes,
  editListReq,
  editListRes
} from './types'
import { Request, Response } from 'express'
import { isAuthenticated } from '../passport'
import { resolveProjectUsers } from '../utils/userResolver'

export const editList = async (req: editListReq, res: editListRes) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project) {
    const list = project.lists.find((l) => {
      return l.id === req.body.listId
    })!

    list.name = req.body.newList.name || list.name
    list.taskIds = req.body.newList.taskIds || list.taskIds

    const newProj = await project.save()

    const resolvedProject = await resolveProjectUsers(newProj.toObject())

    res.json({
      project: resolvedProject,
      list: newProj.lists.find((l) => l.id === req.body.listId)!
    })
  } else {
    throw new Error('proj not found')
  }
}

router.post('/editList', isAuthenticated, editList)

export const deleteList = async (req: deleteListReq, res: deleteListRes) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project && project.lists.length > 1) {
    project.lists = project.lists.filter((list) => list.id !== req.body.id)
    project.markModified('lists')
    await project.save()

    res.json({ id: req.body.id })
  } else {
    throw new Error('cant delete final list!')
  }
}

router.post('/deleteList', isAuthenticated, deleteList)

export const createList = async (req: createListReq, res: createListRes) => {
  const newId = nanoid()

  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project) {
    project.lists.push({
      id: newId,
      name: req.body.name || 'New List',
      taskIds: [[], [], []]
    })

    const newProj = await project.save()

    const resolvedProject = await resolveProjectUsers(newProj.toObject())

    res.json({
      project: resolvedProject,
      list: resolvedProject.lists.find((l: any) => l.id === newId)
    })
  } else {
    throw new Error('proj not found')
  }
}

router.post('/createList', isAuthenticated, createList)

export const setListIdx = async (req: Request, res: Response) => {
  const project = await ProjectModel.findOne({ id: req.body.projId as any })

  if (project) {
    const list = project.lists.find((l) => l.id === req.body.id)
    const idx = project.lists.indexOf(list!)

    const element = project.lists.splice(idx, 1)[0]

    project.lists.splice(idx + req.body.offset, 0, element!)
    project.markModified('lists')
    await project.save()

    res.json({ id: req.body.id })
  } else {
    throw new Error('proj not found')
  }
}

router.post('/setListIdx', isAuthenticated, setListIdx)
