import { Theme } from '@mui/material'
import { CSSProperties } from 'react'

export const input = (theme: Theme): CSSProperties =>
  ({
    overflow: 'hidden',
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    minWidth: '20%',
    fontSize: 18,
    outline: 'none',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 4,
    width: 'auto',
    padding: 8,
    border: '1px solid transparent',
    '&:hover': {
      backgroundColor: 'white'
    },
    '&:focus': {
      borderColor: '#27b6ba'
    }
  } as any)
