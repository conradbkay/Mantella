import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '../components/Dashboard'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardComponent
})

function DashboardComponent() {
  return <Dashboard />
}
