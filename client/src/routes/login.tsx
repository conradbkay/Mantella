import { createFileRoute } from '@tanstack/react-router'
import { AuthRender } from '../components/Auth'

export const Route = createFileRoute('/login')({
  component: LoginComponent
})

function LoginComponent() {
  return <AuthRender authType="Login" />
}
