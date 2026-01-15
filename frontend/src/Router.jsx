import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export default function Router({ onError }) {
  try {
    return <RouterProvider router={router} />
  } catch (error) {
    onError?.(error)
    throw error
  }
}
