import { Navigate } from '@tanstack/react-router'
import { useAuthUser } from './PrivateRoute'

interface TProps<T> {
  component: React.ComponentType<T>
  componentProps: T
}

export const PublicOnlyRoute = <T,>({
  component: PropComponent,
  componentProps,
  ...rest
}: TProps<T>) => {
  const { user } = useAuthUser()

  if (!user) {
    return <PropComponent {...componentProps} {...rest} />
  }

  return <Navigate to="/dashboard" />
}
