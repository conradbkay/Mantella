import { SxProps } from '@mui/material'

export const formStyleLayout: SxProps = {
  width: 'auto',
  '@media (min-width:524px)': {
    width: 500,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

export const formStylePaper: SxProps = {
  marginTop: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 24px 24px'
}

export const formStyleAvatar: SxProps = {
  margin: 1,
  width: 48,
  height: 48,
  backgroundColor: 'secondary.main'
}

export const formStyleSubmit: SxProps = {
  marginTop: 3
}
