import { ComponentProps, useState } from 'react'
import { connect } from 'react-redux'
import {
  Paper,
  Grid,
  Button,
  Avatar,
  Typography,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material'
import LockOpen from '@mui/icons-material/LockOpen'
import { useFormStyles } from '../styles/formStyles'
import { openSnackbarA } from '../../store/actions/snackbar'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { registerA, loginA } from '../../store/actions/auth'
import { APILogin, APIRegister } from '../../API/auth'

const AuthInput = (inputProps: ComponentProps<any>) => {
  return <TextField margin="dense" fullWidth required {...inputProps} />
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
      'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-social-github-512.png',
    provider: 'github',
    appId: '373e2991118f9d8e97b1c8717ec9dd863df71461'
  }
]

type ActionCreators = typeof actionCreators

interface Props extends ActionCreators {
  authType: 'Register' | 'Login'
}

const Auth = ({ authType, openSnackbar, register, login }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')

  const classes = useFormStyles()

  return (
    <div style={{ margin: 20 }}>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
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
                window.location.href = '/project/' + user.projects[0].id
              } else {
                openSnackbar(
                  'User with that Email already exists, Sorry!',
                  'error'
                )
              }
            } else {
              const user = await APILogin(email, password)
              if (user) {
                login(user)
                window.location.href = '/calendar'
              } else {
                openSnackbar('Could not login', 'error')
              }
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
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
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: '10px' }}
            >
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

export const AuthRender = connect(null, actionCreators)(Auth)
