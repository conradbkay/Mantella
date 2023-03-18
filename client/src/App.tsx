import { useState } from 'react'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import { store } from './store/store'
import { AuthRender } from './components/Auth/Auth'
import { CreateProject } from './components/createProject/CreateProject'
import { NoMatch } from './components/NoMatch/NoMatch'
import { CircularProgress } from '@mui/material'
import { About } from './components/Landing/About'
import { Header } from './components/Header'
import { SnackbarRoot } from './components/utils/SnackbarRoot'
import { loginA } from './store/actions/auth'
import { Dashboard } from './components/Dashboard/Dashboard'
import { PublicOnlyRoute } from './components/utils/Routing'
import { PrivateRoute } from './components/utils/PrivateRoute'
import { Project } from './components/Project/Project'
import { Settings } from './components/Settings/Settings'
import { CalendarWeek } from './components/Calendar/Week'
import { APICookieLogin } from './API/auth'

const secondary = '#0336FF'
const primary = '#00838f'

const theme = createTheme({
  palette: {
    //mode: 'dark',
    primary: {
      main: primary
    },
    secondary: {
      main: secondary
    }
  }
})

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
            componentProps={{}}
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
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarRoot />
        <Router />
      </ThemeProvider>
    </Provider>
  )
}
