import { moveInArray } from './utilities'

test('moveInArray', () => {
  let arr = [1, 2, 3, 4, 5]
  arr = moveInArray(arr, 0, 4)
  expect(arr).toEqual([2, 3, 4, 5, 1])
})
