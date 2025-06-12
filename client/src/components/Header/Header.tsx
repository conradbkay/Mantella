import { useState, Fragment, useContext } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import { ColorModeContext } from '../../App'
import {
  Theme,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Tab,
  Button,
  Menu,
  Typography,
  Grid,
  AppBar,
  Tabs,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Slide, useScrollTrigger } from '@mui/material'
import { ReactElement } from 'react'
import { Trail } from 'react-spring/renderprops'
import HowToReg from '@mui/icons-material/HowToReg'
import CalendarToday from '@mui/icons-material/CalendarToday'
import Help from '@mui/icons-material/Help'
import Settings from '@mui/icons-material/Settings'
import Home from '@mui/icons-material/Home'
import { Link as NavLink } from 'react-router-dom'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import Chat from '@mui/icons-material/Chat'
import { ProjectFinder } from '../ProjectFinder'
import { HoverableAvatar } from '../HoverableAvatar'
import { makeStyles } from '@mui/styles'
import { useAppSelector } from '../../store/hooks'
import { selectUser } from '../../store/user'
import { HeaderSearchBar } from './SearchBar'
import PageView from '@mui/icons-material/PageView'

const noAuthItems = [
  {
    label: 'About',
    pathname: '/',
    menuIcon: Help
  },
  {
    label: 'Login',
    pathname: '/login',
    menuIcon: HowToReg
  },
  {
    label: 'Register',
    pathname: '/register',
    menuIcon: HowToReg
  }
]

const authItems = [
  { label: 'Home', pathname: '/dashboard', menuIcon: Home },
  { label: 'Settings', pathname: '/settings', menuIcon: Settings },
  {
    label: 'Calendar',
    pathname: '/calendar',
    menuIcon: CalendarToday
  },
  {
    label: 'Chat',
    pathname: '/chat',
    menuIcon: Chat
  }
]

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'white'
  },
  fullHeight: {
    height: '100%'
  },
  mainHeader: {
    width: '100%',
    padding: '0px 18px',
    height: 81.5,
    maxWidth: '100vw',
    [theme.breakpoints.down('sm')]: {
      padding: '0px 12px'
    }
  },
  inline: {
    display: 'inline'
  },
  flex: {
    display: 'flex'
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  tagline: {
    display: 'inline-block',
    marginLeft: 10
  },
  iconContainer: {
    display: 'none',
    [theme.breakpoints.down('md')]: {
      display: 'block'
    }
  },
  tabContainer: {
    height: '100%',
    marginLeft: 8,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: 'auto',
    height: '100%'
  },
  iconButton: {}
}))

type HideOnScrollProps = {
  children: ReactElement
}

const HideOnScroll: React.FC<HideOnScrollProps> = ({ children }) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

interface Props extends RouteComponentProps {}

export const Header = withRouter((props: Props) => {
  const [drawer, setDrawer] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null as any)

  const authenticated = useAppSelector(selectUser)
  const classes = useStyles()

  const MenuItems = authenticated !== null ? authItems : noAuthItems

  const value = MenuItems.map((menuItem) => menuItem.pathname).indexOf(
    props.location.pathname
  )

  const colorMode = useContext(ColorModeContext)

  const theme = useTheme()

  const isMobile = useMediaQuery('(max-width: 500px)')

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          color="default"
          className={classes.appBar}
          style={{
            boxShadow: 'none'
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            className={classes.mainHeader}
          >
            <Grid
              item
              xs={12}
              style={{ alignItems: 'center', height: '100%' }}
              className={classes.flex}
            >
              <div className={classes.iconContainer}>
                <IconButton
                  onClick={() => setDrawer(true)}
                  className={classes.iconButton}
                >
                  <MenuIcon />
                </IconButton>
              </div>
              {authenticated !== null && (
                <>
                  <Button
                    style={{
                      margin: isMobile ? 'auto 8px' : 'auto 25px auto 0px',
                      paddingTop: 8,
                      paddingBottom: 8
                    }}
                    color="primary"
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    {isMobile ? (
                      <PageView />
                    ) : (
                      <>
                        <MenuIcon />
                        <span style={{ marginLeft: 5 }}>Projects</span>
                      </>
                    )}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <div style={{ outline: 'none', margin: 10 }}>
                      <ProjectFinder variant="menu" />
                    </div>
                  </Menu>
                </>
              )}
              {!isMobile && (
                <div className={classes.inline}>
                  <Typography variant="h6" color="inherit" noWrap>
                    <Trail
                      items={'Mantella'}
                      from={{ transform: 'translate3d(0,-40px,0)' }}
                      to={{ transform: 'translate3d(0,0px,0)' }}
                    >
                      {(item) => (trailProps) =>
                        (
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://github.com/USA-Kay/Mantella"
                            style={{
                              ...trailProps,
                              color: theme.palette.text.primary,
                              textDecoration: 'none',
                              paddingRight: 5
                            }}
                            className={classes.tagline}
                          >
                            Mantella
                          </a>
                        )}
                    </Trail>
                  </Typography>
                </div>
              )}
              <Fragment>
                {authenticated !== null && <HeaderSearchBar />}
                <div
                  className={classes.tabContainer}
                  style={{ marginLeft: authenticated ? undefined : 'auto' }}
                >
                  <Tabs
                    value={value === -1 ? false : value}
                    indicatorColor="primary"
                    textColor="primary"
                    classes={{ flexContainer: classes.fullHeight }}
                    style={{ height: '100%' }}
                  >
                    {MenuItems.map((item, index) => (
                      <Tab
                        disabled={
                          window.location.href.slice(1) === item.pathname
                        }
                        style={{ minWidth: 96, height: '100%' }}
                        key={index}
                        to={item.pathname}
                        component={NavLink}
                        classes={{ root: classes.tabItem }}
                        label={item.label}
                      />
                    ))}
                  </Tabs>
                </div>
                {authenticated !== null && (
                  <HoverableAvatar user={authenticated} />
                )}
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={colorMode.toggleColorMode}
                  color="inherit"
                  aria-label="toggle dark mode"
                >
                  {theme.palette.mode === 'dark' ? (
                    <Brightness7Icon />
                  ) : (
                    <Brightness4Icon />
                  )}
                </IconButton>
              </Fragment>
            </Grid>
          </Grid>
        </AppBar>
      </HideOnScroll>
      <Drawer anchor="left" open={drawer} onClose={() => setDrawer(false)}>
        <div style={{ width: 'auto' }}>
          <List>
            {MenuItems.map((menuItem, index) => (
              <ListItem
                onClick={() => setDrawer(false)}
                to={menuItem.pathname}
                component={NavLink}
                button
                key={index}
              >
                <ListItemIcon>
                  <menuItem.menuIcon />
                </ListItemIcon>
                <ListItemText primary={menuItem.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
})
