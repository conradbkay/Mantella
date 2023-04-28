import { Theme } from '@mui/material/styles'
import { Typography, Button, Grid } from '@mui/material'
import { FeatureTable } from './FeatureTable'
import { Helmet } from 'react-helmet'
import { FeatureGallery } from './FeatureGallery'
import { APIGuestLogin } from '../../API/auth'
import makeStyles from '@mui/styles/makeStyles'
import { useHistory } from 'react-router'
import { transformUser } from '../../store/auth'
import { useAppDispatch } from '../../store/hooks'
import { SET_PROJECTS } from '../../store/projects'
import { LOGIN } from '../../store/user'

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

type Props = {
  showLinkedin?: boolean
}

export const About = ({ showLinkedin }: Props) => {
  const navigate = useHistory()
  const dispatch = useAppDispatch()
  const loginAsGuest = async () => {
    localStorage.setItem('preserve', 'true')
    const res = await APIGuestLogin()
    if (res) {
      const authUser = transformUser(res)

      dispatch(LOGIN({ user: authUser }))
      dispatch(SET_PROJECTS(res.projects))
      navigate.push('/project/' + res.projects[0].id)
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
        <Typography style={{ marginTop: 20 }} variant="h4" align="center">
          Features
        </Typography>
        <FeatureTable />
      </div>
    </div>
  )
}
