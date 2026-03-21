import { Html, useProgress } from '@react-three/drei'

export function Loader() {
  const { progress } = useProgress() //see if actually rendered, as canvas is set opaque
  return <Html center>{progress} % loaded</Html>
}