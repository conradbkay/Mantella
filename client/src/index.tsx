import { createRoot } from 'react-dom/client'
import { Wrapper } from './App'
import './index.css'
import axios from 'axios'
import '@fontsource/roboto'
import '@fontsource/viga'
axios.defaults.baseURL = `/api`

createRoot(document.getElementById('root')!).render(<Wrapper />)
