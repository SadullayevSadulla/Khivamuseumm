import api from '../../api'

export const getToken = () => localStorage.getItem('client_token')

export const clearSession = () => {
  localStorage.removeItem('client_token')
  localStorage.removeItem('client_user')
}

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
  formData.append('avatar', file)
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