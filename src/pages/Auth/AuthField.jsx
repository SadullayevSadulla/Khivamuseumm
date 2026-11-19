import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiEye, FiEyeOff } from 'react-icons/fi'

/** Ikonali kirish maydoni. type="password" bo'lsa, ko'rsatish/yashirish tugmasi qo'shiladi. */
export default function AuthField({ id, label, icon: Icon, type = 'text', hint, ...inputProps }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="au-field">
      <label htmlFor={id}>{label}</label>
      <div className={`au-input${isPassword ? ' au-input--password' : ''}`}>
        {Icon && <Icon className="au-input__icon" aria-hidden="true" />}
        <input id={id} name={id} type={isPassword && visible ? 'text' : type} {...inputProps} />
        {isPassword && (
          <button
            type="button"
            className="au-input__toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
          >
            {visible ? <FiEye /> : <FiEyeOff />}
          </button>
        )}
      </div>
      {hint && <small>{hint}</small>}
    </div>
  )
}