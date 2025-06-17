import { createFileRoute } from '@tanstack/react-router'
import { AuthRender } from '../components/Auth'

export const Route = createFileRoute('/register')({
  component: RegisterComponent
})

function RegisterComponent() {
  return <AuthRender authType="Register" />
}
