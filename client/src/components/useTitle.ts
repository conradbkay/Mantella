import { useEffect } from 'react'

const defaultTitle = 'Mantella'

const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title
    return () => {
      document.title = defaultTitle
    }
  })
}

export default useTitle
