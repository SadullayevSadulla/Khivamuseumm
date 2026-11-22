import { useEffect, useState } from 'react'
import { AUTH_EVENT, getStoredUser, getToken } from '../utils/auth'

const read = () => ({ loggedIn: Boolean(getToken()), user: getStoredUser() })

export default function useAuth() {
  const [state, setState] = useState(read)

  useEffect(() => {
    const update = () => setState(read())
    window.addEventListener(AUTH_EVENT, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(AUTH_EVENT, update)
      window.removeEventListener('storage', update)
    }
  }, [])

  return state
}