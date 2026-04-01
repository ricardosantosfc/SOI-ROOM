//import { Html, useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useStore } from './store'

export function Loader() {
  const setIsLoading = useStore((state) => state.setIsLoading)
  
    useEffect(() => {
    // This runs when Loader mounts
    console.log('Loader mounted')

    // Cleanup runs when Loader unmounts
    return () => {
      setIsLoading(false)
      console.log('Loader unmounted ')
    }
  }, [setIsLoading])
  
  //const { progress } = useProgress() //see if actually rendered, as canvas is set opaque
  return null;
}