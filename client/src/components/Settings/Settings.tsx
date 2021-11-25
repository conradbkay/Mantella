import React from 'react'
import {
  Theme,
  createStyles,
  WithStyles,
  withStyles,
  ListSubheader,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core'
import { List } from '@material-ui/core'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { openSnackbarA } from '../../store/actions/snackbar'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 1000,
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: theme.palette.background.paper,
      width: '95%',
      marginTop: 50
    }
  })

type TProps = WithStyles<typeof styles> & typeof actionCreators

const CSettings = (props: TProps) => {
  const { classes } = props
  return (
    <>
      <div>
        <Helmet>
          <style>{'body { background-color: #eeeeee; }'}</style>
        </Helmet>
        <List
          subheader={<ListSubheader>Data</ListSubheader>}
          className={classes.root}
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
                location.href = '#/'
                location.reload()
                // TODO: actually implement logout
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

export const Settings = connect(null, { ...actionCreators })(
  withStyles(styles)(CSettings)
)
