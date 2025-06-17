import {
  ApiProject,
  ApiList,
  ApiTask,
  ApiUser,
  ApiSubtask
} from '@shared/types'

export type TProject = ApiProject
export type TList = ApiList
export type TTask = ApiTask
export type TUser = ApiUser
export type TSubtask = ApiSubtask

export type TComment = {
  id: string
  comment: string
  dateAdded: string
  lastEdited?: string
}
