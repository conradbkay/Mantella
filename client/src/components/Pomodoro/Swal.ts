import { TPomodoro } from '../../types/state'
import Dialog from 'sweetalert'

const WORK_DONE_MESSAGE = 'Good job!'
const BREAK_DONE_MESSAGE = 'Good try! Make the next of your next session.'

export const Swal = (
  pomodoro: TPomodoro,
  stateFunc: (b: boolean) => void,
  toggleWorking: () => void
) => {
  if (pomodoro.currSeconds === 0) {
    const toggleButtonText = `Start ${pomodoro.working ? 'Break' : 'Working'}`
    const title = `${pomodoro.working ? 'Work' : 'Break'} Completed`
    const text = pomodoro.working ? WORK_DONE_MESSAGE : BREAK_DONE_MESSAGE
    const icon = pomodoro.working ? 'success' : 'warning'
    Dialog({
      title,
      text,
      icon,
      buttons: {
        stop: { text: 'Stop Pomodoro', value: 'stop' },
        toggle: {
          text: toggleButtonText,
          value: 'toggle'
        }
      }
    }).then((value: 'stop' | 'toggle') => {
      switch (value) {
        case 'stop':
          stateFunc(false)
          break
        case 'toggle':
          toggleWorking()
          break
        default:
          break
      }
    })
  }
}
