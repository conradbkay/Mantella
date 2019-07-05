import { Project } from './../../../../client/src/graphql/types'
import { purifyProject } from './../../utils'
import { ProjectModel, TaskProps } from './../../models/Project'
import { MutationResolvers } from '../../graphql/types'
import { Types } from 'mongoose'
import uuid from 'uuid'

const createTask: MutationResolvers['createTask'] = async (parent, obj) => {
  const taskId = Types.ObjectId()

  const proj = await ProjectModel.findById(obj.projId)

  if (proj) {
    proj.tasks.push({
      _id: taskId,
      name: obj.taskInfo.name || 'Unnamed Task',
      points: obj.taskInfo.points || 0,
      completed: false,
      timeWorkedOn: 0,
      color: obj.taskInfo.color || '#FFFFFF',
      startDate: new Date(),
      dueDate: obj.taskInfo.dueDate ? new Date(obj.taskInfo.dueDate) : undefined
    } as TaskProps)

    const column = (proj.columns as any).id(obj.columnId)
    column.taskIds = [...column.taskIds, taskId]

    const newProj = await proj.save()

    const pure = await purifyProject(newProj)

    if (pure) {
      const task = pure.tasks.find((tk) => taskId.equals(Types.ObjectId(tk._id)))
      return {
        project: pure,
        task: task
      }
    }
  }

  return null
}
const editTask: MutationResolvers['editTask'] = async (parent, obj) => {
  const project = await ProjectModel.findById(obj.projId)

  if (project) {
    const task: TaskProps = (project.tasks as any).id(obj.taskId)

    task.name = obj.task.name || task.name
    task.points = obj.task.points || task.points
    // dueDate
    // task.lastEdited = new Date()
    task.recurrance = obj.task.recurrance || task.recurrance
    task.color = obj.task.color || task.color
    task._id = Types.ObjectId(obj.taskId)

    const newProj = await project.save()
    const pure = await purifyProject(newProj)

    if (pure) {
      if (task) {
        return {
          project: pure,
          task: (newProj.tasks as any).id(obj.taskId)
        }
      } else {
        throw new Error('Task not created')
      }
    }
  }
  throw new Error('project not able to be updated')
}
const deleteTask: MutationResolvers['deleteTask'] = async (parent, obj) => {
  const proj = await ProjectModel.findById(obj.projId)

  if (proj) {
    (proj.tasks as any).id(obj.id).remove()

    proj.columns.map((column) => {
      column.taskIds.splice(column.taskIds.indexOf(obj.id), 1)
    })

    proj.swimlanes.map((swimlane) => {
      swimlane.taskIds.splice(swimlane.taskIds.indexOf(obj.id), 1)
    })

    const newProj = await proj.save()
    return { project: (await purifyProject(newProj)) as Project, task: null }
  }

  throw new Error('project not defined')
}

const dragTask: MutationResolvers['dragTask'] = async (
  parent,
  obj,
  context
) => {
  const proj = await ProjectModel.findById(obj.projectId)

  if (proj) {
    obj.columnIds.map((colId) => {
      (proj.columns as any).id(colId.id).taskIds = colId.newIds
    })
    obj.swimlaneIds.map((swimId) => {
      (proj.swimlanes as any).id(swimId.id).taskIds = swimId.newIds
    })

    const newProj = await proj.save()

    const pure = await purifyProject(newProj)

    return {
      project: pure as Project,
      task: (newProj.tasks as any).id(obj.id).toObject()
    }
  }

  throw new Error('project not defined')
}

const setSubtask: MutationResolvers['setSubtask'] = async (parent, obj) => {
  const proj = await ProjectModel.findById(obj.projId)
  if (proj) {
    const task: TaskProps = (proj.tasks as any).id(obj.taskId)

    if (obj.subtaskId) {
      const subTask: TaskProps['subTasks'][0] = (task.subTasks as any).id(
        obj.subtaskId
      )

      if (obj.info) {
        (subTask as any).remove()
      } else {
        subTask.completed =
          obj.info!.completed !== null && obj.info!.completed !== undefined
            ? obj.info!.completed
            : subTask.completed

        subTask.name =
          obj.info!.name !== null && obj.info!.name !== undefined
            ? obj.info!.name
            : subTask.name
      }
    } else {
      task.subTasks.push({
        completed: false,
        name: obj.info!.name || 'Subtask',
        id: uuid()
      })
    }

    const newProj = await proj.save()

    return (newProj.tasks as any).id(obj.taskId)
  }

  throw new Error('project not defined')
}

const setComment: MutationResolvers['setComment'] = async (parent, obj) => {
  const proj = await ProjectModel.findById(obj.projId)
  if (proj) {
    const task: TaskProps = (proj.tasks as any).id(obj.taskId)

    if (obj.commentId) {
      const comment: TaskProps['comments'][0] = (task.comments as any).id(
        obj.commentId
      )

      if (obj.deleting) {
        (comment as any).remove()
      } else {
        comment.description =
          obj.description !== undefined ? obj.description : comment.description
      }
    } else {
      task.comments.push({
        dateAdded: new Date(),
        description: obj.description || 'Subtask',
        id: uuid()
      })
    }
    const newProj = await proj.save()

    return (newProj.tasks as any).id(obj.taskId)
  }

  throw new Error('project not defined')
}

export const taskMutations = {
  createTask,
  editTask,
  deleteTask,
  dragTask,
  setSubtask,
  setComment
}
