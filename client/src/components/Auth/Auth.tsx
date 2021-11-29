import React, { ComponentProps, useState } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Grid,
  Button,
  withStyles,
  WithStyles,
  Avatar,
  Typography,
  IconButton,
  TextField
} from '@material-ui/core'
import { LockOpen } from '@material-ui/icons'
import { formStyles } from '../styles/formStyles'
import { openSnackbarA } from '../../store/actions/snackbar'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import { registerA, loginA } from '../../store/actions/auth'
import { APILogin, APIRegister } from '../../API/auth'

const AuthInput = (inputProps: ComponentProps<any>) => {
  return (
    <TextField
      margin="dense"
      fullWidth
      required
      label="Full Name"
      {...inputProps}
    />
  )
}

const socialProviders = [
  {
    imageUrl:
      'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png',
    provider: 'google',
    appId:
      '139302918576-dhtoscrt1uh3kg2s1p54e5rj9c8rus4a.apps.googleusercontent.com'
  },
  {
    imageUrl:
      'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-512.png',
    provider: 'facebook',
    appId: '1232255530509893'
  },
  {
    imageUrl:
      'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-512.png',
    provider: 'github',
    appId: '373e2991118f9d8e97b1c8717ec9dd863df71461'
  }
]

type ActionCreators = typeof actionCreators

interface Props extends WithStyles<typeof formStyles>, ActionCreators {
  authType: 'Register' | 'Login'
}

const Auth = ({ authType, openSnackbar, classes, register, login }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [username, setUsername] = useState('')

  return (
    <div style={{ margin: 20 }}>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
        <meta
          content="Get started with Mantella today, totally free!"
          name={'description'}
        />
      </Helmet>
      <main className={classes.layout}>
        <form
          autoComplete="on"
          onSubmit={async (e) => {
            e.preventDefault()
            if (authType === 'Register') {
              const user = await APIRegister({
                email,
                password,
                username
              })
              if (user) {
                register(user)
                window.location.hash = '#/project/' + user.projects[0].id
              } else {
                openSnackbar(
                  'User with that Email already exists, Sorry!',
                  'error'
                )
              }
            } else {
              const user = await APILogin(email, password)
              login(user)
              window.location.hash = '#/calendar'
            }
          }}
        >
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOpen />
            </Avatar>
            <Typography style={{ fontSize: 17 }}>{authType}</Typography>
            {authType === 'Register' && (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                style={{ marginTop: 10 }}
              >
                Login Instead
              </Button>
            )}
            {authType === 'Register' && (
              <AuthInput
                onChange={(e: any) => setUsername(e.target.value)}
                autoComplete="off"
                value={username}
                label="Full Name"
              />
            )}
            <AuthInput
              name="email"
              autoComplete="on"
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value)
              }}
              label="Email"
              type="email"
            />
            <AuthInput
              autoComplete="on"
              label="Password"
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
            {authType === 'Register' && (
              <AuthInput
                type="password"
                autoComplete="off"
                label="Confirm Password"
                error={confirmText !== password}
                value={confirmText}
                onChange={(e: any) => setConfirmText(e.target.value)}
              />
            )}
            <Grid container justify="center" style={{ marginTop: '10px' }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={
                  authType === 'Register'
                    ? password.trim() === '' || password !== confirmText
                    : false
                }
                type="submit"
                style={{
                  marginTop: 10
                }}
              >
                {authType}
              </Button>
            </Grid>
            <Grid
              container
              style={{ marginTop: 15 }}
              alignContent="space-between"
            >
              {false &&
                socialProviders.map((media, i) => (
                  <IconButton onClick={() => null}>
                    <img
                      src={media.imageUrl}
                      style={{ height: 50, width: 50 }}
                      alt=""
                    />
                  </IconButton>
                ))}
            </Grid>
          </Paper>
        </form>
      </main>
    </div>
  )
}

const actionCreators = {
  openSnackbar: openSnackbarA,
  register: registerA,
  login: loginA
}

export const AuthRender = withStyles(formStyles)(
  connect(null, actionCreators)(Auth)
)
