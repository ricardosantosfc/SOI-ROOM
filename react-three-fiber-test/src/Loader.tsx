//import { Html, useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useStore } from './store'

export function Loader() {
  const setIsLoading = useStore((state) => state.setIsLoading)
  
    useEffect(() => {

    return () => {
      setIsLoading(false)
    }
  }, [setIsLoading])
  
  //const { progress } = useProgress() //see if actually rendered, as canvas is set opaque
  return null;
}