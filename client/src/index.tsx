import React, { CSSProperties, useState } from 'react'
import { render } from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Switch, Route, HashRouter } from 'react-router-dom'

import { store } from './store/store'
import { createMuiTheme } from '@material-ui/core/styles'
import { Pomodoro } from './components/Pomodoro/Pomodoro'
import { AuthRender } from './components/Auth/Auth'
import { CreateProject } from './components/createProject/CreateProject'
import { NoMatch } from './components/NoMatch/NoMatch'
import { Fab, CircularProgress } from '@material-ui/core'
import { Timer } from '@material-ui/icons'
import { About } from './components/Landing/About'
import { Header } from './components/Header'
import { SnackbarRoot } from './components/utils/SnackbarRoot'
import { loginA } from './store/actions/auth'
import { Dashboard } from './components/Dashboard/Dashboard'
import { openSnackbarA } from './store/actions/snackbar'
import { PublicOnlyRoute, PrivateRoute } from './components/utils/Routing'
import { Project } from './components/Project/Project'
import { Settings } from './components/Settings/Settings'
import { CalendarWeek } from './components/Calendar/Week'
import Moment from 'moment'
import 'react-widgets/dist/css/react-widgets.css'
import { APILogin } from './API/auth'

const momentLocalizer = require('react-widgets-moment')

const secondary = '#0336FF'
const primary = '#00838f'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary
    },
    secondary: {
      main: secondary
    }
  }
})

export const fabStyle: CSSProperties = {
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: 999
}

const Router = () => {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  window.onload = async () => {
    try {
      const loginRes = await APILogin()

      if (loginRes) {
        store.dispatch(loginA(loginRes) as any)
      } else {
        store.dispatch(openSnackbarA('Hey there, Welcome!', 'standard'))
      }

      setLoaded(true)
    } catch (err) {
      setLoaded(true)
    }
  }

  return (
    <HashRouter>
      <Header />
      <Pomodoro open={open} stateFunc={(bool: boolean) => setOpen(bool)} />
      {/* <WelcomeDialog /> */}
      {!open && (
        <>
          <Fab style={fabStyle} color="secondary" onClick={() => setOpen(true)}>
            <Timer />
          </Fab>
        </>
      )}
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
    </HashRouter>
  )
}

export const Wrapper = () => {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <SnackbarRoot />
        <Router />
      </MuiThemeProvider>
    </Provider>
  )
}

Moment.locale('en')
momentLocalizer()

render(<Wrapper />, document.getElementById('root'))
