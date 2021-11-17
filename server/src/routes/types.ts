import { Request, Response } from 'express'

interface Req<body = {}> extends Request {
  body: body
}

// AUTH
export type loginWithCookieReq = Req<{}>
export type loginWithCookieRes = Response<{
  user: any
}>

export type loginReq = Req<{
  email: string
  password: string
}>
export type loginRes = Response<{}>

export type registerReq = Req<{
  email: string
  username: string
  password: string
}>
export type registerRes = Response<{}>

export type guestLoginReq = Req<{}>
export type guestLoginRes = Response<{}>

// COLUMN
export type createColumnReq = Req<{
  userId: string
  projId: string
  name: string
}>
export type createColummRes = Response<{}>

export type toggleCollapsedReq = Req<{
  userId: string
  projId: string
  colId: string
}>
export type toggleCollapsedRes = Response<{}>

export type deleteColumnReq = Req<{
  projId: string
  colId: string
}>
export type deleteColumnRes = Response<{}>

// LIST
export type editListReq = Req<{
  listId: string
  projId: string
  newList: {
    name: string
    taskIds: string[]
  }
}>
export type editListRes = Response<{}>

export type deleteListReq = Req<{
  projId: string
  id: string
}>
export type deleteListRes = Response<{}>

export type createListReq = Req<{
  projId: string
  name: string
}>
export type createListRes = Response<{}>

// PROJECT
export type createProjectReq = Req<{
  userId: string
  name: string
}>
export type createProjectRes = Response<{}>

export type editProjectReq = Req<{
  id: string
  newProj: {
    name: string
  }
}>
export type editProjectRes = Response<{}>

export type deleteProjectReq = Req<{
  id: string
  userId: string
}>
export type deleteProjectRes = Response<{}>

export type joinProjectReq = Req<{
  userId: string
  projectId: string
}>
export type joinProjectRes = Response<{}>

export type leaveProjectReq = Req<{
  userId: string
  projectId: string
}>
export type leaveProjectRes = Response<{}>

export type removeMemberFromProjectReq = Req<{
  projectId: string
  userId: string
}>
export type removeMemberFromProjectRes = Response<{}>

// TASK
export type createTaskReq = Req<{
  projId: string
  taskInfo: any // TODO: optional type of task
  listId: string
}>
export type createTaskRes = Response<{}>

export type editTaskReq = Req<{
  taskId: string
  projId: string
  task: any // TODO
}>
export type editTaskRes = Response<{}>

export type deleteTaskReq = Req<{
  projId: string
  id: string
}>
export type deleteTaskRes = Response<{}>

export type dragTaskReq = Req<{
  projectId: string
  oldListId: string
  newListId: string
  newProgress: number
  newIndex: number
  id: string
}>
export type dragTaskRes = Response<{}>

export type setSubtaskReq = Req<{
  projId: string
  taskId: string
  subtaskId: string
  info?: any // TODO
}>
export type setSubtaskRes = Response<{}>

export type setCommentReq = Req<{
  commentId: string
  projId: string
  taskId: string
  description: string
}>
export type setCommentRes = Response<{}>
