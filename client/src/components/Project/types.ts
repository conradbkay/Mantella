export type TFilterData = {
  dueDate:
    | 'all'
    | 'none'
    | 'has'
    | 'today'
    | 'tomorrow'
    | [Date | null, Date | null]
  color: string[]
  points?: [number, number]
}
