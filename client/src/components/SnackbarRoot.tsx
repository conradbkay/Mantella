import {
  SnackbarContent,
  Snackbar,
  IconButton,
  Button,
  useTheme
} from '@mui/material'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'
import { TVariant } from '../types/state'
import Info from '@mui/icons-material/Info'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { CLOSE_SNACKBAR, selectSnackbar } from '../store/snackbar'

const getBackgroundColor = (variant: TVariant, theme: any) => {
  if (variant === 'success') {
    return '#43A047'
  } else if (variant === 'warning' || variant === 'undo') {
    return '#FFA000'
  } else if (variant === 'error') {
    return theme.palette.error.dark
  } else {
    return theme.palette.primary.dark
  }
}

const FULL_WIDTH_POINT_PX = 960
const AUTO_HIDE_POINT_MS = 3000

export const SnackbarRoot = () => {
  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    standard: Info,
    undo: WarningIcon
  }
  const { open, message, variant } = useAppSelector(selectSnackbar)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const backgroundColor = getBackgroundColor(variant, theme)

  const Icon = variantIcon[variant]
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      style={{ marginBottom: 20 }}
      sx={{
        [`@media (max-width: ${FULL_WIDTH_POINT_PX}px)`]: {
          marginBottom: '0px !important'
        }
      }}
      autoHideDuration={variant === 'undo' ? 5000 : AUTO_HIDE_POINT_MS}
      onClose={() => dispatch(CLOSE_SNACKBAR())}
    >
      <SnackbarContent
        sx={{ backgroundColor }}
        message={
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Icon sx={{ fontSize: 20, marginRight: theme.spacing(1) }} />
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
            sx={{ fontSize: 20, marginRight: theme.spacing(1) }}
            onClick={() => {
              dispatch(CLOSE_SNACKBAR())
            }}
          >
            <CloseIcon sx={{ width: 24, height: 24 }} />
          </IconButton>
        ]}
      />
    </Snackbar>
  )
}
