import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Typography, WithStyles, Button } from '@material-ui/core'
import { FeatureTable } from './FeatureTable'
import { Helmet } from 'react-helmet'
import { FeatureGallery } from './FeatureGallery'

const styles = (theme: Theme) =>
  createStyles({
    heroContent: {
      minHeight: 180,
      padding: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      position: 'relative',
      flexDirection: 'column',
    },
    heroTitle: {
      fontSize: 64,
      textAlign: 'center',
    },
    kayLink: {
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 16,
      marginBottom: 16,
      textAlign: 'center',
      minHeight: 368
    }
  })

type TProps = WithStyles<typeof styles>

export const About = withStyles(styles)((props: TProps) => {
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
        <Typography variant="h2" className={classes.heroTitle}>
          Mantella — It's Free
        </Typography>
        <div style={{display:'flex'}}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => (location.hash = '#/register')}
            style={{ marginTop: 'auto' }}
          >
            Sign up today
          </Button>
          <a onClick={() => (location.hash = '#/login')} style={{height: '100%', fontSize: 18, color: 'blue', textDecoration: 'underline', margin: 'auto 12px', cursor: 'pointer' }}>Login instead?</a>
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
