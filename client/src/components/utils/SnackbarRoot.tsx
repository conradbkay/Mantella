import { Theme, SnackbarContent, Snackbar, IconButton } from '@mui/material'

import { connect } from 'react-redux'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import { closeSnackbarA } from '../../store/actions/snackbar'
import { TVariant } from '../../types/state'
import { TState } from '../../types/state'
import Info from '@mui/icons-material/Info'
import { makeStyles } from '@mui/styles'

type Classes = {
  success: string
  warning: string
  error: string
  standard: string
}
const getClassSnackbarVariant = (variant: TVariant, classes: Classes) => {
  if (variant === 'success') {
    return classes.success
  } else if (variant === 'warning') {
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
  success: { backgroundColor: '#43A047' }, // what a nice green
  warning: { backgroundColor: '#FFA000' },
  standard: {},
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

type ActionCreators = typeof actionCreators
interface TProps extends ReturnType<typeof mapState>, ActionCreators {}

const SnackbarComponent = (props: TProps) => {
  // Find what Icon to use for snackbar by variant
  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    standard: Info
  }
  const { open, message, variant, closeSnackbar } = props
  const classes = useStyles()
  const backgroundClass: string = getClassSnackbarVariant(variant, classes)

  const Icon = variantIcon[variant]
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      style={{ marginBottom: 20 }}
      className={classes.snackbar}
      autoHideDuration={AUTO_HIDE_POINT_MS}
      onClose={closeSnackbar}
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
          <IconButton
            key="close"
            color="inherit"
            className={classes.icon}
            onClick={closeSnackbar}
          >
            <CloseIcon className={classes.close} />
          </IconButton>
        ]}
      />
    </Snackbar>
  )
}

const mapState = ({ snackbar }: TState) => ({
  open: snackbar.open,
  message: snackbar.message,
  variant: snackbar.variant
})

const actionCreators = {
  closeSnackbar: closeSnackbarA
}

export const SnackbarRoot = connect(mapState, actionCreators)(SnackbarComponent)
