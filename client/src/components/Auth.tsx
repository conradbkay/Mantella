import { ComponentProps, useState } from 'react'
import {
  Paper,
  Button,
  Avatar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Box,
  Stack
} from '@mui/material'
import LockOpen from '@mui/icons-material/LockOpen'
import {
  formStyleAvatar,
  formStyleLayout,
  formStylePaper
} from './styles/formStyles'
import Helmet from 'react-helmet'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import useTitle from './useTitle'
import { setPersistAuth } from '../localStorage'
import { useLoginMutation, useRegisterMutation } from '../store/api'
import { useNavigate } from '@tanstack/react-router'

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

  const navigate = useNavigate()

  const [login, loginResult] = useLoginMutation()
  const [register, registerResult] = useRegisterMutation()

  useTitle(authType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPersistAuth(persist)

    try {
      let result
      if (authType === 'Register') {
        result = await register({
          email,
          username,
          password,
          persist
        }).unwrap()
      } else {
        result = await login({ email, password, persist }).unwrap()
      }

      if (result?.user) {
        // Authentication successful
        if (result.user.projectIds && result.user.projectIds.length > 0) {
          // Navigate to the first project if available
          navigate({
            to: '/project/$id',
            params: { id: result.user.projectIds[0] }
          })
        } else {
          // No projects, navigate to dashboard
          navigate({ to: '/dashboard' })
        }
      }
    } catch (error) {
      // RTK Query provides error details in the mutation result
      console.error('Auth error:', error)
    }
  }

  const isLoading = loginResult.isLoading || registerResult.isLoading

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 57.5px)',
        backgroundColor: '#1d364c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; }`}</style>
      </Helmet>
      <Box component="main" sx={formStyleLayout}>
        <Paper
          elevation={6}
          sx={{
            ...formStylePaper,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          <form
            autoComplete="on"
            onSubmit={handleSubmit}
            style={{ width: '100%' }}
          >
            <Stack spacing={2} alignItems="center">
              <Avatar
                sx={{
                  ...formStyleAvatar,
                  width: 56,
                  height: 56,
                  mb: 1
                }}
              >
                <LockOpen sx={{ fontSize: 28 }} />
              </Avatar>

              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1
                }}
              >
                {authType}
              </Typography>
            </Stack>

            <Box sx={{ mt: 2, width: '100%' }}>
              {authType === 'Register' && (
                <AuthInput
                  onChange={(e: any) => setUsername(e.target.value)}
                  autoComplete="name"
                  value={username}
                  label="Full Name"
                  variant="outlined"
                />
              )}

              <AuthInput
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e: any) => {
                  setEmail(e.target.value)
                }}
                label="Email Address"
                type="email"
                variant="outlined"
              />

              <AuthInput
                autoComplete="current-password"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                        size="large"
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
                  autoComplete="new-password"
                  label="Confirm Password"
                  variant="outlined"
                  error={confirmText !== '' && confirmText !== password}
                  helperText={
                    confirmText !== '' && confirmText !== password
                      ? 'Passwords do not match'
                      : ''
                  }
                  value={confirmText}
                  onChange={(e: any) => setConfirmText(e.target.value)}
                />
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  mt: 1,
                  mb: 1
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={persist}
                      onChange={(e) => setPersist(e.target.checked)}
                      defaultChecked
                      color="secondary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Stay Logged In
                    </Typography>
                  }
                />
              </Box>

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={
                  isLoading ||
                  (authType === 'Register'
                    ? password.trim() === '' ||
                      password !== confirmText ||
                      username.trim() === ''
                    : email.trim() === '' || password.trim() === '')
                }
                type="submit"
                size="large"
                sx={{
                  mt: 1,
                  mb: 1,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                }}
              >
                {isLoading ? 'Please wait...' : authType}
              </Button>

              {/* Error messages */}
              {loginResult.error && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      padding: 1.5,
                      borderRadius: 1,
                      border: '1px solid rgba(244, 67, 54, 0.3)'
                    }}
                  >
                    Unable to login. Please check your credentials.
                  </Typography>
                </Box>
              )}

              {registerResult.error && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      padding: 1.5,
                      borderRadius: 1,
                      border: '1px solid rgba(244, 67, 54, 0.3)'
                    }}
                  >
                    User with that email already exists. Please try logging in
                    instead.
                  </Typography>
                </Box>
              )}

              {false && (
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Or continue with
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    {socialProviders.map((media, i) => (
                      <IconButton
                        key={i}
                        onClick={() => null}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 1.5
                        }}
                      >
                        <img
                          src={media.imageUrl}
                          style={{ height: 24, width: 24 }}
                          alt={`${media.provider} login`}
                        />
                      </IconButton>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  )
}
