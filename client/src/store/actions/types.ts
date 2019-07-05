import { UserAction } from './auth'
import { SnackbarAction } from './snackbar'
import { LoadingAction } from './loading'
import { PomodoroAction } from './pomodoro'
export type TAction = Readonly<
  SnackbarAction | LoadingAction | PomodoroAction | UserAction
>

export type ActionTypes = TAction['type']

export type ReducerCases<State> = {
  [actionCase in ActionTypes]?: (state: State, action: TAction) => void
}
