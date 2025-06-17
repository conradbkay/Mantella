import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header/Header'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <div style={{ marginTop: 57.5 }} />
      <Outlet />
      {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
    </>
  )
})
