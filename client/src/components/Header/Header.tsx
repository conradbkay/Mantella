import React, { Fragment, useContext, ReactElement, useState } from 'react'
import {
  AppBar,
  Slide,
  useScrollTrigger,
  Grid,
  Tabs,
  Tab,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  Button,
  Menu,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useLocation } from '@tanstack/react-router'
import { ColorModeContext } from '../../App'
import Home from '@mui/icons-material/Home'
import HowToReg from '@mui/icons-material/HowToReg'
import Help from '@mui/icons-material/Help'
import Settings from '@mui/icons-material/Settings'
import CalendarToday from '@mui/icons-material/CalendarToday'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { ProjectFinder } from '../ProjectFinder'
import { HoverableAvatar } from '../HoverableAvatar'
import { useAuthUser } from '../PrivateRoute'
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
  {
    label: 'Calendar',
    pathname: '/calendar',
    menuIcon: CalendarToday
  },
  { label: 'Settings', pathname: '/settings', menuIcon: Settings }
]

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

export const Header = () => {
  const [drawer, setDrawer] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null as any)

  const { user: authenticated } = useAuthUser()
  const location = useLocation()

  const MenuItems = authenticated !== null ? authItems : noAuthItems

  const value = MenuItems.map((menuItem) => menuItem.pathname).indexOf(
    location.pathname
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
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
          style={{
            boxShadow: 'none'
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            sx={{
              width: '100%',
              padding: { xs: '0px 12px', sm: '0px 18px' },
              maxWidth: '100vw'
            }}
          >
            <Grid
              size={{ xs: 12 }}
              sx={{
                alignItems: 'center',
                height: '100%',
                display: 'flex'
              }}
            >
              <div
                style={{
                  display: isMobile ? 'block' : 'none'
                }}
              >
                <IconButton onClick={() => setDrawer(true)}>
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
                <div style={{ display: 'inline' }}>
                  <Typography variant="h6" color="inherit" noWrap>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://github.com/USA-Kay/Mantella"
                      style={{
                        color: theme.palette.text.primary,
                        textDecoration: 'none',
                        paddingRight: 5,
                        display: 'inline-block',
                        marginLeft: 10
                      }}
                    >
                      Mantella
                    </a>
                  </Typography>
                </div>
              )}
              <Fragment>
                {authenticated !== null && <HeaderSearchBar />}
                <div
                  style={{
                    height: '100%',
                    marginLeft: authenticated ? 8 : 'auto',
                    display: isMobile ? 'none' : 'block'
                  }}
                >
                  <Tabs
                    value={value === -1 ? false : value}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{
                      '& .MuiTabs-flexContainer': {
                        height: '100%'
                      }
                    }}
                    style={{ height: '100%' }}
                  >
                    {MenuItems.map((item, index) => (
                      <Tab
                        disabled={location.pathname === item.pathname}
                        sx={{
                          paddingTop: 2.5,
                          paddingBottom: 2.5,
                          minWidth: 'auto',
                          height: '100%'
                        }}
                        style={{ minWidth: 96, height: '100%' }}
                        key={index}
                        component={Link}
                        to={item.pathname as any}
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
              <ListItemButton
                onClick={() => setDrawer(false)}
                component={Link}
                to={menuItem.pathname as any}
                key={index}
              >
                <ListItemIcon>
                  <menuItem.menuIcon />
                </ListItemIcon>
                <ListItemText primary={menuItem.label} />
              </ListItemButton>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  )
}
