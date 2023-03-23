import {
  Theme,
  ListSubheader,
  ListItem,
  ListItemText,
  Button,
  useTheme
} from '@mui/material'
import { List } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Helmet } from 'react-helmet'
import { APILogout } from '../API/auth'
import Color from 'color'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    width: '95%'
  }
}))

export const Settings = () => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <>
      <div>
        <Helmet>
          <style>{`body { background-color: ${new Color(
            theme.palette.background.paper
          )
            .lighten(0.5)
            .hex()
            .toString()}; }`}</style>
        </Helmet>
        <List
          subheader={<ListSubheader>Data</ListSubheader>}
          className={classes.root}
          style={{ margin: 'auto', marginTop: 80 }}
        >
          <ListItem>
            <ListItemText
              style={{ color: theme.palette.text.primary }}
              primary="Log Out"
              secondary="This action cannot be undone"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                APILogout()
              }}
              style={{
                marginLeft: 'auto'
              }}
            >
              Log Out
            </Button>
          </ListItem>
        </List>
      </div>
    </>
  )
}
