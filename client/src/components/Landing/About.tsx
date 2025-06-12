import { Theme } from '@mui/material/styles'
import {
  Typography,
  Button,
  Grid,
  ButtonBase,
  useTheme,
  Chip
} from '@mui/material'
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
import { useEffect, useState } from 'react'
import axios from 'axios'
import GitHub from '@mui/icons-material/GitHub'
import Balance from '@mui/icons-material/Balance'
import Star from '@mui/icons-material/StarOutline'
import Code from '@mui/icons-material/Code'
import { setPersistAuth } from '../../localStorage'

const useStyles = makeStyles((theme: Theme) => ({
  heroContent: {
    minHeight: 200,
    padding: '80px 40px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    justifyContent: 'space-between',
    position: 'relative'
  },
  heroTitle: {
    fontSize: 64,
    textAlign: 'center'
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
  },
  guestButton: {
    backgroundColor: theme.palette.primary.main
  }
}))

type Props = {
  showLinkedin?: boolean
}

type TRepo = {
  ownerName: string
  url: string
  description: string
  createdAt: string
  lastUpdated: string
  sizeKB: number
  stars: number
  name: string
  visibility: string
  ownerUrl: string
  licenseName: string
}

export const About = ({ showLinkedin }: Props) => {
  const navigate = useHistory()
  const dispatch = useAppDispatch()
  const loginAsGuest = async () => {
    setPersistAuth(true)
    const res = await APIGuestLogin()
    if (res) {
      const authUser = transformUser(res)

      dispatch(LOGIN({ user: authUser }))
      dispatch(SET_PROJECTS(res.projects))
      navigate.push('/project/' + res.projects[0].id)
    }
  }

  const theme = useTheme()

  const classes = useStyles()

  const [repo, setRepo] = useState<null | TRepo>(null)

  useEffect(() => {
    const getRepo = async () => {
      try {
        const res = await axios.get(
          'https://api.github.com/repos/conradbkay/mantella'
        )

        const {
          owner,
          html_url: url,
          name,
          description,
          created_at: createdAt,
          pushed_at: lastUpdated,
          sizeKB,
          stargazers_count: stars,
          //          license,
          visibility
        } = res.data
        const { html_url: ownerUrl, login: ownerName } = owner

        setRepo({
          ownerName,
          url,
          name,
          description,
          createdAt,
          lastUpdated,
          sizeKB,
          stars,
          visibility,
          ownerUrl,
          licenseName: 'GPL 3.0 license'
        } as TRepo)
      } catch (err) {
        console.log(err)
      }
    }

    getRepo()
  }, [])

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
            className={classes.guestButton}
            onClick={() => loginAsGuest()}
            style={{ marginTop: 16, padding: '11px 26px', fontSize: 16 }}
          >
            Continue as Guest
          </Button>
          <ButtonBase
            style={{
              width: 400,
              cursor: 'pointer',
              padding: '20px 40px',
              margin: '32px 0',
              borderRadius: 4,
              border: '1px solid ' + theme.palette.divider
            }}
          >
            {repo && (
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={repo ? repo.url : 'https://github.com'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  textDecoration: 'none',
                  color: theme.palette.primary.main
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <GitHub
                    style={{
                      color: theme.palette.text.secondary,
                      marginRight: 8
                    }}
                  />
                  {repo.ownerName} / {repo.name}
                  <Chip
                    style={{ marginLeft: 8 }}
                    label={repo.visibility}
                    variant="outlined"
                  />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    color: theme.palette.text.secondary,
                    textAlign: 'start'
                  }}
                >
                  {repo.description}
                </div>
                {[
                  [repo.licenseName, Balance],
                  [repo.stars + ' star' + (repo.stars > 1 ? 's' : ''), Star],
                  ['Typescript React', Code]
                ].map(([name, Icon], i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 8,
                      fontWeight: 600
                    }}
                  >
                    <Icon style={{ marginRight: 8 }} />
                    {name}
                  </div>
                ))}
              </a>
            )}
          </ButtonBase>
        </Grid>
        <Grid item md={6} sm={12}>
          <FeatureGallery />
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
