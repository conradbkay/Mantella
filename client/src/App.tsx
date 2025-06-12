import { useMemo, useState, createContext, useEffect, useRef } from 'react'
import { Provider, useSelector } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { store } from './store/store'
import { AuthRender } from './components/Auth'
import { CreateProject } from './components/CreateProject'
import { NoMatch } from './components/404/NoMatch'
import { CircularProgress } from '@mui/material'
import { About } from './components/Landing/About'
import { Header } from './components/Header/Header'
import { SnackbarRoot } from './components/SnackbarRoot'
import { Dashboard } from './components/Dashboard'
import { PublicOnlyRoute } from './components/Routing'
import { PrivateRoute } from './components/PrivateRoute'
import { Project } from './components/Project/Project'
import { Settings } from './components/Settings'
import { CalendarWeek } from './components/Calendar/Week'
import { APICookieLogin } from './API/auth'
import { useTheme } from '@mui/material'
import io from 'socket.io-client'
import { transformUser } from './store/auth'
import { SET_PROJECTS, selectProjects } from './store/projects'
import { LOGIN } from './store/user'
import { Chat } from './components/Chat/Chat'
import useTitle from './components/useTitle'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { TICK } from './store/projects'
import { SYNC_TIMER, SET_TIME } from './store/pomodoro'
import { id, toDaysHHMMSS } from './utils/utils'
import { APIEditTask } from './API/task'
import { getPersistAuth, getTheme, setTheme } from './localStorage'

const AllCalendarWeek = () => {
  const theme = useTheme()
  useTitle('Calendar')
  return (
    <div
      style={{
        height: 'calc(100vh - 58.5px)',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            : undefined
      }}
    >
      <div style={{ padding: '20px 50px 0px 50px' }}>
        <CalendarWeek />
      </div>
    </div>
  )
}

// ! this won't work in prod, need to do a different address then just proxy to correct in vite config
const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
  reconnectionDelayMax: 10000
})

const secondary = '#9D7CD0'
export const primary = '#7289da'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

let interval: NodeJS.Timeout = setInterval(() => null, Infinity)

const Router = () => {
  const [loaded, setLoaded] = useState(false)
  const dispatch = useAppDispatch()
  window.onload = async () => {
    try {
      if (getPersistAuth()) {
        const loginRes = await APICookieLogin()

        if (loginRes) {
          const authUser = transformUser(loginRes)

          dispatch(LOGIN({ user: authUser }))
          dispatch(SET_PROJECTS(loginRes.projects))
        }
      }
      setLoaded(true)
    } catch (err) {
      setLoaded(true)
    }
  }

  const projects = useSelector(selectProjects)
  const lastTickTimestampRef = useRef(0)

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!connected && projects.length > 0) {
      socket.emit('login', {
        chatIds: projects.map((proj) => proj.channels.map((c) => c[0])).flat()
      })
      setConnected(true)
    }
  }, [connected, projects])

  const { pomodoro } = useAppSelector((state) => ({
    pomodoro: state.pomodoro
  }))

  // since this component is always mounted when a project is open, for now we include this code here instead of in the Pomodoro component which can be unmounted
  useEffect(() => {
    clearInterval(interval)

    interval = setInterval(() => {
      const now = Date.now()
      if (!pomodoro.paused) {
        if (lastTickTimestampRef.current === 0) {
          lastTickTimestampRef.current = pomodoro.startTime || now
        }

        if (pomodoro.selectedTaskId && pomodoro.working) {
          const project = projects.find((proj) =>
            proj.tasks.some((task) => task.id === pomodoro.selectedTaskId)
          )!

          const task =
            project.tasks[id(project.tasks, pomodoro.selectedTaskId!)]

          const elapsedSeconds = Math.round(
            (now - lastTickTimestampRef.current) / 1000
          )
          // persist to server every minute
          if (
            Math.floor(task.timeWorkedOn / 60) <
            Math.floor((task.timeWorkedOn + elapsedSeconds) / 60)
          ) {
            APIEditTask(
              { ...task, timeWorkedOn: task.timeWorkedOn + elapsedSeconds },
              project.id
            )
          }

          if (elapsedSeconds > 0) {
            dispatch(
              TICK({
                taskId: pomodoro.selectedTaskId!,
                projectId: project.id,
                seconds: elapsedSeconds
              })
            )
          }
        }
        dispatch(SYNC_TIMER(now))
        lastTickTimestampRef.current = now
      } else {
        lastTickTimestampRef.current = 0
      }
      const remainingSeconds =
        pomodoro.currSeconds -
        Math.floor((Date.now() - pomodoro.startTime) / 1000)

      const displayTime = toDaysHHMMSS(
        remainingSeconds < 0 ? 0 : remainingSeconds
      )
      dispatch(SET_TIME(displayTime))

      document.title = pomodoro.paused
        ? 'Mantella'
        : `${pomodoro.working ? 'Work ' : 'Break '} ${displayTime}`

      return () => {
        document.title = 'Mantella'
        clearInterval(interval)
      }
    }, 1000)
  })

  return (
    <BrowserRouter>
      <Header />
      <div style={{ marginTop: 58.5 /* headerHeight */ }} />
      {/* <WelcomeDialog /> */}
      {loaded ? (
        <Switch>
          <PrivateRoute
            exact
            path="/settings"
            component={Settings}
            componentProps={{}}
          />
          <PrivateRoute
            exact
            path="/calendar"
            component={AllCalendarWeek}
            componentProps={{}}
          />
          <PublicOnlyRoute
            exact
            path="/login"
            component={AuthRender}
            componentProps={{ authType: 'Login' }}
          />
          <PublicOnlyRoute
            exact
            path="/register"
            component={AuthRender}
            componentProps={{ authType: 'Register' }}
          />
          <PrivateRoute
            exact
            path="/create-project"
            component={CreateProject}
            componentProps={{}}
          />
          <PrivateRoute
            exact
            path="/project/:id"
            component={Project}
            componentProps={{ socket }}
          />
          <PrivateRoute
            exact
            component={Chat}
            componentProps={{ socket }}
            path="/chat"
          />
          <PrivateRoute
            exact
            path="/dashboard"
            component={Dashboard}
            componentProps={{}}
          />
          <PublicOnlyRoute
            exact
            path="/"
            component={About}
            componentProps={() => ({})}
          />
          <Route component={NoMatch} />
        </Switch>
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <CircularProgress
            style={{
              width: '128px',
              height: '128px',
              marginRight: 64,
              marginTop: 100
            }}
          />
        </div>
      )}
    </BrowserRouter>
  )
}

export const Wrapper = () => {
  const [mode, setMode] = useState(getTheme() || 'dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light'
        setTheme(newMode)
        setMode(newMode)
      }
    }),
    [mode]
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as any,
          primary: {
            main: primary
          },
          secondary: {
            main: secondary
          }
        }
      }),
    [mode]
  )

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SnackbarRoot />
          <Router />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  )
}
