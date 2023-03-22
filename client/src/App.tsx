import { useMemo, useState, createContext } from 'react'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { store } from './store/store'
import { AuthRender } from './components/Auth'
import { CreateProject } from './components/CreateProject'
import { NoMatch } from './components/NoMatch/NoMatch'
import { CircularProgress } from '@mui/material'
import { About } from './components/Landing/About'
import { Header } from './components/Header'
import { SnackbarRoot } from './components/utils/SnackbarRoot'
import { loginA } from './store/actions/auth'
import { Dashboard } from './components/Dashboard'
import { PublicOnlyRoute } from './components/utils/Routing'
import { PrivateRoute } from './components/utils/PrivateRoute'
import { Project } from './components/Project/Project'
import { Settings } from './components/Settings'
import { CalendarWeek } from './components/Calendar/Week'
import { APICookieLogin } from './API/auth'
import io from 'socket.io-client'

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling']
})

const secondary = '#cc1100'
const primary = '#00838f'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

const Router = () => {
  const [loaded, setLoaded] = useState(false)

  window.onload = async () => {
    try {
      const loginRes = await APICookieLogin()

      if (loginRes) {
        store.dispatch(loginA(loginRes) as any)
      }

      setLoaded(true)
    } catch (err) {
      setLoaded(true)
    }
  }

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
            component={CalendarWeek}
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
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      }
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
