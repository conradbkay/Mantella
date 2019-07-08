import { ProjectProps } from './../../models/Project'
import { MutationResolvers, Project } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'
import { purifyProject } from '../../utils'
import { Types } from 'mongoose'

const editColumn: MutationResolvers['editColumn'] = async (parent, obj) => {
  const project = await ProjectModel.findById(obj.projectId)

  if (project) {
    const column: ProjectProps['columns'][0] = (project.columns as any).id(
      obj.colId
    )

    column.name = obj.newCol.name || column.name
    column.taskIds = obj.newCol.taskIds || column.taskIds
    column.taskLimit = obj.newCol.taskLimit || column.taskLimit

    const newProj = await project.save()

    const pure = await purifyProject(newProj)

    if (pure) {
      return {
        project: pure,
        column: (newProj.columns as any).id(obj.colId)
      }
    }
  }
  return null
}
const deleteColumn: MutationResolvers['deleteColumn'] = async (parent, obj) => {
  const project = await ProjectModel.findById(obj.projectId)

  if (project && project.columns.length > 1) {
    (project.columns as any).id(obj._id).remove()

    project.columnOrder.splice(project.columnOrder.indexOf(obj._id), 1)

    const newProj = await project.save()
    const pure = await purifyProject(newProj)

    return { project: pure as Project, column: null }
  } else {
    throw new Error('cant delete last column!')
  }
}

const createColumn: MutationResolvers['createColumn'] = async (parent, obj) => {
  const newId = Types.ObjectId()

  const project = await ProjectModel.findById(obj.projId)

  if (project) {
    project.columns.push({
      _id: newId,
      id: newId.toHexString(),
      name: obj.name || 'column',
      isCompletedColumn: obj.isCompletedColumn || false,
      taskIds: [],
      taskLimit: obj.taskLimit || undefined
    } as ProjectProps['columns'][0])
    project.columnOrder.push(newId.toHexString())

    const newProj = await project.save()

    const pure = await purifyProject(newProj)

    if (pure) {
      return {
        project: pure,
        column: (newProj.columns as any).id(newId).toObject()
      }
    }
  }
  return null
}

export const columnMutations = {
  editColumn,
  deleteColumn,
  createColumn
}
