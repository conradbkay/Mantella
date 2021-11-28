import React, { useState } from 'react'
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

type SocialButtonProps = {
  imageUrl: string
  provider: string
  appId: string
}

const SocialButton = (props: SocialButtonProps) => {
  return (
    <IconButton>
      <img src={props.imageUrl} style={{ height: 50, width: 50 }} alt="" />
    </IconButton>
  )
}

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
            } else if (authType === 'Login') {
              await APILogin(email, password)
              window.location.hash = '#/calendar'
            } else {
              openSnackbar('Could not login, oopsie!', 'error')
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
              <TextField
                margin="dense"
                fullWidth
                required
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                label="Full Name"
              />
            )}
            <TextField
              margin="dense"
              fullWidth
              name="email"
              required
              autoComplete="on"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              label="Email"
              type="email"
            />
            <TextField
              margin="dense"
              fullWidth
              required
              autoComplete="on"
              label="Password"
              name="password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {authType === 'Register' && (
              <TextField
                type="password"
                margin="dense"
                fullWidth
                required
                autoComplete="off"
                label="Confirm Password"
                error={confirmText !== password}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
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
              {[
                {
                  imageUrl:
                    'https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png',
                  provider: 'google',
                  appId: 'AIzaSyDaxgICy9wGwo98I3QGFvAy4s1gBbqJmsY'
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
                },
                {
                  imageUrl:
                    'https://cdn0.iconfinder.com/data/icons/most-usable-logos/120/Amazon-512.png',
                  provider: 'amazon',
                  appId: '1d526f19eb4b402d9be7c21ed04c55e5'
                }
              ].map((media, i) => (
                <SocialButton key={i} {...media} provider={media.provider} />
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
