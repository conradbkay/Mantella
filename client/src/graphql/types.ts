/* tslint:disable */
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  objectId: String
}

export type Auth = {
  __typename?: 'Auth'
  user: User
}

export type Column = {
  __typename?: 'Column'
  _id: Scalars['String']
  name: Scalars['String']
  isCompletedColumn?: Maybe<Scalars['Boolean']>
  taskIds: Array<Scalars['String']>
  taskLimit?: Maybe<Scalars['Int']>
}

export type ColumnInput = {
  name?: Maybe<Scalars['String']>
  isCompletedColumn?: Maybe<Scalars['Boolean']>
  taskIds?: Maybe<Array<Scalars['String']>>
  taskLimit?: Maybe<Scalars['Int']>
}

export type ColumnMerge = {
  __typename?: 'ColumnMerge'
  project: Project
  column?: Maybe<Column>
}

export type Comment = {
  __typename?: 'Comment'
  description: Scalars['String']
  dateAdded: Scalars['Date']
  lastEdited?: Maybe<Scalars['Date']>
  _id: Scalars['String']
}

export type DeleteReturn = {
  __typename?: 'DeleteReturn'
  id: Scalars['String']
}

export type DragTaskIdList = {
  id: Scalars['String']
  newIds: Array<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  createTask: TaskMerge
  editTask: TaskMerge
  deleteTask: TaskMerge
  dragTask: TaskMerge
  register: Auth
  login: Auth
  loginWithCookie: Auth
  logout: Void
  createProject: Project
  editProject: Project
  deleteProject: DeleteReturn
  createColumn: ColumnMerge
  editColumn: ColumnMerge
  deleteColumn: ColumnMerge
  joinProject: Project
  leaveProject: DeleteReturn
  createSwimlane: SwimlaneMerge
  editSwimlane: SwimlaneMerge
  deleteSwimlane: SwimlaneMerge
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
  __typename?: 'Profile'
  _id: Scalars['String']
  profileImg?: Maybe<Scalars['String']>
  username: Scalars['String']
  email: Scalars['String']
  projects: Array<Scalars['String']>
}

export type Project = {
  __typename?: 'Project'
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
  name?: Maybe<Scalars['String']>
  columnIds?: Maybe<Array<Scalars['String']>>
  categories?: Maybe<Array<Scalars['String']>>
}

export type Query = {
  __typename?: 'Query'
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
  __typename?: 'SubTask'
  name: Scalars['String']
  completed: Scalars['Boolean']
  _id: Scalars['String']
}

export type SubtaskInfo = {
  name: Scalars['String']
  completed: Scalars['Boolean']
}

export type Swimlane = {
  __typename?: 'Swimlane'
  taskIds: Array<Scalars['String']>
  name: Scalars['String']
  _id: Scalars['String']
}

export type SwimlaneInput = {
  taskIds?: Maybe<Array<Scalars['String']>>
  name?: Maybe<Scalars['String']>
}

export type SwimlaneMerge = {
  __typename?: 'SwimlaneMerge'
  project: Project
  swimlane?: Maybe<Swimlane>
}

export type Tag = {
  __typename?: 'Tag'
  name: Scalars['String']
  _id: Scalars['String']
  color?: Maybe<Scalars['String']>
}

export type Task = {
  __typename?: 'Task'
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
  __typename?: 'TaskMerge'
  project: Project
  task?: Maybe<Task>
}

export type User = {
  __typename?: 'User'
  _id: Scalars['String']
  profileImg?: Maybe<Scalars['String']>
  username: Scalars['String']
  email: Scalars['String']
  projects: Array<Project>
}

export type Void = {
  __typename?: 'Void'
  message: Scalars['String']
}
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from 'graphql'

export type Resolver<Result, Parent = {}, TContext = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<Result> | Result

export interface ISubscriptionResolverObject<Result, Parent, TContext, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: TContext,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  TContext = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, TContext, Args>)
  | ISubscriptionResolverObject<Result, Parent, TContext, Args>

export type TypeResolveFn<Types, Parent = {}, TContext = {}> = (
  parent: Parent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<Types>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export namespace QueryResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    projects?: ProjectsResolver<(Maybe<Project>)[], TypeParent, TContext>

    projectById?: ProjectByIdResolver<Maybe<Project>, TypeParent, TContext>

    user?: UserResolver<Maybe<User>, TypeParent, TContext>
  }

  export type ProjectsResolver<
    R = (Maybe<Project>)[],
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, ProjectsArgs>
  export interface ProjectsArgs {
    ids: string[]
  }

  export type ProjectByIdResolver<
    R = Maybe<Project>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, ProjectByIdArgs>
  export interface ProjectByIdArgs {
    id: string
  }

  export type UserResolver<
    R = Maybe<User>,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, UserArgs>
  export interface UserArgs {
    id: string
  }
}

export namespace ProjectResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Project> {
    ownerId?: OwnerIdResolver<Maybe<string>, TypeParent, TContext>

    name?: NameResolver<string, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>

    tags?: TagsResolver<Maybe<Tag[]>, TypeParent, TContext>

    columnIds?: ColumnIdsResolver<string[], TypeParent, TContext>

    columns?: ColumnsResolver<Column[], TypeParent, TContext>

    swimlanes?: SwimlanesResolver<Swimlane[], TypeParent, TContext>

    users?: UsersResolver<Maybe<Profile[]>, TypeParent, TContext>

    tasks?: TasksResolver<Task[], TypeParent, TContext>

    isPrivate?: IsPrivateResolver<Maybe<boolean>, TypeParent, TContext>
  }

  export type OwnerIdResolver<
    R = Maybe<string>,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type NameResolver<
    R = string,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type _IdResolver<
    R = string,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TagsResolver<
    R = Maybe<Tag[]>,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ColumnIdsResolver<
    R = string[],
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ColumnsResolver<
    R = Column[],
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type SwimlanesResolver<
    R = Swimlane[],
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type UsersResolver<
    R = Maybe<Profile[]>,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TasksResolver<
    R = Task[],
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type IsPrivateResolver<
    R = Maybe<boolean>,
    Parent = Project,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace TagResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Tag> {
    name?: NameResolver<string, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>

    color?: ColorResolver<Maybe<string>, TypeParent, TContext>
  }

  export type NameResolver<R = string, Parent = Tag, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
  export type _IdResolver<R = string, Parent = Tag, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
  export type ColorResolver<
    R = Maybe<string>,
    Parent = Tag,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace ColumnResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Column> {
    _id?: _IdResolver<string, TypeParent, TContext>

    name?: NameResolver<string, TypeParent, TContext>

    isCompletedColumn?: IsCompletedColumnResolver<
      Maybe<boolean>,
      TypeParent,
      TContext
    >

    taskIds?: TaskIdsResolver<string[], TypeParent, TContext>

    taskLimit?: TaskLimitResolver<Maybe<number>, TypeParent, TContext>
  }

  export type _IdResolver<
    R = string,
    Parent = Column,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type NameResolver<
    R = string,
    Parent = Column,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type IsCompletedColumnResolver<
    R = Maybe<boolean>,
    Parent = Column,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TaskIdsResolver<
    R = string[],
    Parent = Column,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TaskLimitResolver<
    R = Maybe<number>,
    Parent = Column,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace SwimlaneResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Swimlane> {
    taskIds?: TaskIdsResolver<string[], TypeParent, TContext>

    name?: NameResolver<string, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>
  }

  export type TaskIdsResolver<
    R = string[],
    Parent = Swimlane,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type NameResolver<
    R = string,
    Parent = Swimlane,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type _IdResolver<
    R = string,
    Parent = Swimlane,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace ProfileResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Profile> {
    _id?: _IdResolver<string, TypeParent, TContext>

    profileImg?: ProfileImgResolver<Maybe<string>, TypeParent, TContext>

    username?: UsernameResolver<string, TypeParent, TContext>

    email?: EmailResolver<string, TypeParent, TContext>

    projects?: ProjectsResolver<string[], TypeParent, TContext>
  }

  export type _IdResolver<
    R = string,
    Parent = Profile,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ProfileImgResolver<
    R = Maybe<string>,
    Parent = Profile,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type UsernameResolver<
    R = string,
    Parent = Profile,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type EmailResolver<
    R = string,
    Parent = Profile,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ProjectsResolver<
    R = string[],
    Parent = Profile,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace TaskResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Task> {
    name?: NameResolver<string, TypeParent, TContext>

    points?: PointsResolver<number, TypeParent, TContext>

    completed?: CompletedResolver<boolean, TypeParent, TContext>

    timeWorkedOn?: TimeWorkedOnResolver<number, TypeParent, TContext>

    color?: ColorResolver<Maybe<string>, TypeParent, TContext>

    dueDate?: DueDateResolver<Maybe<Date>, TypeParent, TContext>

    startDate?: StartDateResolver<Maybe<Date>, TypeParent, TContext>

    assignedUsers?: AssignedUsersResolver<string[], TypeParent, TContext>

    tags?: TagsResolver<string[], TypeParent, TContext>

    subTasks?: SubTasksResolver<SubTask[], TypeParent, TContext>

    comments?: CommentsResolver<Comment[], TypeParent, TContext>

    description?: DescriptionResolver<Maybe<string>, TypeParent, TContext>

    recurrance?: RecurranceResolver<Maybe<string>, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>
  }

  export type NameResolver<R = string, Parent = Task, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
  export type PointsResolver<
    R = number,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type CompletedResolver<
    R = boolean,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TimeWorkedOnResolver<
    R = number,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ColorResolver<
    R = Maybe<string>,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type DueDateResolver<
    R = Maybe<Date>,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type StartDateResolver<
    R = Maybe<Date>,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type AssignedUsersResolver<
    R = string[],
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TagsResolver<
    R = string[],
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type SubTasksResolver<
    R = SubTask[],
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type CommentsResolver<
    R = Comment[],
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type DescriptionResolver<
    R = Maybe<string>,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type RecurranceResolver<
    R = Maybe<string>,
    Parent = Task,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type _IdResolver<R = string, Parent = Task, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
}

export namespace SubTaskResolvers {
  export interface Resolvers<TContext = {}, TypeParent = SubTask> {
    name?: NameResolver<string, TypeParent, TContext>

    completed?: CompletedResolver<boolean, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>
  }

  export type NameResolver<
    R = string,
    Parent = SubTask,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type CompletedResolver<
    R = boolean,
    Parent = SubTask,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type _IdResolver<
    R = string,
    Parent = SubTask,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace CommentResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Comment> {
    description?: DescriptionResolver<string, TypeParent, TContext>

    dateAdded?: DateAddedResolver<Date, TypeParent, TContext>

    lastEdited?: LastEditedResolver<Maybe<Date>, TypeParent, TContext>

    _id?: _IdResolver<string, TypeParent, TContext>
  }

  export type DescriptionResolver<
    R = string,
    Parent = Comment,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type DateAddedResolver<
    R = Date,
    Parent = Comment,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type LastEditedResolver<
    R = Maybe<Date>,
    Parent = Comment,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type _IdResolver<
    R = string,
    Parent = Comment,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace UserResolvers {
  export interface Resolvers<TContext = {}, TypeParent = User> {
    _id?: _IdResolver<string, TypeParent, TContext>

    profileImg?: ProfileImgResolver<Maybe<string>, TypeParent, TContext>

    username?: UsernameResolver<string, TypeParent, TContext>

    email?: EmailResolver<string, TypeParent, TContext>

    projects?: ProjectsResolver<Project[], TypeParent, TContext>
  }

  export type _IdResolver<R = string, Parent = User, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
  export type ProfileImgResolver<
    R = Maybe<string>,
    Parent = User,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type UsernameResolver<
    R = string,
    Parent = User,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type EmailResolver<
    R = string,
    Parent = User,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ProjectsResolver<
    R = Project[],
    Parent = User,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace MutationResolvers {
  export interface Resolvers<TContext = {}, TypeParent = {}> {
    createTask?: CreateTaskResolver<TaskMerge, TypeParent, TContext>

    editTask?: EditTaskResolver<TaskMerge, TypeParent, TContext>

    deleteTask?: DeleteTaskResolver<TaskMerge, TypeParent, TContext>

    dragTask?: DragTaskResolver<TaskMerge, TypeParent, TContext>

    register?: RegisterResolver<Auth, TypeParent, TContext>

    login?: LoginResolver<Auth, TypeParent, TContext>

    loginWithCookie?: LoginWithCookieResolver<Auth, TypeParent, TContext>

    logout?: LogoutResolver<Void, TypeParent, TContext>

    createProject?: CreateProjectResolver<Project, TypeParent, TContext>

    editProject?: EditProjectResolver<Project, TypeParent, TContext>

    deleteProject?: DeleteProjectResolver<DeleteReturn, TypeParent, TContext>

    createColumn?: CreateColumnResolver<ColumnMerge, TypeParent, TContext>

    editColumn?: EditColumnResolver<ColumnMerge, TypeParent, TContext>

    deleteColumn?: DeleteColumnResolver<ColumnMerge, TypeParent, TContext>

    joinProject?: JoinProjectResolver<Project, TypeParent, TContext>

    leaveProject?: LeaveProjectResolver<DeleteReturn, TypeParent, TContext>

    createSwimlane?: CreateSwimlaneResolver<SwimlaneMerge, TypeParent, TContext>

    editSwimlane?: EditSwimlaneResolver<SwimlaneMerge, TypeParent, TContext>

    deleteSwimlane?: DeleteSwimlaneResolver<SwimlaneMerge, TypeParent, TContext>

    removeMemberFromProject?: RemoveMemberFromProjectResolver<
      Project,
      TypeParent,
      TContext
    >

    setComment?: SetCommentResolver<Task, TypeParent, TContext>

    setSubtask?: SetSubtaskResolver<Task, TypeParent, TContext>
  }

  export type CreateTaskResolver<
    R = TaskMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, CreateTaskArgs>
  export interface CreateTaskArgs {
    projId: string

    taskInfo: TaskInput

    columnId: string
  }

  export type EditTaskResolver<
    R = TaskMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, EditTaskArgs>
  export interface EditTaskArgs {
    projId: string

    task: TaskInput

    taskId: string
  }

  export type DeleteTaskResolver<
    R = TaskMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DeleteTaskArgs>
  export interface DeleteTaskArgs {
    projId: string

    id: string
  }

  export type DragTaskResolver<
    R = TaskMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DragTaskArgs>
  export interface DragTaskArgs {
    columnIds: DragTaskIdList[]

    id: string

    swimlaneIds: DragTaskIdList[]

    projectId: string
  }

  export type RegisterResolver<R = Auth, Parent = {}, TContext = {}> = Resolver<
    R,
    Parent,
    TContext,
    RegisterArgs
  >
  export interface RegisterArgs {
    username: string

    password: string

    email: string
  }

  export type LoginResolver<R = Auth, Parent = {}, TContext = {}> = Resolver<
    R,
    Parent,
    TContext,
    LoginArgs
  >
  export interface LoginArgs {
    email: string

    password: string
  }

  export type LoginWithCookieResolver<
    R = Auth,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type LogoutResolver<R = Void, Parent = {}, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
  export type CreateProjectResolver<
    R = Project,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, CreateProjectArgs>
  export interface CreateProjectArgs {
    name: string
  }

  export type EditProjectResolver<
    R = Project,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, EditProjectArgs>
  export interface EditProjectArgs {
    id: string

    newProj: ProjectInput
  }

  export type DeleteProjectResolver<
    R = DeleteReturn,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DeleteProjectArgs>
  export interface DeleteProjectArgs {
    id: string
  }

  export type CreateColumnResolver<
    R = ColumnMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, CreateColumnArgs>
  export interface CreateColumnArgs {
    projId: string

    name: string

    isCompletedColumn?: Maybe<boolean>

    taskLimit?: Maybe<number>
  }

  export type EditColumnResolver<
    R = ColumnMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, EditColumnArgs>
  export interface EditColumnArgs {
    colId: string

    projectId: string

    newCol: ColumnInput
  }

  export type DeleteColumnResolver<
    R = ColumnMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DeleteColumnArgs>
  export interface DeleteColumnArgs {
    _id: string

    projectId: string
  }

  export type JoinProjectResolver<
    R = Project,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, JoinProjectArgs>
  export interface JoinProjectArgs {
    projectId: string
  }

  export type LeaveProjectResolver<
    R = DeleteReturn,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, LeaveProjectArgs>
  export interface LeaveProjectArgs {
    projectId: string
  }

  export type CreateSwimlaneResolver<
    R = SwimlaneMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, CreateSwimlaneArgs>
  export interface CreateSwimlaneArgs {
    projId: string

    name: string
  }

  export type EditSwimlaneResolver<
    R = SwimlaneMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, EditSwimlaneArgs>
  export interface EditSwimlaneArgs {
    swimId: string

    projId: string

    newSwim: SwimlaneInput
  }

  export type DeleteSwimlaneResolver<
    R = SwimlaneMerge,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, DeleteSwimlaneArgs>
  export interface DeleteSwimlaneArgs {
    projId: string

    _id: string
  }

  export type RemoveMemberFromProjectResolver<
    R = Project,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, RemoveMemberFromProjectArgs>
  export interface RemoveMemberFromProjectArgs {
    projectId: string

    userId: string
  }

  export type SetCommentResolver<
    R = Task,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, SetCommentArgs>
  export interface SetCommentArgs {
    projId: string

    taskId: string

    commentId?: Maybe<string>

    description: string

    deleting: boolean
  }

  export type SetSubtaskResolver<
    R = Task,
    Parent = {},
    TContext = {}
  > = Resolver<R, Parent, TContext, SetSubtaskArgs>
  export interface SetSubtaskArgs {
    projId: string

    taskId: string

    subtaskId?: Maybe<string>

    info?: Maybe<SubtaskInfo>

    deleting: boolean
  }
}

export namespace TaskMergeResolvers {
  export interface Resolvers<TContext = {}, TypeParent = TaskMerge> {
    project?: ProjectResolver<Project, TypeParent, TContext>

    task?: TaskResolver<Maybe<Task>, TypeParent, TContext>
  }

  export type ProjectResolver<
    R = Project,
    Parent = TaskMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type TaskResolver<
    R = Maybe<Task>,
    Parent = TaskMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace AuthResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Auth> {
    user?: UserResolver<User, TypeParent, TContext>
  }

  export type UserResolver<R = User, Parent = Auth, TContext = {}> = Resolver<
    R,
    Parent,
    TContext
  >
}

export namespace VoidResolvers {
  export interface Resolvers<TContext = {}, TypeParent = Void> {
    message?: MessageResolver<string, TypeParent, TContext>
  }

  export type MessageResolver<
    R = string,
    Parent = Void,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace DeleteReturnResolvers {
  export interface Resolvers<TContext = {}, TypeParent = DeleteReturn> {
    id?: IdResolver<string, TypeParent, TContext>
  }

  export type IdResolver<
    R = string,
    Parent = DeleteReturn,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace ColumnMergeResolvers {
  export interface Resolvers<TContext = {}, TypeParent = ColumnMerge> {
    project?: ProjectResolver<Project, TypeParent, TContext>

    column?: ColumnResolver<Maybe<Column>, TypeParent, TContext>
  }

  export type ProjectResolver<
    R = Project,
    Parent = ColumnMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type ColumnResolver<
    R = Maybe<Column>,
    Parent = ColumnMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

export namespace SwimlaneMergeResolvers {
  export interface Resolvers<TContext = {}, TypeParent = SwimlaneMerge> {
    project?: ProjectResolver<Project, TypeParent, TContext>

    swimlane?: SwimlaneResolver<Maybe<Swimlane>, TypeParent, TContext>
  }

  export type ProjectResolver<
    R = Project,
    Parent = SwimlaneMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
  export type SwimlaneResolver<
    R = Maybe<Swimlane>,
    Parent = SwimlaneMerge,
    TContext = {}
  > = Resolver<R, Parent, TContext>
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<Date, any> {
  name: 'Date'
}

export type IResolvers<TContext = {}> = {
  Query?: QueryResolvers.Resolvers<TContext>
  Project?: ProjectResolvers.Resolvers<TContext>
  Tag?: TagResolvers.Resolvers<TContext>
  Column?: ColumnResolvers.Resolvers<TContext>
  Swimlane?: SwimlaneResolvers.Resolvers<TContext>
  Profile?: ProfileResolvers.Resolvers<TContext>
  Task?: TaskResolvers.Resolvers<TContext>
  SubTask?: SubTaskResolvers.Resolvers<TContext>
  Comment?: CommentResolvers.Resolvers<TContext>
  User?: UserResolvers.Resolvers<TContext>
  Mutation?: MutationResolvers.Resolvers<TContext>
  TaskMerge?: TaskMergeResolvers.Resolvers<TContext>
  Auth?: AuthResolvers.Resolvers<TContext>
  Void?: VoidResolvers.Resolvers<TContext>
  DeleteReturn?: DeleteReturnResolvers.Resolvers<TContext>
  ColumnMerge?: ColumnMergeResolvers.Resolvers<TContext>
  SwimlaneMerge?: SwimlaneMergeResolvers.Resolvers<TContext>
  Date?: GraphQLScalarType
} & { [typeName: string]: never }

export type IDirectiveResolvers<Result> = {
  skip?: SkipDirectiveResolver<Result>
  include?: IncludeDirectiveResolver<Result>
  deprecated?: DeprecatedDirectiveResolver<Result>
} & { [directiveName: string]: never }
export type TaskFieldsFragment = { __typename?: 'Task' } & Pick<
  Task,
  | 'points'
  | 'completed'
  | 'tags'
  | 'assignedUsers'
  | 'description'
  | 'dueDate'
  | 'startDate'
  | 'recurrance'
  | 'color'
  | 'timeWorkedOn'
  | 'name'
> & { id: Task['_id'] } & {
    subTasks: Array<
      { __typename?: 'SubTask' } & Pick<SubTask, 'name' | 'completed'> & {
          id: SubTask['_id']
        }
    >
    comments: Array<
      { __typename?: 'Comment' } & Pick<
        Comment,
        'description' | 'dateAdded' | 'lastEdited'
      > & { id: Comment['_id'] }
    >
  }

export type ProfileFieldsFragment = { __typename?: 'Profile' } & Pick<
  Profile,
  'profileImg' | 'username' | 'email' | 'projects'
> & { id: Profile['_id'] }

export type ColumnFieldsFragment = { __typename?: 'Column' } & Pick<
  Column,
  'name' | 'isCompletedColumn' | 'taskIds' | 'taskLimit'
> & { id: Column['_id'] }

export type ProjectFieldsFragment = { __typename?: 'Project' } & Pick<
  Project,
  'columnIds' | 'ownerId' | 'name'
> & { id: Project['_id'] } & {
    columns: Array<{ __typename?: 'Column' } & ColumnFieldsFragment>
    swimlanes: Array<
      { __typename?: 'Swimlane' } & Pick<Swimlane, 'taskIds' | 'name'> & {
          id: Swimlane['_id']
        }
    >
    users: Maybe<Array<{ __typename?: 'Profile' } & ProfileFieldsFragment>>
    tasks: Array<{ __typename?: 'Task' } & TaskFieldsFragment>
    tags: Maybe<
      Array<
        { __typename?: 'Tag' } & Pick<Tag, 'name' | 'color'> & {
            id: Tag['_id']
          }
      >
    >
  }

export type UserFieldsFragment = { __typename?: 'User' } & Pick<
  User,
  'profileImg' | 'username' | 'email'
> & { id: User['_id'] } & {
    projects: Array<{ __typename?: 'Project' } & ProjectFieldsFragment>
  }

export type LoginMutationVariables = {
  email: Scalars['String']
  password: Scalars['String']
}

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'Auth' } & {
    user: { __typename?: 'User' } & UserFieldsFragment
  }
}

export type RegisterMutationVariables = {
  username: Scalars['String']
  password: Scalars['String']
  email: Scalars['String']
}

export type RegisterMutation = { __typename?: 'Mutation' } & {
  register: { __typename?: 'Auth' } & {
    user: { __typename?: 'User' } & UserFieldsFragment
  }
}

export type LoginWithCookieMutationVariables = {}

export type LoginWithCookieMutation = { __typename?: 'Mutation' } & {
  loginWithCookie: { __typename?: 'Auth' } & {
    user: { __typename?: 'User' } & UserFieldsFragment
  }
}

export type LogoutMutationVariables = {}

export type LogoutMutation = { __typename?: 'Mutation' } & {
  logout: { __typename?: 'Void' } & Pick<Void, 'message'>
}

export type CreateColumnMutationVariables = {
  name: Scalars['String']
  projId: Scalars['String']
  isCompletedColumn?: Maybe<Scalars['Boolean']>
  taskLimit?: Maybe<Scalars['Int']>
}

export type CreateColumnMutation = { __typename?: 'Mutation' } & {
  createColumn: { __typename?: 'ColumnMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
    column: Maybe<{ __typename?: 'Column' } & ColumnFieldsFragment>
  }
}

export type DeleteColumnMutationVariables = {
  projectId: Scalars['String']
  id: Scalars['String']
}

export type DeleteColumnMutation = { __typename?: 'Mutation' } & {
  deleteColumn: { __typename?: 'ColumnMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
  }
}

export type EditColumnMutationVariables = {
  id: Scalars['String']
  projectId: Scalars['String']
  newCol: ColumnInput
}

export type EditColumnMutation = { __typename?: 'Mutation' } & {
  editColumn: { __typename?: 'ColumnMerge' } & {
    column: Maybe<{ __typename?: 'Column' } & ColumnFieldsFragment>
  }
}

export type CreateProjectMutationVariables = {
  name: Scalars['String']
}

export type CreateProjectMutation = { __typename?: 'Mutation' } & {
  createProject: { __typename?: 'Project' } & ProjectFieldsFragment
}

export type DeleteProjectMutationVariables = {
  id: Scalars['String']
}

export type DeleteProjectMutation = { __typename?: 'Mutation' } & {
  deleteProject: { __typename?: 'DeleteReturn' } & Pick<DeleteReturn, 'id'>
}

export type EditProjectMutationVariables = {
  id: Scalars['String']
  newProj: ProjectInput
}

export type EditProjectMutation = { __typename?: 'Mutation' } & {
  editProject: { __typename?: 'Project' } & ProjectFieldsFragment
}

export type CreateSwimlaneMutationVariables = {
  projId: Scalars['String']
  name: Scalars['String']
}

export type CreateSwimlaneMutation = { __typename?: 'Mutation' } & {
  createSwimlane: { __typename?: 'SwimlaneMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
    swimlane: Maybe<
      { __typename?: 'Swimlane' } & Pick<Swimlane, 'taskIds' | 'name'> & {
          id: Swimlane['_id']
        }
    >
  }
}

export type EditSwimlaneMutationVariables = {
  projId: Scalars['String']
  newSwim: SwimlaneInput
  swimId: Scalars['String']
}

export type EditSwimlaneMutation = { __typename?: 'Mutation' } & {
  editSwimlane: { __typename?: 'SwimlaneMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
    swimlane: Maybe<
      { __typename?: 'Swimlane' } & Pick<Swimlane, 'taskIds' | 'name'> & {
          id: Swimlane['_id']
        }
    >
  }
}

export type DeleteSwimlaneMutationVariables = {
  projId: Scalars['String']
  swimId: Scalars['String']
}

export type DeleteSwimlaneMutation = { __typename?: 'Mutation' } & {
  deleteSwimlane: { __typename?: 'SwimlaneMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
  }
}

export type SetSubtaskMutationVariables = {
  projId: Scalars['String']
  taskId: Scalars['String']
  subtaskId?: Maybe<Scalars['String']>
  info: SubtaskInfo
  deleting: Scalars['Boolean']
}

export type SetSubtaskMutation = { __typename?: 'Mutation' } & {
  setSubtask: { __typename?: 'Task' } & TaskFieldsFragment
}

export type SetCommentMutationVariables = {
  projId: Scalars['String']
  taskId: Scalars['String']
  commentId?: Maybe<Scalars['String']>
  description: Scalars['String']
  deleting: Scalars['Boolean']
}

export type SetCommentMutation = { __typename?: 'Mutation' } & {
  setComment: { __typename?: 'Task' } & TaskFieldsFragment
}

export type CreateTaskMutationVariables = {
  taskInfo: TaskInput
  projId: Scalars['String']
  columnId: Scalars['String']
}

export type CreateTaskMutation = { __typename?: 'Mutation' } & {
  createTask: { __typename?: 'TaskMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
    task: Maybe<{ __typename?: 'Task' } & TaskFieldsFragment>
  }
}

export type EditTaskMutationVariables = {
  projId: Scalars['String']
  taskId: Scalars['String']
  newTask: TaskInput
}

export type EditTaskMutation = { __typename?: 'Mutation' } & {
  editTask: { __typename?: 'TaskMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
    task: Maybe<{ __typename?: 'Task' } & TaskFieldsFragment>
  }
}

export type DeleteTaskMutationVariables = {
  projId: Scalars['String']
  taskId: Scalars['String']
}

export type DeleteTaskMutation = { __typename?: 'Mutation' } & {
  deleteTask: { __typename?: 'TaskMerge' } & {
    project: { __typename?: 'Project' } & ProjectFieldsFragment
  }
}

export type DragTaskMutationVariables = {
  columnIds: Array<DragTaskIdList>
  id: Scalars['String']
  swimlaneIds: Array<DragTaskIdList>
  projectId: Scalars['String']
}

export type DragTaskMutation = { __typename?: 'Mutation' } & {
  dragTask: { __typename?: 'TaskMerge' } & {
    task: Maybe<{ __typename?: 'Task' } & TaskFieldsFragment>
    project: { __typename?: 'Project' } & ProjectFieldsFragment
  }
}

export type ProjectQueryVariables = {
  id: Scalars['String']
}

export type ProjectQuery = { __typename?: 'Query' } & {
  projectById: Maybe<{ __typename?: 'Project' } & ProjectFieldsFragment>
}

export type ProjectsQueryVariables = {
  ids: Array<Scalars['String']>
}

export type ProjectsQuery = { __typename?: 'Query' } & {
  projects: Array<Maybe<{ __typename?: 'Project' } & ProjectFieldsFragment>>
}

export type UserQueryVariables = {
  id: Scalars['String']
}

export type UserQuery = { __typename?: 'Query' } & {
  user: Maybe<{ __typename?: 'User' } & UserFieldsFragment>
}