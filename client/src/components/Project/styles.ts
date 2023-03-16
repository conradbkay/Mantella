import { CSSProperties } from 'react'

export const input: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  minWidth: '20%',
  fontSize: 18,
  outline: 'none',
  backgroundColor: '#f5f5f5',
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
} as any
