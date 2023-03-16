import { Theme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'

export const useFormStyles = makeStyles((theme: Theme) => ({
  layout: {
    width: 'auto',
    [theme.breakpoints.up(524)]: {
      width: 500,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column', // prevent all from being on one line
    alignItems: 'center',
    padding: `${theme.spacing(2, 3, 3)}`
  },
  avatar: {
    margin: theme.spacing(1),
    width: 48,
    height: 48,
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    marginTop: theme.spacing(3)
  }
}))
