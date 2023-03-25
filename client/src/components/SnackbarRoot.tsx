import {
  Theme,
  SnackbarContent,
  Snackbar,
  IconButton,
  Button
} from '@mui/material'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import { TVariant } from '../types/state'
import Info from '@mui/icons-material/Info'
import { makeStyles } from '@mui/styles'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { CLOSE_SNACKBAR, selectSnackbar } from '../store/snackbar'

type Classes = {
  success: string
  warning: string
  error: string
  standard: string
}
const getClassSnackbarVariant = (variant: TVariant, classes: Classes) => {
  if (variant === 'success') {
    return classes.success
  } else if (variant === 'warning' || variant === 'undo') {
    return classes.warning
  } else if (variant === 'error') {
    return classes.error
  } else {
    return classes.standard
  }
}

const FULL_WIDTH_POINT_PX = 960
const AUTO_HIDE_POINT_MS = 3000

const useStyles = makeStyles((theme: Theme) => ({
  success: { backgroundColor: '#43A047' },
  warning: { backgroundColor: '#FFA000' },
  standard: { backgroundColor: theme.palette.primary.dark },
  error: { backgroundColor: theme.palette.error.dark },
  close: { width: 24, height: 24 },
  message: { display: 'flex', alignItems: 'center' },
  icon: { fontSize: 20, marginRight: theme.spacing(1) },
  snackbar: {
    [theme.breakpoints.down(FULL_WIDTH_POINT_PX)]: {
      marginBottom: '0px !important'
    }
  }
}))

export const SnackbarRoot = () => {
  // Find what Icon to use for snackbar by variant
  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    standard: Info,
    undo: WarningIcon
  }
  const { open, message, variant } = useAppSelector(selectSnackbar)
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const backgroundClass: string = getClassSnackbarVariant(variant, classes)

  const Icon = variantIcon[variant]
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      style={{ marginBottom: 20 }}
      className={classes.snackbar}
      autoHideDuration={variant === 'undo' ? 5000 : AUTO_HIDE_POINT_MS}
      onClose={() => dispatch(CLOSE_SNACKBAR())}
    >
      <SnackbarContent
        className={backgroundClass}
        message={
          <span className={classes.message}>
            <Icon className={classes.icon} />
            <span style={{ marginLeft: 15, fontSize: 15 }}>{message}</span>
          </span>
        }
        action={[
          variant === 'undo' ? (
            <Button onClick={() => window.location.reload()}>Undo</Button>
          ) : null,
          <IconButton
            key="close"
            color="inherit"
            className={classes.icon}
            onClick={() => {
              dispatch(CLOSE_SNACKBAR())
            }}
          >
            <CloseIcon className={classes.close} />
          </IconButton>
        ]}
      />
    </Snackbar>
  )
}
