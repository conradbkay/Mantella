import { useMemo, useState, createContext, useEffect } from 'react'
import { Provider } from 'react-redux'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { store } from './store/store'
import { CircularProgress } from '@mui/material'
import { SnackbarRoot } from './components/SnackbarRoot'
import { getPersistAuth, getTheme, setTheme } from './localStorage'
import { useTimer } from './hooks/useTimer'
import { useCookieLoginMutation } from './store/api'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

const secondary = '#9D7CD0'
export const primary = '#7289da'

const AppContent = () => {
  const [loaded, setLoaded] = useState(false)
  const [cookieLogin] = useCookieLoginMutation()

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (getPersistAuth()) {
          try {
            await cookieLogin().unwrap()
            // RTK Query will handle caching the auth result
          } catch (error) {
            // Cookie login failure is expected when no valid session
            console.log('Cookie login failed - no valid session')
          }
        }
        setLoaded(true)
      } catch (err) {
        setLoaded(true)
      }
    }

    initAuth()
  }, [cookieLogin])

  useTimer()

  if (!loaded) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around'
        }}
      >
        <CircularProgress
          style={{
            width: '128px',
            height: '128px',
            marginRight: 64,
            marginTop: 100
          }}
        />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

export const Wrapper = () => {
  const [mode, setMode] = useState(getTheme() || 'dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light'
        setTheme(newMode)
        setMode(newMode)
      }
    }),
    [mode]
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as any,
          primary: {
            main: primary
          },
          secondary: {
            main: secondary
          }
        }
      }),
    [mode]
  )

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <SnackbarRoot />
          <AppContent />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  )
}
