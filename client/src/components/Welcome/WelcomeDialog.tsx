/* should greet them well instead of the snackbar */
import React, { useEffect, useState } from 'react'
import { Dialog, IconButton, Button } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { store } from '../../store/store'
import { openSnackbarA } from '../../store/actions/snackbar'

// make them each different backgroundColor to make them pop out

export const WelcomeDialog = () => {
  // need to figure out how to check whether they have been here
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
          Welcome to KanbanBrawn 🎉
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
          {/* put icon between each section man */}
          Greetings, Welcome to KanbanBrawn, and I trust that you have made the
          right decision ??!
          <br />
          <br />
          KanbanBrawn let's you create tasks, stay on top of it, and track your
          progress so that you can get what you need to do under contro.
          <br />
          <br />
          It motivates you to keep going by giving you ice cream, or whatever
          else floats your boat.
          <br />
          <br />
          This rewards yourself for doing the right thing. I took this
          philosophy from my unmotivated friend who would place M&Ms at the end
          of every page of a book. If you love the app, contribute to it online,
          or create an issue or feature request, I greatly apreciate any
          feedback!
          <br />
          <br />
          <a href="https://github.com/conradkay/KanbanBrawn">Github Page</a>
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
          Hello Kanban Brawn
        </Button>
      </div>
    </Dialog>
  )
}
