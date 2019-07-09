import { ProjectProps } from './../../models/Project'
import { MutationResolvers, Project } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'
import uuid from 'uuid'

const editColumn: MutationResolvers['editColumn'] = async (parent, obj) => {
  const project = await ProjectModel.findOne({ id: obj.projectId })

  if (project) {
    const column = project.columns.find((col) => {
      return col.id === obj.colId
    })!

    column.name = obj.newCol.name || column.name
    column.taskIds = obj.newCol.taskIds || column.taskIds
    column.taskLimit = obj.newCol.taskLimit || column.taskLimit

    const newProj = await project.save()

    const pure = newProj.toObject()

    if (pure) {
      return {
        project: pure,
        column: newProj.columns.find((col) => col.id === obj.colId)!
      }
    }
  }

  throw new Error('proj not found')
}
const deleteColumn: MutationResolvers['deleteColumn'] = async (parent, obj) => {
  const project = await ProjectModel.findOne({ id: obj.projectId })

  if (project && project.columns.length > 1) {
    (project.columns.find((col) => col.id === obj._id) as any).remove()

    project.columnOrder.splice(project.columnOrder.indexOf(obj._id), 1)

    const newProj = await project.save()
    const pure = await newProj.toObject()

    return { project: pure as Project, column: null }
  } else {
    throw new Error('cant delete last column!')
  }
}

const createColumn: MutationResolvers['createColumn'] = async (parent, obj) => {
  const newId = uuid()

  const project = await ProjectModel.findOne({ id: obj.projId })

  if (project) {
    project.columns.push({
      id: newId,
      name: obj.name || 'column',
      isCompletedColumn: obj.isCompletedColumn || false,
      taskIds: [],
      taskLimit: obj.taskLimit || 0
    } as ProjectProps['columns'][0])
    project.columnOrder.push(newId)

    const newProj = await project.save()

    const pure = newProj.toObject()

    if (pure) {
      return {
        project: pure,
        column: (newProj.columns.find(
          (col) => col.id === newId
        ) as any).toObject()
      }
    }
  }

  throw new Error('proj not found')
}

export const columnMutations = {
  editColumn,
  deleteColumn,
  createColumn
}
