export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
}

export type Auth = {
  user: User
}

export type Column = {
  _id: Scalars['String']
  name: Scalars['String']
  isCompletedColumn?: Maybe<Scalars['Boolean']>
  taskIds: Array<Scalars['String']>
  taskLimit?: Maybe<Scalars['Int']>
}

export type ColumnInput = {
  name: Scalars['String']
  isCompletedColumn: Scalars['Boolean']
  taskIds: Array<Scalars['String']>
  taskLimit: Scalars['Int']
}

export type ColumnMerge = {
  project: Project
  column?: Maybe<Column>
}

export type Comment = {
  description: Scalars['String']
  dateAdded: Scalars['Date']
  lastEdited?: Maybe<Scalars['Date']>
  _id: Scalars['String']
}

export type DeleteReturn = {
  id: Scalars['String']
}

export type DragTaskIdList = {
  id: Scalars['String']
  newIds: Array<Scalars['String']>
}

export type Mutation = {
  createTask?: Maybe<TaskMerge>
  editTask?: Maybe<TaskMerge>
  deleteTask?: Maybe<TaskMerge>
  dragTask?: Maybe<TaskMerge>
  register?: Maybe<Auth>
  login?: Maybe<Auth>
  loginWithCookie?: Maybe<Auth>
  logout?: Maybe<Void>
  createProject?: Maybe<Project>
  editProject?: Maybe<Project>
  deleteProject?: Maybe<DeleteReturn>
  createColumn?: Maybe<ColumnMerge>
  editColumn?: Maybe<ColumnMerge>
  deleteColumn?: Maybe<ColumnMerge>
  joinProject?: Maybe<Project>
  leaveProject?: Maybe<DeleteReturn>
  createSwimlane?: Maybe<SwimlaneMerge>
  editSwimlane?: Maybe<SwimlaneMerge>
  deleteSwimlane?: Maybe<SwimlaneMerge>
  removeMemberFromProject: Project
  setComment: Task
  setSubtask: Task
}

export type MutationCreateTaskArgs = {
  projId: Scalars['String']
  taskInfo: TaskInput
  columnId: Scalars['String']
}

export type MutationEditTaskArgs = {
  projId: Scalars['String']
  task: TaskInput
  taskId: Scalars['String']
}

export type MutationDeleteTaskArgs = {
  projId: Scalars['String']
  id: Scalars['String']
}

export type MutationDragTaskArgs = {
  columnIds: Array<DragTaskIdList>
  id: Scalars['String']
  swimlaneIds: Array<DragTaskIdList>
  projectId: Scalars['String']
}

export type MutationRegisterArgs = {
  username: Scalars['String']
  password: Scalars['String']
  email: Scalars['String']
}

export type MutationLoginArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type MutationCreateProjectArgs = {
  name: Scalars['String']
}

export type MutationEditProjectArgs = {
  id: Scalars['String']
  newProj: ProjectInput
}

export type MutationDeleteProjectArgs = {
  id: Scalars['String']
}

export type MutationCreateColumnArgs = {
  projId: Scalars['String']
  name: Scalars['String']
  isCompletedColumn?: Maybe<Scalars['Boolean']>
  taskLimit?: Maybe<Scalars['Int']>
}

export type MutationEditColumnArgs = {
  colId: Scalars['String']
  projectId: Scalars['String']
  newCol: ColumnInput
}

export type MutationDeleteColumnArgs = {
  _id: Scalars['String']
  projectId: Scalars['String']
}

export type MutationJoinProjectArgs = {
  projectId: Scalars['String']
}

export type MutationLeaveProjectArgs = {
  projectId: Scalars['String']
}

export type MutationCreateSwimlaneArgs = {
  projId: Scalars['String']
  name: Scalars['String']
}

export type MutationEditSwimlaneArgs = {
  swimId: Scalars['String']
  projId: Scalars['String']
  newSwim: SwimlaneInput
}

export type MutationDeleteSwimlaneArgs = {
  projId: Scalars['String']
  _id: Scalars['String']
}

export type MutationRemoveMemberFromProjectArgs = {
  projectId: Scalars['String']
  userId: Scalars['String']
}

export type MutationSetCommentArgs = {
  projId: Scalars['String']
  taskId: Scalars['String']
  commentId?: Maybe<Scalars['String']>
  description: Scalars['String']
  deleting: Scalars['Boolean']
}

export type MutationSetSubtaskArgs = {
  projId: Scalars['String']
  taskId: Scalars['String']
  subtaskId?: Maybe<Scalars['String']>
  info?: Maybe<SubtaskInfo>
  deleting: Scalars['Boolean']
}

export type Profile = {
  _id: Scalars['String']
  profileImg?: Maybe<Scalars['String']>
  username: Scalars['String']
  email: Scalars['String']
  projects: Array<Scalars['String']>
}

export type Project = {
  ownerId?: Maybe<Scalars['String']>
  name: Scalars['String']
  _id: Scalars['String']
  tags?: Maybe<Array<Tag>>
  columnIds: Array<Scalars['String']>
  columns: Array<Column>
  swimlanes: Array<Swimlane>
  users?: Maybe<Array<Profile>>
  tasks: Array<Task>
  isPrivate?: Maybe<Scalars['Boolean']>
}

export type ProjectInput = {
  name: Scalars['String']
  columnIds: Array<Scalars['String']>
  categories: Array<Scalars['String']>
}

export type Query = {
  projects: Array<Maybe<Project>>
  projectById?: Maybe<Project>
  user?: Maybe<User>
}

export type QueryProjectsArgs = {
  ids: Array<Scalars['String']>
}

export type QueryProjectByIdArgs = {
  id: Scalars['String']
}

export type QueryUserArgs = {
  id: Scalars['String']
}

export type SubTask = {
  name: Scalars['String']
  completed: Scalars['Boolean']
  _id: Scalars['String']
}

export type SubtaskInfo = {
  name: Scalars['String']
  completed: Scalars['Boolean']
}

export type Swimlane = {
  taskIds: Array<Scalars['String']>
  name: Scalars['String']
  _id: Scalars['String']
}

export type SwimlaneInput = {
  taskIds: Array<Scalars['String']>
  name: Scalars['String']
}

export type SwimlaneMerge = {
  project: Project
  swimlane?: Maybe<Swimlane>
}

export type Tag = {
  name: Scalars['String']
  _id: Scalars['String']
  color?: Maybe<Scalars['String']>
}

export type Task = {
  name: Scalars['String']
  points: Scalars['Int']
  completed: Scalars['Boolean']
  timeWorkedOn: Scalars['Int']
  color?: Maybe<Scalars['String']>
  dueDate?: Maybe<Scalars['Date']>
  startDate?: Maybe<Scalars['Date']>
  assignedUsers: Array<Scalars['String']>
  tags: Array<Scalars['String']>
  subTasks: Array<SubTask>
  comments: Array<Comment>
  description?: Maybe<Scalars['String']>
  recurrance?: Maybe<Scalars['String']>
  _id: Scalars['String']
}

export type TaskInput = {
  name?: Maybe<Scalars['String']>
  points?: Maybe<Scalars['Int']>
  dueDate?: Maybe<Scalars['Date']>
  recurrance?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
}

export type TaskMerge = {
  project: Project
  task?: Maybe<Task>
}

export type User = {
  _id: Scalars['String']
  profileImg?: Maybe<Scalars['String']>
  username: Scalars['String']
  email: Scalars['String']
  projects: Array<Project>
}

export type Void = {
  message: Scalars['String']
}

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from 'graphql'

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {}
  String: Scalars['String']
  Project: Project
  Tag: Tag
  Column: Column
  Boolean: Scalars['Boolean']
  Int: Scalars['Int']
  Swimlane: Swimlane
  Profile: Profile
  Task: Task
  Date: Scalars['Date']
  SubTask: SubTask
  Comment: Comment
  User: User
  Mutation: {}
  TaskInput: TaskInput
  TaskMerge: TaskMerge
  DragTaskIdList: DragTaskIdList
  Auth: Auth
  Void: Void
  ProjectInput: ProjectInput
  DeleteReturn: DeleteReturn
  ColumnMerge: ColumnMerge
  ColumnInput: ColumnInput
  SwimlaneMerge: SwimlaneMerge
  SwimlaneInput: SwimlaneInput
  SubtaskInfo: SubtaskInfo
}

export type AuthResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Auth']
> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>
}

export type ColumnResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Column']
> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isCompletedColumn?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
  taskIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  taskLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
}

export type ColumnMergeResolvers<
  ContextType = any,
  ParentType = ResolversTypes['ColumnMerge']
> = {
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  column?: Resolver<Maybe<ResolversTypes['Column']>, ParentType, ContextType>
}

export type CommentResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Comment']
> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  dateAdded?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
  lastEdited?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export type DeleteReturnResolvers<
  ContextType = any,
  ParentType = ResolversTypes['DeleteReturn']
> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Mutation']
> = {
  createTask?: Resolver<
    Maybe<ResolversTypes['TaskMerge']>,
    ParentType,
    ContextType,
    MutationCreateTaskArgs
  >
  editTask?: Resolver<
    Maybe<ResolversTypes['TaskMerge']>,
    ParentType,
    ContextType,
    MutationEditTaskArgs
  >
  deleteTask?: Resolver<
    Maybe<ResolversTypes['TaskMerge']>,
    ParentType,
    ContextType,
    MutationDeleteTaskArgs
  >
  dragTask?: Resolver<
    Maybe<ResolversTypes['TaskMerge']>,
    ParentType,
    ContextType,
    MutationDragTaskArgs
  >
  register?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType,
    MutationRegisterArgs
  >
  login?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType,
    MutationLoginArgs
  >
  loginWithCookie?: Resolver<
    Maybe<ResolversTypes['Auth']>,
    ParentType,
    ContextType
  >
  logout?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType>
  createProject?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    MutationCreateProjectArgs
  >
  editProject?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    MutationEditProjectArgs
  >
  deleteProject?: Resolver<
    Maybe<ResolversTypes['DeleteReturn']>,
    ParentType,
    ContextType,
    MutationDeleteProjectArgs
  >
  createColumn?: Resolver<
    Maybe<ResolversTypes['ColumnMerge']>,
    ParentType,
    ContextType,
    MutationCreateColumnArgs
  >
  editColumn?: Resolver<
    Maybe<ResolversTypes['ColumnMerge']>,
    ParentType,
    ContextType,
    MutationEditColumnArgs
  >
  deleteColumn?: Resolver<
    Maybe<ResolversTypes['ColumnMerge']>,
    ParentType,
    ContextType,
    MutationDeleteColumnArgs
  >
  joinProject?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    MutationJoinProjectArgs
  >
  leaveProject?: Resolver<
    Maybe<ResolversTypes['DeleteReturn']>,
    ParentType,
    ContextType,
    MutationLeaveProjectArgs
  >
  createSwimlane?: Resolver<
    Maybe<ResolversTypes['SwimlaneMerge']>,
    ParentType,
    ContextType,
    MutationCreateSwimlaneArgs
  >
  editSwimlane?: Resolver<
    Maybe<ResolversTypes['SwimlaneMerge']>,
    ParentType,
    ContextType,
    MutationEditSwimlaneArgs
  >
  deleteSwimlane?: Resolver<
    Maybe<ResolversTypes['SwimlaneMerge']>,
    ParentType,
    ContextType,
    MutationDeleteSwimlaneArgs
  >
  removeMemberFromProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    MutationRemoveMemberFromProjectArgs
  >
  setComment?: Resolver<
    ResolversTypes['Task'],
    ParentType,
    ContextType,
    MutationSetCommentArgs
  >
  setSubtask?: Resolver<
    ResolversTypes['Task'],
    ParentType,
    ContextType,
    MutationSetSubtaskArgs
  >
}

export type ProfileResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Profile']
> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  profileImg?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  projects?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
}

export type ProjectResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Project']
> = {
  ownerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  tags?: Resolver<Maybe<Array<ResolversTypes['Tag']>>, ParentType, ContextType>
  columnIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  columns?: Resolver<Array<ResolversTypes['Column']>, ParentType, ContextType>
  swimlanes?: Resolver<
    Array<ResolversTypes['Swimlane']>,
    ParentType,
    ContextType
  >
  users?: Resolver<
    Maybe<Array<ResolversTypes['Profile']>>,
    ParentType,
    ContextType
  >
  tasks?: Resolver<Array<ResolversTypes['Task']>, ParentType, ContextType>
  isPrivate?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >
}

export type QueryResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Query']
> = {
  projects?: Resolver<
    Array<Maybe<ResolversTypes['Project']>>,
    ParentType,
    ContextType,
    QueryProjectsArgs
  >
  projectById?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    QueryProjectByIdArgs
  >
  user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    QueryUserArgs
  >
}

export type SubTaskResolvers<
  ContextType = any,
  ParentType = ResolversTypes['SubTask']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type SwimlaneResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Swimlane']
> = {
  taskIds?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type SwimlaneMergeResolvers<
  ContextType = any,
  ParentType = ResolversTypes['SwimlaneMerge']
> = {
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  swimlane?: Resolver<
    Maybe<ResolversTypes['Swimlane']>,
    ParentType,
    ContextType
  >
}

export type TagResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Tag']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
}

export type TaskResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Task']
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  timeWorkedOn?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  dueDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  startDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  assignedUsers?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
  subTasks?: Resolver<Array<ResolversTypes['SubTask']>, ParentType, ContextType>
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  recurrance?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type TaskMergeResolvers<
  ContextType = any,
  ParentType = ResolversTypes['TaskMerge']
> = {
  project?: Resolver<ResolversTypes['Project'], ParentType, ContextType>
  task?: Resolver<Maybe<ResolversTypes['Task']>, ParentType, ContextType>
}

export type UserResolvers<
  ContextType = any,
  ParentType = ResolversTypes['User']
> = {
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  profileImg?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  projects?: Resolver<Array<ResolversTypes['Project']>, ParentType, ContextType>
}

export type VoidResolvers<
  ContextType = any,
  ParentType = ResolversTypes['Void']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Auth?: AuthResolvers<ContextType>
  Column?: ColumnResolvers<ContextType>
  ColumnMerge?: ColumnMergeResolvers<ContextType>
  Comment?: CommentResolvers<ContextType>
  Date?: GraphQLScalarType
  DeleteReturn?: DeleteReturnResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Profile?: ProfileResolvers<ContextType>
  Project?: ProjectResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  SubTask?: SubTaskResolvers<ContextType>
  Swimlane?: SwimlaneResolvers<ContextType>
  SwimlaneMerge?: SwimlaneMergeResolvers<ContextType>
  Tag?: TagResolvers<ContextType>
  Task?: TaskResolvers<ContextType>
  TaskMerge?: TaskMergeResolvers<ContextType>
  User?: UserResolvers<ContextType>
  Void?: VoidResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
