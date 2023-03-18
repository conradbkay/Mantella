import { IconButton, TextField } from '@mui/material'
import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import Send from '@mui/icons-material/Send'
import { format } from 'date-fns'
import { TProject } from '../../types/project'
import { HoverableAvatar } from '../utils/HoverableAvatar'
import { useSelector } from 'react-redux'
import { TState } from '../../types/state'

type Message = {
  id: string
  message: string
  createdAt: number
  senderId: string
}

export const ProjectChat = ({
  socket,
  chatId,
  open,
  users
}: {
  socket: Socket
  chatId: string
  open: boolean
  users: TProject['users']
}) => {
  const [messagesRecieved, setMessagesReceived] = useState([] as Message[])
  const [connected, setConnected] = useState(false)

  const userId = useSelector((state: TState) => state.user!.id)

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('message', (data) => {
      console.log(data)
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          senderId: data.senderId,
          createdAt: data.createdAt,
          id: data.id
        }
      ])
    })

    return () => {
      socket.off('message')
    }
  }, [socket])

  useEffect(() => {
    if (!connected) {
      socket.emit('login', { chatId })
      setConnected(true)
    }
  }, [open, socket, connected, chatId])

  // dd/mm/yyyy, hh:mm:ss
  function formatDateFromTimestamp(epochMs: number) {
    const date = new Date(epochMs)
    return format(date, 'h:mm aaa')
  }

  const [message, setMessage] = useState('')

  const sendMessage = () => {
    socket.emit('send_message', { chatId, message, userId })
    setMessage('')
  }

  return open ? (
    <div
      style={{
        width: 400,
        height: 'calc(100vh - 124px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {messagesRecieved.map((msg, i) => (
        <div key={msg.id} style={{ display: 'flex' }}>
          <HoverableAvatar
            user={users.find((user) => user.id === msg.senderId)!}
          />
          <div
            key={msg.id}
            style={{
              margin: 12,
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <div style={{ textAlign: 'end' }}>
              {formatDateFromTimestamp(msg.createdAt)}
            </div>
            <p>{msg.message}</p>
            <br />
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', marginTop: 'auto' }}>
        <TextField
          multiline
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          placeholder="Enter a message..."
          style={{ margin: 8 }}
        />
        <IconButton
          onClick={sendMessage}
          style={{ height: 40, margin: 'auto 8px auto 0' }}
        >
          <Send />
        </IconButton>
      </div>
    </div>
  ) : (
    <></>
  )
}
