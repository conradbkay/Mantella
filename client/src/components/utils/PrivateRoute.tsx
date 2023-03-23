import { Route, Redirect, RouteProps } from 'react-router'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../store/user'
interface TProps extends RouteProps {
  component: any
  componentProps: any
}

export const PrivateRoute = ({
  component: PropComponent,
  componentProps,
  ...rest
}: TProps) => {
  const user = useAppSelector(selectUser)

  return (
    <Route
      {...rest}
      render={(props) =>
        user !== null ? (
          <PropComponent
            params={props.match.params}
            {...(componentProps as (typeof PropComponent)['props'])}
          />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  )
}
