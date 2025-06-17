import { createFileRoute } from '@tanstack/react-router'
import { CreateProject } from '../components/CreateProject'

export const Route = createFileRoute('/_auth/create-project')({
  component: CreateProjectComponent
})

function CreateProjectComponent() {
  return <CreateProject />
}
