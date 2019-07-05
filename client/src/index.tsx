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
import { About } from './components/About/About'

import { Header } from './components/Header'
import { WelcomeDialog } from './components/Welcome/WelcomeDialog'
import { SnackbarRoot } from './components/utils/SnackbarRoot'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks'
import { print } from 'graphql'
import { loginA } from './store/actions/auth'
import { Mutation } from './graphql/types'
import { fetchQuery } from './API/initialize'

// const primary = '#0336FF'
// const secondary = '#00838f'
const primary = '#f4511e'
const secondary = '#3f51b5'

/** @description Material ui theme, used in wrapper.tsx */

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

import { openSnackbarA } from './store/actions/snackbar'
import { GQL_LOGIN_WITH_COOKIE } from './graphql/mutations/auth'
import { client } from './apollo'

const Router = () => {
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  window.onload = async () => {
    try {
      const {
        loginWithCookie
      }: { loginWithCookie: Mutation['loginWithCookie'] } = await fetchQuery(
        print(GQL_LOGIN_WITH_COOKIE)
      )

      if (loginWithCookie && loginWithCookie.user) {
        store.dispatch(loginA(loginWithCookie.user as any) as any)
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
      <>
        <Header />
        <Pomodoro open={open} stateFunc={(bool: boolean) => setOpen(bool)} />
        <WelcomeDialog />
        {!open && (
          <>
            <Fab
              style={fabStyle}
              color="secondary"
              onClick={() => setOpen(true)}
            >
              <Timer />
            </Fab>
          </>
        )}
        {loaded ? (
          <Switch>
            <Route
              exact
              path="/login"
              render={() => <AuthRender authType="Login" />}
            />
            <Route
              exact
              path="/register"
              render={() => <AuthRender authType="Register" />}
            />
            <Route
              exact
              path="/create-project"
              render={() => <CreateProject />}
            />
            <Route exact path="/" component={() => <About />} />
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
      </>
    </HashRouter>
  )
}

export const Wrapper = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <MuiThemeProvider theme={theme}>
            <SnackbarRoot />
            <Router />
          </MuiThemeProvider>
        </ApolloHooksProvider>
      </ApolloProvider>
    </Provider>
  )
}

render(<Wrapper />, document.getElementById('root'))