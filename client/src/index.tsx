import { render } from 'react-dom'
import { Wrapper } from './App'
import './index.css'
import axios from 'axios'
import 'react-widgets/styles.css'
import '@fontsource/roboto'
axios.defaults.baseURL = `/api`

render(<Wrapper />, document.getElementById('root'))
