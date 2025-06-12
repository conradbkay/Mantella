import { Icon, Paper, useTheme } from '@mui/material'

const galleryOptions = [
  {
    name: 'Chat',
    description:
      'Chat with your team members, create channels and send messages',
    icon: 'chat'
  },
  {
    name: 'Private tasks',
    description:
      'Not everyone needs access to a task, assign tasks to teams or specific members',
    icon: 'lock'
  },
  {
    name: 'Time tracking',
    description: 'Get detailed statistics of what has been done',
    icon: 'timer'
  },
  {
    name: 'Member roles',
    description: 'Assign roles to users to manage permissions',
    icon: 'settings'
  },
  {
    name: 'Targets',
    description:
      'Set goals for certain members, teams, or for the entire project',
    icon: 'check_box'
  },
  {
    name: 'Calendar',
    description:
      'Get an overview of due dates and manage your time accordingly',
    icon: 'calendar_today'
  },
  {
    name: 'Task Board',
    description: 'Use different views and filter or sort tasks',
    icon: 'view_list'
  },
  {
    name: 'Issue Tracking',
    icon: 'bug_report',
    description: 'Assign importance to tasks and assign bugs to teams'
  },
  {
    name: 'Recurring Tasks',
    icon: 'repeat',
    description: 'Get reminders for tasks that must be done on a routine basis'
  }
]

export const FeatureGallery = () => {
  const theme = useTheme()

  return (
    <Paper style={{ padding: 16, maxWidth: 1000, margin: '12px auto' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
      >
        {galleryOptions.map((galleryOption, i) => (
          <div key={i} style={{ flex: 1, display: 'flex' }}>
            <div
              style={{
                margin: 8,
                minWidth: 250,
                flex: 1,
                borderRadius: 4,
                padding: 8,
                flexDirection: 'column',
                alignItems: 'start',
                justifyContent: 'start'
              }}
            >
              <div
                style={{
                  flexDirection: 'row',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'nunito',
                  color: theme.palette.primary.main
                }}
              >
                <Icon style={{ fontSize: 20, marginRight: 8 }}>
                  {galleryOption.icon}
                </Icon>
                <p style={{ fontWeight: 700, fontSize: 22 }}>
                  {galleryOption.name}
                </p>
              </div>
              <div
                style={{ marginTop: 8, color: theme.palette.text.secondary }}
              >
                {galleryOption.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Paper>
  )
}
