import { useCookieLoginMutation } from '../store/api'
import { useEffect } from 'react'

// Hook to get the current user from the latest auth query
export const useAuthUser = () => {
  const [cookieLogin, { data: userData, isLoading, error }] =
    useCookieLoginMutation()

  useEffect(() => {
    cookieLogin()
  }, [cookieLogin])

  return {
    user: userData?.user || null,
    isLoading,
    error
  }
}
