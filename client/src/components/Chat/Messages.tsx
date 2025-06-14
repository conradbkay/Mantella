import {
  IconButton,
  TextField,
  useTheme,
  CircularProgress,
  Paper
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import Send from '@mui/icons-material/Send'
import { TProject } from '../../types/project'
import { HoverableAvatar } from '../HoverableAvatar'
import { useSelector } from 'react-redux'
import { TState } from '../../types/state'
import axios from 'axios'
import { Scrollbar } from 'react-scrollbars-custom'
import { nanoid } from 'nanoid'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatDate } from '../../utils/formatDueDate'
import { inverse } from '../../utils/color'

type Message = {
  id: string
  message: string
  createdAt: number
  senderId: string
}

/**
 * ideas:
 * emoji plugin
 * reference tasks in message
 * hover own message to delete, others to reply to
 * notifications for new messages
 */

export const ChatMessages = ({
  socket,
  channel,
  open,
  users,
  topMargin
}: {
  socket: Socket | null
  channel: [string, string]
  open: boolean
  users: TProject['users']
  topMargin?: number
}) => {
  const [messagesReceived, setMessagesReceived] = useState([] as Message[])
  const [loading, setLoading] = useState(true)
  const userId = useSelector((state: TState) => state.user!.id)

  const channelId = channel[0]

  useEffect(() => {
    const func = async () => {
      try {
        setLoading(true)
        const res = await axios.post(`/chat`, { id: channelId })
        setMessagesReceived(res.data.chat.messages)
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }

    func()
  }, [channelId])

  useEffect(() => {
    if (!socket) return
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
      if (!socket) return
      socket.off('message')
    }
  }, [socket])

  const [message, setMessage] = useState('')

  const sendMessage = () => {
    const id = nanoid()
    if (!socket) return
    socket.emit('send_message', { chatId: channelId, message, userId, id })
    setMessage('')
  }

  const theme = useTheme()

  const scroll = useRef(null)

  // TODO: autoscroll is terrible
  useEffect(() => {
    if (open && scroll.current && messagesReceived.length > 0) {
      ;(scroll.current as any).scrollToBottom()
    }
  }, [open, messagesReceived.length])

  const width = open ? '100%' : 0

  const checkKeyPress = (e: any) => {
    const { key, shiftKey } = e
    if (key === 'Enter') {
      if (!shiftKey) {
        sendMessage()
      } else {
        // we need to add line break here so normal enter will not send then line break
        setMessage((prev) => prev + '\n')
      }
    }
  }

  const inputHeight = 72
  const headerHeight = 58.5 // elsewhere
  const messageHeaderHeight = 48

  return open ? (
    <div
      style={{
        width,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: `calc(100vh - ${headerHeight + (topMargin || 0)}px)`
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 0,
          height: messageHeaderHeight,
          display: 'flex',
          backgroundColor: inverse(theme.palette.background.paper, 0.4),
          backgroundImage: 'none',
          alignItems: 'center',
          pl: 4
        }}
      >
        {channel[1]}
      </Paper>

      <Scrollbar
        ref={scroll}
        style={{
          width,
          height: `calc(100vh - ${
            inputHeight + headerHeight + messageHeaderHeight
          }px)`
        }}
      >
        {loading ? (
          <CircularProgress
            style={{ margin: 'auto', width: 100, height: 100 }}
          />
        ) : (
          messagesReceived.map((msg, i) => (
            <div key={msg.id} style={{ display: 'flex' }}>
              <div style={{ margin: '12px 8px' }}>
                <HoverableAvatar
                  noMargin
                  user={users.find((user) => user.id === msg.senderId)!}
                />
              </div>
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
                  style={{
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {users.find((user) => user.id === msg.senderId)!.username}
                  <span
                    style={{
                      color: theme.palette.text.secondary,
                      marginLeft: 8,
                      fontSize: 13
                    }}
                  >
                    {formatDate(new Date(msg.createdAt))}
                  </span>
                </div>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  children={msg.message}
                />
                <br />
              </div>
            </div>
          ))
        )}
      </Scrollbar>
      <div style={{ display: 'flex', minHeight: inputHeight }}>
        <TextField
          multiline
          autoFocus
          value={message}
          onKeyUp={checkKeyPress}
          onChange={(e) => {
            if ((e.nativeEvent as any).inputType !== 'insertLineBreak') {
              setMessage(e.target.value)
            }
          }}
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
  ) : null
}
