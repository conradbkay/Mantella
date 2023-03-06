export type TFilterData = {
  dueDate: 'all' | 'none' | 'today' | 'tomorrow' | [Date | null, Date | null]
  color: string[]
  points?: [number, number]
}
