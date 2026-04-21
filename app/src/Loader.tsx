//fallback loader, purely for setting isLoading. explanation in app.tsx
import { useEffect } from 'react'
import { useStore } from './store'

export function Loader() {
  const setIsLoading = useStore((state) => state.setIsLoading)
  
    useEffect(() => {

    return () => {
      setIsLoading(false)
    }
  }, [setIsLoading])
  
  //const { progress } = useProgress() //doesnt update correctly 
  return null;
}