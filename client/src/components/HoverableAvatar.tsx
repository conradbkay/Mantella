import { Tooltip, Avatar } from '@mui/material'

type UserLike = {
  username?: string
  profileImg?: string
}

export const HoverableAvatar = ({
  user,
  noMargin
}: {
  user: UserLike
  noMargin?: boolean
}) => {
  return (
    <Tooltip title={`${user.username}`}>
      <Avatar
        style={{
          margin: noMargin ? undefined : 'auto 10px'
        }}
      >
        <span style={{ position: 'absolute' }}>
          {user.username?.[0]?.toUpperCase()}
        </span>
        <img height={40} width={40} src={user.profileImg} alt="profile" />
      </Avatar>
    </Tooltip>
  )
}
