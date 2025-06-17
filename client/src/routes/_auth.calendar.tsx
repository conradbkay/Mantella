import { createFileRoute } from '@tanstack/react-router'
import { CalendarWeek } from '../components/Calendar/Week'
import { useTheme } from '@mui/material'
import useTitle from '../components/useTitle'

export const Route = createFileRoute('/_auth/calendar')({
  component: CalendarComponent
})

function CalendarComponent() {
  const theme = useTheme()
  useTitle('Calendar')

  return (
    <div
      style={{
        height: 'calc(100vh - 57.5px)',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        backgroundImage:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
            : undefined
      }}
    >
      <div style={{ padding: '20px 50px 0px 50px' }}>
        <CalendarWeek />
      </div>
    </div>
  )
}
