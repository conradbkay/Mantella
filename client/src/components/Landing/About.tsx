import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import {
  Typography,
  WithStyles,
  Button,
  CircularProgress
} from '@material-ui/core'
import { FeatureTable } from './FeatureTable'
import { Helmet } from 'react-helmet'
import { FeatureGallery } from './FeatureGallery'
import { Mutation, MutationResult } from 'react-apollo'
import { GQL_LOGIN_AS_GUEST } from '../../graphql/mutations/auth'
import {
  LoginAsGuestMutationVariables,
  LoginAsGuestMutation
} from '../../graphql/types'
import { loginA } from '../../store/actions/auth'
import { connect } from 'react-redux'

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

type TProps = WithStyles<typeof styles> & { login: typeof loginA }

export const About = withStyles(styles)(
  connect(null, { login: loginA })((props: TProps) => {
    const { classes } = props

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
            <Mutation
              mutation={GQL_LOGIN_AS_GUEST}
              onCompleted={(data: LoginAsGuestMutation) => {
                props.login(data.loginAsGuest.user)
                window.location.hash =
                  '#/project/' + data.loginAsGuest.user.projects[0].id
              }}
            >
              {(
                auth: (args: {
                  variables: LoginAsGuestMutationVariables
                }) => void,
                result: MutationResult<LoginAsGuestMutation>
              ) => (
                <>
                  {result.loading && (
                    <CircularProgress style={{ margin: '4px auto' }} />
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => auth({ variables: {} })}
                    style={{ marginTop: 'auto' }}
                  >
                    Continue as Guest
                  </Button>
                </>
              )}
            </Mutation>
          </div>
        </div>
        <div style={{ margin: '20px 0' }}>
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
          </div>
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
