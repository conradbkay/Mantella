import { connect } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router'
import { TState } from '../../types/state'

const mapState = (state: TState) => ({
  user: state.user
})

interface TProps extends ReturnType<typeof mapState>, RouteProps {
  component: any
  componentProps: any
}

export const PrivateRoute = connect(mapState)(
  ({ component: PropComponent, componentProps, user, ...rest }: TProps) => {
    return (
      <Route
        {...rest}
        render={(props) =>
          user !== null ? (
            <PropComponent
              params={props.match.params}
              {...(componentProps as typeof PropComponent['props'])}
            />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    )
  }
)