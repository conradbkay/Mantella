import { Grid, Typography } from '@mui/material'

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

export const AboutFooter = () => {
  return (
    <Grid
      component="footer"
      sx={{
        marginTop: 8,
        borderTop: 1,
        borderColor: 'divider',
        padding: 6,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: { xl: 1000 }
      }}
    >
      <Grid
        container
        spacing={1}
        justifySelf="center"
        alignItems="center"
        alignContent="center"
      >
        {footers.map((footer) => (
          <Grid size={{ xs: 12 }} key={footer.title}>
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
    </Grid>
  )
}
