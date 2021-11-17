import { UserModel } from 'src/models/User'
import uuid from 'uuid'
import { ProjectModel } from 'src/models/Project'
import {
  createColummRes,
  createColumnReq,
  deleteColumnReq,
  deleteColumnRes,
  toggleCollapsedReq,
  toggleCollapsedRes
} from './types'
import { router } from './router'

export const createColumn = async (
  req: createColumnReq,
  res: createColummRes
) => {
  const creatingId = uuid()

  const [user, project] = await Promise.all([
    UserModel.findOne({ id: req.body.userId }),
    ProjectModel.findOne({ id: req.body.projId })
  ])

  if (user && project) {
    project.columns.push({
      inProgress: false,
      id: creatingId,
      name: req.body.name,
      collapsedUsers: [],
      taskIds: []
    })
    const newProj = await project.save()
    res.json({
      project: newProj,
      column: newProj.columns.find((col) => col.id === creatingId)
    })
  } else {
    throw new Error('user id not provided')
  }
}

router.post('/createColumn', createColumn)

export const toggleCollapsed = async (
  req: toggleCollapsedReq,
  res: toggleCollapsedRes
) => {
  const [user, project] = await Promise.all([
    UserModel.findOne({ id: req.body.userId }),
    await ProjectModel.findOne({ id: req.body.projId })
  ])

  if (user && project) {
    const col = project.columns.find((col) => col.id === req.body.colId)
    if (col) {
      const userIdInCollapsed = col.collapsedUsers.indexOf(req.body.userId)
      if (userIdInCollapsed > -1) {
        // user has column collapsed
        col.collapsedUsers.splice(userIdInCollapsed, 1)
      } else {
        col.collapsedUsers = [...col.collapsedUsers, req.body.userId]
      }
      const newProj = await project.save()

      res.json({ column: col, project: newProj })
    }
    throw new Error('column does not exist')
  } else {
    throw new Error('user id not provided')
  }
}

router.post('/toggleCollapsed', toggleCollapsed)

export const deleteColumn = async (
  req: deleteColumnReq,
  res: deleteColumnRes
) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })
  if (project) {
    if (project.columns.length <= 1) {
      throw new Error('trying to delete last column')
    }
    if (project.columns.find((col) => col.id === req.body.colId)!.inProgress) {
      throw new Error('Trying to delete in progress column')
    }
    project.columns = project.columns.filter((col) => col.id !== req.body.colId)
    await project.save()
    res.json({ id: req.body.colId })
  } else {
    throw new Error('project no longer exists')
  }
}

router.post('/deleteColumn', deleteColumn)
