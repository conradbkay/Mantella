import {
  IconButton,
  TextField,
  useTheme,
  CircularProgress
} from '@mui/material'
import { useState, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import Send from '@mui/icons-material/Send'
import { format } from 'date-fns'
import { TProject } from '../../types/project'
import { HoverableAvatar } from '../utils/HoverableAvatar'
import { useSelector } from 'react-redux'
import { TState } from '../../types/state'
import axios from 'axios'

type Message = {
  id: string
  message: string
  createdAt: number
  senderId: string
}

/**
 * ideas:
 * hover own message to delete, others to reply to
 * notifications for new messages
 */

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
  const [loading, setLoading] = useState(true)
  const userId = useSelector((state: TState) => state.user!.id)

  useEffect(() => {
    const func = async () => {
      try {
        const res = await axios.post(`/chat`, { id: chatId })
        setMessagesReceived(res.data.chat.messages)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }

    func()
  }, [chatId])

  // Runs whenever a socket event is recieved from the server
  useEffect(() => {
    socket.on('message', (data) => {
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

  const theme = useTheme()

  return open ? (
    <div
      style={{
        width: 400,
        height: 'calc(100vh - 124px)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {loading && <CircularProgress style={{ margin: 'auto' }} />}
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
              color: theme.palette.text.primary,
              flexDirection: 'column',
              width: '100%'
            }}
          >
            <div
              style={{ textAlign: 'end', color: theme.palette.text.secondary }}
            >
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
