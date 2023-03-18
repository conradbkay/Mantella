import { TProject } from '../../types/project'

type OwnProps = {
  project: TProject
}

export const ProjStats = ({ project }: OwnProps) => {
  return (
    <div style={{ minWidth: 400 }}>
      <p>hi</p>
      Track productivity and figure out where your time goes
    </div>
  )
}
