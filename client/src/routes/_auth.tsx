import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthUser } from '../components/PrivateRoute'
import { LinearProgress } from '@mui/material'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout
})

function AuthLayout() {
  const { isLoading, error, user } = useAuthUser()
  const navigate = useNavigate()

  if (isLoading || !user) {
    return (
      <div
        style={{
          backgroundColor: '#222',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <LinearProgress
          sx={{ margin: 'auto', width: '400px', height: '6px' }}
        />
      </div>
    )
  }

  if (error) {
    navigate({ to: '/login' })
    return
  }

  return <Outlet />
}
