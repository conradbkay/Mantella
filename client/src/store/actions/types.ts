import { UserAction } from './auth'
import { ProjectAction } from './project'
import { SnackbarAction } from './snackbar'
import { LoadingAction } from './loading'
import { ColumnAction } from './column'
import { PomodoroAction } from './pomodoro'
import { TaskAction } from './task'

export type TAction = Readonly<
  | SnackbarAction
  | LoadingAction
  | ProjectAction
  | TaskAction
  | ColumnAction
  | PomodoroAction
  | UserAction
>

export type ActionTypes = TAction['type']

export type ReducerCases<State> = {
  [actionCase in ActionTypes]?: (state: State, action: TAction) => void
}
