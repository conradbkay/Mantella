import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TProject, TTask, TList } from '../types/project'
import { TAuthUser } from '../types/state'
import { dragTask, getDragEventData } from '../utils/dragTask'

export const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include' // equivalent to axios withCredentials: true
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Project', 'User', 'Task', 'List'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<
      { user: TAuthUser & { projectIds: string[] } },
      { email: string; password: string; persist: boolean }
    >({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      }),
      transformResponse: (response: { user: any }) => ({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          profileImg: response.user.profileImg,
          projectIds: response.user.projectIds || []
        }
      }),
      invalidatesTags: ['User', 'Project']
    }),

    register: builder.mutation<
      { user: TAuthUser & { projectIds: string[] } },
      { email: string; username: string; password: string; persist: boolean }
    >({
      query: (registerData) => ({
        url: '/register',
        method: 'POST',
        body: registerData
      }),
      transformResponse: (response: { user: any }) => ({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          profileImg: response.user.profileImg,
          projectIds: response.user.projectIds || []
        }
      }),
      invalidatesTags: ['User', 'Project']
    }),

    cookieLogin: builder.mutation<
      { user: TAuthUser & { projectIds: string[] } },
      void
    >({
      query: () => ({
        url: '/cookieLogin',
        method: 'POST'
      }),
      transformResponse: (response: { user: any }) => ({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          profileImg: response.user.profileImg,
          projectIds: response.user.projectIds || []
        }
      })
      // invalidatesTags: ['User', 'Project']
    }),

    guestLogin: builder.mutation<
      { user: TAuthUser & { projectIds: string[] } },
      void
    >({
      query: () => ({
        url: '/guestLogin',
        method: 'POST'
      }),
      transformResponse: (response: { user: any }) => ({
        user: {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          profileImg: response.user.profileImg,
          projectIds: response.user.projectIds || []
        }
      }),
      invalidatesTags: ['User', 'Project']
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST'
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          window.location.reload()
        } catch {}
      }
    }),

    setPassword: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: '/setPassword',
        method: 'POST',
        body
      })
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/deleteAccount',
        method: 'POST'
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          window.location.reload()
        } catch {}
      }
    }),

    // Project endpoints
    getProjects: builder.query<TProject[], void>({
      query: () => ({
        url: '/projects',
        method: 'POST'
      }),
      providesTags: (result) => [
        ...(result || []).map(({ id }) => ({ type: 'Project' as const, id })),
        { type: 'Project', id: 'LIST' }
      ]
    }),

    createProject: builder.mutation<TProject, { name: string }>({
      query: (body) => ({
        url: '/createProject',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject }) => response.project,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newProject } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              draft.push(newProject)
            })
          )
        } catch {}
      }
    }),

    editProject: builder.mutation<
      TProject,
      { id: string; newProj: { name?: string; colors?: string[] } }
    >({
      query: ({ id, newProj }) => ({
        url: '/editProject',
        method: 'POST',
        body: { id, newProj }
      }),
      transformResponse: (response: { project: TProject }) => response.project,
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === id)
              if (index !== -1) {
                draft[index] = updatedProject
              }
            })
          )
        } catch {}
      }
    }),

    deleteProject: builder.mutation<string, string>({
      query: (id) => ({
        url: '/deleteProject',
        method: 'POST',
        body: { id }
      }),
      transformResponse: (response: { id: string }) => response.id,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === id)
              if (index !== -1) {
                draft.splice(index, 1)
              }
            })
          )
        } catch {}
      }
    }),

    shareProject: builder.mutation<
      TProject,
      { projectId: string; email: string }
    >({
      query: (body) => ({
        url: '/shareProject',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject }) => response.project,
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedProject } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex(
                (project) => project.id === projectId
              )
              if (index !== -1) {
                draft[index] = updatedProject
              }
            })
          )
        } catch {}
      }
    }),

    kickUser: builder.mutation<
      { project: TProject },
      { projectId: string; userId: string }
    >({
      query: ({ projectId, userId }) => ({
        url: '/kickUserFromProject',
        method: 'POST',
        body: { projectId, userId }
      }),
      async onQueryStarted({ projectId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex(
                (project) => project.id === projectId
              )
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    // Task endpoints
    createTask: builder.mutation<
      { project: TProject },
      { projId: string; listId: string; taskInfo: Partial<TTask> }
    >({
      query: (body) => ({
        url: '/createTask',
        method: 'POST',
        body
      }),
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    editTask: builder.mutation<
      any,
      { taskId: string; task: TTask; projId: string }
    >({
      query: ({ taskId, task, projId }) => ({
        url: '/editTask',
        method: 'POST',
        body: { taskId, task, projId }
      }),
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data && data.project) {
            // Update the projects list cache
            dispatch(
              api.util.updateQueryData('getProjects', undefined, (draft) => {
                const index = draft.findIndex(
                  (project) => project.id === projId
                )
                if (index !== -1) {
                  draft[index] = data.project
                }
              })
            )
          }
        } catch {}
      }
    }),

    deleteTask: builder.mutation<
      { project: TProject },
      { id: string; projId: string }
    >({
      query: ({ id, projId }) => ({
        url: '/deleteTask',
        method: 'POST',
        body: { id, projId }
      }),
      transformResponse: (response: { project: TProject }) => response,
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    dragTask: builder.mutation<
      { project: TProject },
      ReturnType<typeof getDragEventData> & { projectId: string }
    >({
      query: (body) => ({
        url: '/dragTask',
        method: 'POST',
        body
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        // Optimistic update
        const patchResult = dispatch(
          api.util.updateQueryData('getProjects', undefined, (draft) => {
            const projectIndex = draft.findIndex(
              (project) => project.id === args.projectId
            )
            if (projectIndex !== -1) {
              const project = draft[projectIndex]

              dragTask({
                project,
                ...args
              })
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          // Rollback the optimistic update on error
          patchResult.undo()
        }
      }
    }),

    assignUserToTask: builder.mutation<
      { project: TProject; task: TTask },
      { taskId: string; projId: string; userId: string }
    >({
      query: (body) => ({
        url: '/assignUserToTask',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject; task: TTask }) =>
        response,
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    // Subtask endpoints
    setSubtask: builder.mutation<
      { project: TProject; task: TTask },
      {
        projId: string
        taskId: string
        subtaskId: string
        info?: {
          name?: string
          completed?: boolean
          orderIndex?: number
        }
      }
    >({
      query: (body) => ({
        url: '/setSubtask',
        method: 'POST',
        body
      }),
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    // List endpoints
    createList: builder.mutation<
      { project: TProject; list: TList },
      { projId: string; name: string }
    >({
      query: (body) => ({
        url: '/createList',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject; list: TList }) =>
        response,
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    editList: builder.mutation<
      { project: TProject; list: TList },
      { projId: string; listId: string; newList: { name: string } }
    >({
      query: (body) => ({
        url: '/editList',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject; list: TList }) =>
        response,
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    deleteList: builder.mutation<
      { project: TProject },
      { projId: string; id: string }
    >({
      query: (body) => ({
        url: '/deleteList',
        method: 'POST',
        body
      }),
      transformResponse: (response: { project: TProject }) => response,
      async onQueryStarted({ projId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          // Update the projects list cache
          dispatch(
            api.util.updateQueryData('getProjects', undefined, (draft) => {
              const index = draft.findIndex((project) => project.id === projId)
              if (index !== -1) {
                draft[index] = data.project
              }
            })
          )
        } catch {}
      }
    }),

    setListIdx: builder.mutation<
      void,
      { projId: string; listId: string; offset: number }
    >({
      query: (body) => ({
        url: '/setListIdx',
        method: 'POST',
        body
      }),
      invalidatesTags: (result, error, { projId }) => [
        { type: 'Project', id: projId }
      ]
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useCookieLoginMutation,
  useGuestLoginMutation,
  useLogoutMutation,
  useSetPasswordMutation,
  useDeleteAccountMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useShareProjectMutation,
  useKickUserMutation,
  useCreateTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useDragTaskMutation,
  useAssignUserToTaskMutation,
  useSetSubtaskMutation,
  useCreateListMutation,
  useEditListMutation,
  useDeleteListMutation,
  useSetListIdxMutation
} = api
