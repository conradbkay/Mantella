import { TState } from '../types/state'
import { RTDispatch } from '../types/types'
import { setProjectsA } from '../store/actions/project'

export const initializeAuthState = (user: any) => {
  return (dispatch: RTDispatch, getState: () => TState) => {
    if (user && user.projects) {
      dispatch(setProjectsA(user.projects))
    }
  }
}
