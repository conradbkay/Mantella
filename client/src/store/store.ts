import { createStore, applyMiddleware, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { reducer } from './reducers/reducer'
import { defaultState } from './defaultState'
import { TState } from '../types/state'
import { TAction } from './actions/types'

export const store: Store<TState, TAction> = createStore(
  reducer,
  defaultState,
  composeWithDevTools(
    applyMiddleware(thunk as ThunkMiddleware<TState, TAction>)
  )
)
