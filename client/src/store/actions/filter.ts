import { TFilterData } from './../../components/Project/Project'

export const setFilterA = (newFilter: TFilterData) => ({
  type: 'SET_FILTER',
  newFilter
})

export type FilterAction = ReturnType<typeof setFilterA>