import { ProjectModel } from '../models/Project'
import uuid from 'uuid'
import {
  createTaskReq,
  createTaskRes,
  deleteTaskReq,
  deleteTaskRes,
  dragTaskReq,
  dragTaskRes,
  editTaskReq,
  editTaskRes,
  setCommentReq,
  setCommentRes,
  setSubtaskReq,
  setSubtaskRes
} from './types'
import { router } from './router'
import { isAuthenticated } from '../passport'

export const createTask = async (req: createTaskReq, res: createTaskRes) => {
  const taskId = uuid()

  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    proj.tasks.push({
      id: taskId,
      name: req.body.taskInfo.name || 'Unnamed Task',
      progress: 0,
      points: req.body.taskInfo.points || 0,
      timeWorkedOn: 0,
      color: req.body.taskInfo.color || '#FFFFFF',
      dueDate: req.body.taskInfo.dueDate
        ? new Date(req.body.taskInfo.dueDate).toString()
        : undefined,
      subTasks: req.body.taskInfo.subTasks
        ? req.body.taskInfo.subTasks.map((subT: any) => ({
            ...subT,
            id: uuid()
          }))
        : [],
      comments: [],
      description: req.body.taskInfo.description
    })

    const list = proj.lists.find((col) => col.id === req.body.listId)!
    list.taskIds = [...list.taskIds, taskId]

    // proj.columns[0].taskIds.push(taskId)

    const newProj = await proj.save()

    const pure = await newProj.toObject()

    if (pure) {
      const task = pure.tasks.find((tk) => taskId === tk.id)
      res.json({
        project: pure,
        task: task!
      })
    }
  } else {
    throw new Error('proj id not exist')
  }
}

router.post('/createTask', isAuthenticated, createTask)

export const editTask = async (req: editTaskReq, res: editTaskRes) => {
  const project = await ProjectModel.findOne({ id: req.body.projId })

  if (project) {
    const task = project.tasks.find((tsk) => tsk.id === req.body.taskId)!

    task.name = req.body.task.name || task.name
    task.points = req.body.task.points || task.points
    task.dueDate = req.body.task.dueDate || task.dueDate
    // task.recurrance = req.body.task.recurrance || task.recurrance
    task.color = req.body.task.color || task.color
    task.description = req.body.task.description

    const newProj = await project.save()
    const pure = await newProj.toObject()
    if (pure) {
      if (task) {
        res.json({
          project: pure,
          task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId)
        })
      } else {
        throw new Error('Task not created')
      }
    }
  } else {
    throw new Error('project not able to be updated')
  }
}

router.post('/editTask', isAuthenticated, editTask)

export const deleteTask = async (req: deleteTaskReq, res: deleteTaskRes) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })

  if (proj) {
    ;(proj.tasks.find((tsk) => tsk.id === req.body.id) as any).remove()

    proj.lists.forEach((list) => {
      list.taskIds.splice(list.taskIds.indexOf(req.body.id), 1)
    })

    const newProj = await proj.save()
    res.json({ project: newProj.toObject(), task: null })
  } else {
    throw new Error('project not defined')
  }
}

router.post('/deleteTask', isAuthenticated, deleteTask)

export const dragTask = async (req: dragTaskReq, res: dragTaskRes) => {
  const proj = await ProjectModel.findOne({ id: req.body.projectId })

  if (proj) {
    const oldListIdx = proj.lists.findIndex(
      (list) => list.id === req.body.oldListId
    )
    const newListIdx = proj.lists.findIndex(
      (list) => list.id === req.body.newListId
    )

    const task =
      proj.tasks[proj.tasks.findIndex((tsk) => tsk.id === req.body.id)]

    if (task) {
      task.progress = req.body.newProgress as 0 | 1 | 2
    }

    proj.lists[oldListIdx].taskIds = proj.lists[oldListIdx].taskIds.filter(
      (taskId) => taskId !== req.body.id
    )
    proj.lists[newListIdx].taskIds.splice(req.body.newIndex, 0, req.body.id)

    proj.markModified('lists') // mongoose does not watch subarrays this deep
    proj.markModified('tasks')

    const newProj = await proj.save()

    res.json({
      project: newProj.toObject()
    })
  } else {
    throw new Error('project not defined')
  }
}

router.post('/dragTask', isAuthenticated, dragTask)

export const setSubtask = async (req: setSubtaskReq, res: setSubtaskRes) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })
  if (proj) {
    const task = proj.tasks.find((tsk) => tsk.id === req.body.taskId)!
    const subTask = task.subTasks.find(
      (subT) => subT.id === req.body.subtaskId
    )!

    if (!subTask) {
      task.subTasks.push({
        completed: false,
        name: req.body.info!.name || 'Subtask',
        id: req.body.subtaskId!
      })
    } else if (!req.body.info) {
      task.subTasks = task.subTasks.filter(
        (sub) => sub.id !== req.body.subtaskId
      )
    } else {
      subTask.completed =
        req.body.info!.completed !== null &&
        req.body.info!.completed !== undefined
          ? req.body.info!.completed
          : subTask.completed

      subTask.name =
        req.body.info!.name !== null && req.body.info!.name !== undefined
          ? req.body.info!.name
          : subTask.name
    }

    const newProj = await proj.save()

    res.json({ task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId)! })
  } else {
    throw new Error('project not defined')
  }
}

router.post('/setSubtask', isAuthenticated, setSubtask)

export const setComment = async (req: setCommentReq, res: setCommentRes) => {
  const proj = await ProjectModel.findOne({ id: req.body.projId })
  if (proj) {
    const task = proj.tasks.find((tsk) => tsk.id === req.body.taskId)!

    if (req.body.commentId) {
      const comment = task.comments.find(
        (com) => com.id === req.body.commentId
      )!

      if (!req.body.description) {
        ;(comment as any).remove()
      } else {
        comment.comment = req.body.description
      }
    } else {
      task.comments.push({
        dateAdded: new Date().toString(),
        comment: req.body.description || 'Comment',
        id: uuid()
      })
    }
    const newProj = await proj.save()

    res.json({ task: newProj.tasks.find((tsk) => tsk.id === req.body.taskId)! })
  } else {
    throw new Error('project not defined')
  }
}

router.post('/setComment', isAuthenticated, setComment)
