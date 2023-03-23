import './styles.css'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

export const NoMatch = () => (
  <div className="all">
    <section className="error-container">
      <span className="four">
        <span className="screen-reader-text">4</span>
      </span>
      <span className="zero">
        <span className="screen-reader-text">0</span>
      </span>
      <span className="four">
        <span className="screen-reader-text">4</span>
      </span>
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <Button
          color="secondary"
          style={{ width: 250 }}
          to={'/'}
          component={Link}
          variant="contained"
        >
          Home
        </Button>
      </div>
    </section>
  </div>
)
