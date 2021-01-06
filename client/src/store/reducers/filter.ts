import { setFilterA } from './../actions/filter';
import { ReducerCases } from '../actions/types'
import { defaultState } from '../defaultState'
import { createReducer } from './createReducer'
import { TState } from '../../types/state'


const filterCases: ReducerCases<TState['filter']> = {
  SET_FILTER: (state, action: ReturnType<typeof setFilterA>) => {
    return action.newFilter
  }
}

export const filterReducer = createReducer<TState['filter']>(
  defaultState.filter,
  filterCases
)
