import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

export default function Notice({ notice }) {
  if (!notice) return null
  const Icon = notice.type === 'success' ? FiCheckCircle : FiAlertCircle
  return (
    <p className={`pf-notice pf-notice--${notice.type}`} role={notice.type === 'success' ? 'status' : 'alert'}>
      <Icon aria-hidden="true" />
      <span>{notice.text}</span>
    </p>
  )
}