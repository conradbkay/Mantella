import { Grid, Typography, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'

const footers = [
  {
    title: 'Company',
    description: ['Team', 'History', 'Contact me', 'Location']
  },
  {
    title: 'Features',
    description: ['Create Robust Tasks', 'Personal support']
  },
  {
    title: 'Legal',
    description: ['Privacy policy', 'Terms of use']
  }
]

const useStyles = makeStyles((theme: Theme) => ({
  footer: {
    marginTop: 64,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing(6)}px 0`,
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up(1200)]: {
      width: 1000
    }
  }
}))

export const AboutFooter = () => {
  const classes = useStyles()
  return (
    <footer className={classes.footer}>
      <Grid
        container
        spacing={1}
        justifySelf="center"
        alignItems="center"
        alignContent="center"
      >
        {footers.map((footer) => (
          <Grid item xs key={footer.title}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              {footer.title}
            </Typography>
            {footer.description.map((item) => (
              <Typography key={item} variant="subtitle1" color="textSecondary">
                {item}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    </footer>
  )
}
