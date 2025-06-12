export const localStorageKeys = {
  noPersist: 'noPersist',
  theme: 'theme'
} as const

export const getTheme = () => {
  return localStorage.getItem(localStorageKeys.theme) || 'dark'
}

export const setTheme = (theme: string) => {
  localStorage.setItem(localStorageKeys.theme, theme)
}

export const getPersistAuth = () => {
  return localStorage.getItem(localStorageKeys.noPersist) !== 'true'
}

export const setPersistAuth = (persist: boolean) => {
  localStorage.setItem(localStorageKeys.noPersist, (!persist).toString())
}
