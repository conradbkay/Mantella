import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, WithStyles, Button } from '@material-ui/core'
import { FeatureTable } from './FeatureTable'
import { Helmet } from 'react-helmet'
import { FeatureGallery } from './FeatureGallery'
import { loginA } from '../../store/actions/auth'
import { connect } from 'react-redux'
import { APIGuestLogin } from '../../API/auth'

const styles = (theme: Theme) =>
  createStyles({
    heroContent: {
      minHeight: 200,
      padding: 80,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#8080ff',
      position: 'relative',
      flexDirection: 'column'
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
      marginTop: -40,
      zIndex: 2
    }
  })

const actionCreators = {
  login: loginA
}

type ActionCreators = typeof actionCreators

interface Props extends WithStyles<typeof styles>, ActionCreators {
  showLinkedIn?: boolean
}

export const About = withStyles(styles)(
  connect(
    null,
    actionCreators
  )((props: Props) => {
    const { classes } = props

    const loginAsGuest = async () => {
      const res = await APIGuestLogin()
      if (res) {
        window.location.hash = '#/project/' + res.projects[0].id
      }
    }

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
        <div className={classes.heroContent}>
          <div className={classes.title}>Mantella</div>
          <div className={classes.description}>
            Elegant Project Management and Time Tracking
          </div>
          <div style={{ display: 'flex' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => loginAsGuest()}
              style={{ marginTop: 'auto' }}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
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
          <FeatureGallery />
        </div>
      </div>
    )
  })
)
