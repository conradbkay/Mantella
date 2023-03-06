import { render } from 'react-dom'
import { Wrapper } from './App'
import './index.css'
import axios from 'axios'
import 'react-widgets/styles.css'

axios.defaults.baseURL = `http://localhost:4000`

render(<Wrapper />, document.getElementById('root'))
