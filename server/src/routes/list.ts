import { ProjectModel } from '../models/Project'
import { v4 as uuid } from 'uuid'
import { router } from './router'
import {
  createListReq,
  createListRes,
  deleteListReq,
  deleteListRes,
  editListReq,
  editListRes
} from './types'
import { isAuthenticated } from '../passport'

export const editList = async (req: editListReq, res: editListRes) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project) {
    const list = project.lists.find((l) => {
      return l.id === req.body.listId
    })!

    list.name = req.body.newList.name || list.name
    list.taskIds = req.body.newList.taskIds || list.taskIds

    const newProj = await project.save()

    const pure = newProj.toObject()

    res.json({
      project: pure,
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
  const newId = uuid()

  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project) {
    project.lists.push({
      id: newId,
      name: req.body.name || 'new list',
      taskIds: [[], [], []]
    })

    const newProj = await project.save()

    const pure = newProj.toObject()

    res.json({
      project: pure,
      list: pure.lists.find((l) => l.id === newId)
    })
  } else {
    throw new Error('proj not found')
  }
}

router.post('/createList', isAuthenticated, createList)
