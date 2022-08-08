/* should greet them well instead of the snackbar */
import { useEffect, useState } from 'react'
import { Dialog, IconButton, Button } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { store } from '../../store/store'
import { openSnackbarA } from '../../store/actions/snackbar'

export const WelcomeDialog = () => {
  const [open, setOpen] = useState(!localStorage.getItem('hasVisited'))
  // const [index, setIndex] = useState(0)

  useEffect(() => {
    return () => {
      localStorage.setItem('hasVisited', 'yes')
    }
  })

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div style={{ minWidth: 500, minHeight: 200, padding: 25 }}>
        <div style={{ fontSize: 22, fontWeight: 600 }}>
          Welcome to Mantella 🎉
        </div>
        <IconButton
          style={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
          onClick={() => setOpen(false)}
        >
          <Close />
        </IconButton>
        <p
          style={{
            fontSize: 17,
            color: '#191919',
            marginTop: 20
          }}
        >
          Greetings, Welcome to Mantella, hello
          <a href="https://github.com/austin-UW/Mantella">Github Page</a>
        </p>
      </div>
      <div style={{ margin: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            setOpen(false)
            store.dispatch(openSnackbarA('Wise', 'standard'))
          }}
        >
          Hello Mantella
        </Button>
      </div>
    </Dialog>
  )
}
