import { Avatar, List, ListItemButton, useTheme } from '@mui/material'
import Color from 'color'
import { TProjectUser } from '../../types/project'

export const ChatMembers = ({ users }: { users: TProjectUser[] }) => {
  const theme = useTheme()

  return (
    <div
      style={{
        width: 300,
        backgroundColor: new Color(theme.palette.background.paper)
          .lighten(0.3)
          .toString(),
        color: theme.palette.text.secondary
      }}
    >
      <List>
        {users.map((user) => (
          <ListItemButton key={user.id}>
            <Avatar
              style={{
                height: 36,
                width: 36,
                marginRight: 16
              }}
            >
              <span style={{ position: 'absolute' }}>
                {user.username![0].toUpperCase()}
              </span>
              <img height={36} width={36} src={user.profileImg} alt="profile" />
            </Avatar>
            {user.username}
          </ListItemButton>
        ))}
      </List>
    </div>
  )
}
