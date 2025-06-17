import {
  ListSubheader,
  ListItem,
  ListItemText,
  Button,
  useTheme,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { List } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useTitle from './useTitle'
import { getPersistAuth, setPersistAuth } from '../localStorage'
import { inverse } from '../utils/color'
import { useAuthUser } from './PrivateRoute'
import {
  useDeleteAccountMutation,
  useLogoutMutation,
  useSetPasswordMutation
} from '../store/api'

export const Settings = () => {
  useTitle('Settings')

  const theme = useTheme()

  const [deleting, setDeleting] = useState(false)

  const { user } = useAuthUser()

  const [name, setName] = useState(user?.username ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [password, setPassword] = useState('')
  const [persist, setPersist] = useState(getPersistAuth()) // todo setPersist needs to update on server to delete session

  const [migrating, setMigrating] = useState(false)

  const [logout] = useLogoutMutation()
  const [setPasswordMutation] = useSetPasswordMutation()
  const [deleteAccount] = useDeleteAccountMutation()
  useEffect(() => {
    setName(user?.username ?? '')
    setEmail(user?.email ?? '')
  }, [user])

  return (
    <>
      <div>
        <Helmet>
          <style>{`body { background-color: ${inverse(
            theme.palette.background.paper,
            0.4
          )}; }`}</style>
        </Helmet>
        <List
          subheader={
            <ListSubheader style={{ borderRadius: 4 }}>Data</ListSubheader>
          }
          sx={{
            maxWidth: 1000,
            backgroundColor: theme.palette.background.paper,
            width: '95%'
          }}
          style={{ margin: 'auto', marginTop: 80, borderRadius: 4 }}
        >
          <ListItem>
            <ListItemText
              style={{ color: theme.palette.text.primary }}
              primary="Account Security"
              secondary="These actions cannot be undone"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                logout()
              }}
              style={{
                marginLeft: 'auto'
              }}
            >
              Log Out
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                if (!deleting) {
                  setDeleting(true)
                  setTimeout(() => {
                    setDeleting(false)
                  }, 3000)
                } else {
                  deleteAccount()
                }
              }}
              style={{ marginLeft: 12 }}
            >
              {deleting ? 'Confirm' : 'Delete Account'}
            </Button>
          </ListItem>
          <ListItem
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <ListItemText
              style={{ color: theme.palette.text.primary }}
              primary="Account Management"
              secondary="Guest accounts can be migrated to a full account by setting a name and email"
            />
            <div style={{ marginTop: 12 }}>
              <TextField
                label="Name"
                placeholder="Name"
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                disabled={!name || user?.username === name}
                style={{ marginLeft: 12, height: 40 }}
                variant="contained"
                onClick={async () => {
                  await axios.post('/setName', { username: name })
                }}
              >
                Confirm
              </Button>
            </div>
            <div style={{ marginTop: 12 }}>
              <TextField
                label="Email"
                type="email"
                placeholder="Email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                disabled={!email || user?.email === email}
                style={{ marginLeft: 12, height: 40 }}
                variant="contained"
                onClick={async () => {
                  const res = await axios.post('/setEmail', { email })

                  if (res.status === 200) {
                    setEmail(email)
                    if (user?.email === '') {
                      setMigrating(true)
                    }
                  } else {
                    setEmail(user?.email || '')
                  }
                }}
              >
                Confirm
              </Button>
            </div>
            {user?.email === '' && (
              <div style={{ marginTop: 12 }}>
                <TextField
                  label="Password"
                  type="password"
                  placeholder="Password"
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  disabled={!migrating || password.length < 1}
                  style={{ marginLeft: 12, height: 40 }}
                  variant="contained"
                  onClick={async () => {
                    await setPasswordMutation({ password })
                  }}
                >
                  Confirm
                </Button>
              </div>
            )}
          </ListItem>
          <ListItem
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <ListItemText
              primary="Preferences"
              style={{ color: theme.palette.text.primary }}
            />
            <div style={{ width: '100%', marginTop: 4 }}>
              {/* show a "stay logged in" toggle checkbox with MUI */}
              <FormControlLabel
                style={{ marginLeft: 0, color: 'white' }}
                control={
                  <Checkbox
                    checked={persist}
                    onChange={(e) => {
                      setPersist(e.target.checked)
                      setPersistAuth(e.target.checked)
                    }}
                    style={{ marginRight: 4 }}
                  />
                }
                label="Stay Logged In"
              />
            </div>
          </ListItem>
        </List>
      </div>
    </>
  )
}
