import { Theme } from '@mui/material/styles'
import { Typography, Button, Grid } from '@mui/material'
import { FeatureTable } from './FeatureTable'
import { Helmet } from 'react-helmet'
import { FeatureGallery } from './FeatureGallery'
import { loginA } from '../../store/actions/auth'
import { connect } from 'react-redux'
import { APIGuestLogin } from '../../API/auth'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme: Theme) => ({
  heroContent: {
    minHeight: 200,
    padding: '80px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundImage: 'url(herringbone.webp)',
    position: 'relative'
  },
  heroTitle: {
    fontSize: 64,
    textAlign: 'center'
  },
  kayLink: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    minHeight: 368
  },
  title: {
    fontWeight: 700,
    fontSize: '2.75rem',
    zIndex: 2
  },
  description: {
    fontWeight: 400,
    fontSize: '1.25rem',
    zIndex: 2
  }
}))

const actionCreators = {
  login: loginA
}

type ActionCreators = typeof actionCreators

interface Props extends ActionCreators {
  showLinkedIn?: boolean
}

export const About = connect(
  null,
  actionCreators
)((props: Props) => {
  const { login } = props

  const loginAsGuest = async () => {
    const res = await APIGuestLogin()
    if (res) {
      login(res)
      window.location.hash = '/project/' + res.projects[0].id
    }
  }

  const classes = useStyles()

  return (
    <div>
      <Helmet>
        <style type="text/css">{` body { background-color: #1d364c; } h4 { color: white !important; }`}</style>
        <script
          type="text/javascript"
          src="https://platform.linkedin.com/badges/js/profile.js"
          async
          defer
        />
        <meta
          name="description"
          content="Mantella is the most innovative open-source task manager and kanban Board!"
        />
      </Helmet>
      <Grid container className={classes.heroContent}>
        <Grid item md={6} sm={12}>
          <FeatureGallery />
        </Grid>
        <Grid
          item
          md={6}
          sm={12}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className={classes.title}>Mantella</div>
          <div className={classes.description}>
            Elegant Project Management and Time Tracking
          </div>
          <Button
            variant="contained"
            size="large"
            onClick={() => loginAsGuest()}
            style={{ marginTop: 8, color: 'white', backgroundColor: 'black' }}
          >
            Continue as Guest
          </Button>
        </Grid>
      </Grid>
      <div style={{ margin: '20px 0' }}>
        {props.showLinkedIn && (
          <>
            <Typography variant="h4" align="center" gutterBottom>
              The Team
            </Typography>
            <div className={classes.kayLink}>
              <div
                className="LI-profile-badge"
                data-version="v1"
                data-size="large"
                data-locale="en_US"
                data-type="vertical"
                data-theme="dark"
                data-vanity="austin-kay-4a823b139"
              >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="LI-simple-link"
                  href="https://www.linkedin.com/in/austin-kay-4a823b139?trk=profile-badge"
                >
                  Austin Kay - Builder
                </a>
              </div>
            </div>{' '}
          </>
        )}
        <Typography style={{ marginTop: 20 }} variant="h4" align="center">
          Features
        </Typography>
        <FeatureTable />
      </div>
    </div>
  )
})
