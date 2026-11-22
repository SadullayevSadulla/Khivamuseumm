export const AUTH_EVENT = 'client-auth-change'

export const getToken = () => localStorage.getItem('client_token')

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('client_user') || 'null')
  } catch {
    return null
  }
}

export const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export const saveUser = (user) => {
  if (user) localStorage.setItem('client_user', JSON.stringify(user))
  notifyAuthChange()
}

export const clearSession = () => {
  localStorage.removeItem('client_token')
  localStorage.removeItem('client_user')
  notifyAuthChange()
}

export const pickAvatarUrl = (user) => {
  const images = Array.isArray(user?.images) ? user.images : []
  return (images.find((item) => item.mainImage) || images[0])?.url || null
}

export const getInitials = (user) =>
  `${(user?.firstName || '').charAt(0)}${(user?.lastName || '').charAt(0)}`.toUpperCase()