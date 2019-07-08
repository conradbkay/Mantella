import { ProjectFieldsFragment } from './types'
import { MutationResult } from 'react-apollo'
import { ApolloServer } from 'apollo-server-express'
import { queries } from './graphql/queries/queries'
import { mutations } from './graphql/mutations/mutations'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'

// Load models since we will not be instantiating our express server.
mongoose.connect(
  process.env.DB_CONNECT ||
    'mongodb+srv://conrad:cokay101@kanbanbrawn-41gbz.mongodb.net/kanban?retryWrites=true',
  { useNewUrlParser: true }
)

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const { createTestClient } = require('apollo-server-testing')

const resolvers: any = {
  Query: queries,
  Mutation: mutations
}

const typeDefs: any = [
  fs.readFileSync(path.join(__dirname, './graphql/schema.graphql'), 'utf8')
]

const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: false,
  context: ({ req, res }) => {
    return {
      req,
      res,
      user: {
        projects: ['5d018bc58104190fe6e2ac2c'],
        _id: '5d018bc58104190fe6e2ac2d',
        password:
          '$2a$10$LL5wFKVW./hWctu8lypf/.geDiezQhQG6rYdbI7fIsVd0wfzYJwha',
        email: 'conradkay123@gmjail.com',
        username: 'kachow',
        profileImg:
          'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png',
        __v: 0
      }
    }
  }
})

export const test = createTestClient(gqlServer)

export const gqlReq = async <Q, V>(args: {
  query: any
  variables: V
  isMutation: boolean
  onError?: (err: any) => void
}): Promise<MutationResult<Q>> => {
  const result = args.isMutation
    ? await test.mutate({ mutation: args.query, variables: args.variables })
    : await test.query({ query: args.query, variables: args.variables })

  return result
}

export const projToSnapshot = (project: ProjectFieldsFragment) => {
  return {
    ...project,
    id: 'PROJECT_ID',
    columns: project.columns.map((column, i) => {
      return {
        ...column,
        id: `COL_ID ${i}`,
        taskIds: column.taskIds.map((taskId, e) => `TASK_ID ${e}`)
      }
    }),
    columnIds: project.columnOrder.map((columnId, i) => `COL_ID ${i}`),
    ownerId: 'OWNER_ID',
    swimlanes: project.swimlanes.map((swimlane, i) => {
      return {
        ...swimlane,
        id: `SWIM_ID ${i}`,
        taskIds: swimlane.taskIds.map((taskId, e) => `TASK_ID ${e}`)
      }
    }),
    tags: project.tags!.map((tag, i) => {
      return { ...tag, id: `TAG_ID ${i}` }
    }),
    tasks: project.tasks.map((task, i) => {
      return {
        ...task,
        id: `TASK_ID ${i}`,
        subTasks: task.subTasks.map((subTask, e) => {
          return { ...subTask, id: `SUBTASK_ID ${e}` }
        }),
        comments: task.comments.map((comment, e) => {
          return { ...comment, id: `COMMENT_ID ${e}` }
        })
      }
    }),
    users: project.users!.map((user, i) => {
      return { id: `USER_ID ${i}` }
    })
  }
}
