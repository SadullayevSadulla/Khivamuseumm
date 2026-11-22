import { Icons } from '../../icons/icons'
import useAuth from '../../hooks/useAuth'
import { getInitials, pickAvatarUrl } from '../../utils/auth'

export default function ProfileIcon({ size = 44, round = false }) {
  const { loggedIn, user } = useAuth()
  const avatarUrl = loggedIn ? pickAvatarUrl(user) : null
  const initials = loggedIn ? getInitials(user) : ''
  const style = { width: size, height: size, borderRadius: round ? '50%' : undefined }

  if (avatarUrl) {
    return <img className="profile-icon-img" src={avatarUrl} alt="" style={style} />
  }
  if (initials) {
    return (
      <span className="profile-icon-initials" style={{ ...style, fontSize: Math.round(size * 0.38) }}>
        {initials}
      </span>
    )
  }
  return <Icons.personIcon />
}