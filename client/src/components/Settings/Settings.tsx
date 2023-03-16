import {
  Theme,
  ListSubheader,
  ListItem,
  ListItemText,
  Button
} from '@mui/material'
import { List } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { APILogout } from '../../API/auth'
import { openSnackbarA } from '../../store/actions/snackbar'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 1000,
    backgroundColor: theme.palette.background.paper,
    width: '95%'
  }
}))

type ActionCreators = typeof actionCreators

interface TProps extends ActionCreators {}

const CSettings = (props: TProps) => {
  const classes = useStyles()
  return (
    <>
      <div>
        <Helmet>
          <style>{'body { background-color: #eeeeee; }'}</style>
        </Helmet>
        <List
          subheader={<ListSubheader>Data</ListSubheader>}
          className={classes.root}
          style={{ margin: 'auto', marginTop: 80 }}
        >
          <ListItem>
            <ListItemText
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

const actionCreators = {
  openSnackbar: openSnackbarA
}

export const Settings = connect(null, { ...actionCreators })(CSettings)
