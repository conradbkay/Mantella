import { ComponentProps, useState } from 'react'
import {
  Paper,
  Grid,
  Button,
  Avatar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import LockOpen from '@mui/icons-material/LockOpen'
import { useFormStyles } from './styles/formStyles'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { APILogin, APIRegister } from '../API/auth'
import { useHistory } from 'react-router'
import { useAppDispatch } from '../store/hooks'
import { transformUser } from '../store/auth'
import { OPEN_SNACKBAR } from '../store/snackbar'
import { SET_PROJECTS } from '../store/projects'
import { LOGIN, REGISTER } from '../store/user'
import useTitle from './useTitle'
import { setPersistAuth } from '../localStorage'

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

interface Props {
  authType: 'Register' | 'Login'
}

export const AuthRender = ({ authType }: Props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [persist, setPersist] = useState(true)

  const navigate = useHistory()
  const classes = useFormStyles()
  const dispatch = useAppDispatch()

  useTitle(authType)

  return (
    <div style={{ padding: 20 }}>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
      </Helmet>
      <main className={classes.layout}>
        <form
          autoComplete="on"
          onSubmit={async (e) => {
            e.preventDefault()

            setPersistAuth(persist)

            if (authType === 'Register') {
              const user = await APIRegister({
                email,
                password,
                username,
                persist
              })
              if (user) {
                const authUser = transformUser(user)

                dispatch(REGISTER({ user: authUser }))

                dispatch(SET_PROJECTS(user.projects))
                navigate.push('/project/' + user.projects[0].id)
              } else {
                dispatch(
                  OPEN_SNACKBAR({
                    message: 'User with that Email already exists, Sorry!',
                    variant: 'error'
                  })
                )
              }
            } else {
              const user = await APILogin(email, password, persist)
              if (user) {
                const authUser = transformUser(user)

                dispatch(LOGIN({ user: authUser }))
                dispatch(SET_PROJECTS(user.projects))
              } else {
                dispatch(
                  OPEN_SNACKBAR({
                    message: 'Could not login',
                    variant: 'error'
                  })
                )
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
              InputProps={{
                endAdornment: (
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
                )
              }}
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
            <div style={{ width: '100%', marginTop: 4 }}>
              {/* show a "stay logged in" toggle checkbox with MUI */}
              <FormControlLabel
                style={{ marginLeft: 0 }}
                control={
                  <Checkbox
                    checked={persist}
                    onChange={(e) => setPersist(e.target.checked)}
                    defaultChecked
                    style={{ marginRight: 4 }}
                  />
                }
                label="Stay Logged In"
              />
            </div>

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
