import { render } from 'react-dom'
import { Wrapper } from './App'
import './index.css'
import axios from 'axios'
import '@fontsource/roboto'
import '@fontsource/viga'
axios.defaults.baseURL = `/api`

render(<Wrapper />, document.getElementById('root'))
