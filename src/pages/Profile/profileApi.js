import api from '../../api'
import { clearSession, getToken } from '../../utils/auth'

export { clearSession, getToken }

const authConfig = (extraHeaders = {}) => ({
  headers: { Authorization: `Bearer ${getToken() || ''}`, ...extraHeaders },
})

export const fetchProfile = async () => {
  const res = await api.get('/profile', authConfig())
  return res?.data?.user ?? null
}

export const updateProfile = async ({ firstName, lastName }) => {
  const res = await api.patch('/profile', { firstName, lastName }, authConfig())
  return res?.data?.user ?? null
}

export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await api.put('/profile/avatar', formData, authConfig({ 'Content-Type': 'multipart/form-data' }))
  return res?.data?.user ?? null
}

export const deleteAvatar = async () => {
  const res = await api.delete('/profile/avatar', authConfig())
  return res?.data?.user ?? null
}

export const changePassword = ({ oldPassword, newPassword }) =>
  api.patch('/profile/password', { oldPassword, newPassword }, authConfig())

export const requestEmailChange = ({ newEmail }) =>
  api.post('/profile/email/request', { newEmail }, authConfig())

export const confirmEmailChange = ({ newEmail, code }) =>
  api.post('/profile/email/confirm', { newEmail, code }, authConfig())

const ORDER_KEYS = ['orders', 'tickets', 'items', 'results', 'data']

const findOrders = (value, depth = 0) => {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object' || depth > 2) return null
  for (const key of ORDER_KEYS) {
    const found = findOrders(value[key], depth + 1)
    if (found) return found
  }
  const firstArray = Object.values(value).find(Array.isArray)
  return firstArray || null
}

export const fetchMyOrders = async () => {
  const res = await api.get('/tickets/my/orders', authConfig())
  return findOrders(res?.data) || []
}