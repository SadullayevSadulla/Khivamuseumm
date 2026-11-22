import { useTranslation } from 'react-i18next'
import { FiKey, FiMail, FiUser } from 'react-icons/fi'
import EmailTab from './EmailTab'
import InfoTab from './InfoTab'
import PasswordTab from './PasswordTab'

export default function SettingsView({ user, onUpdated, onReload, resolveError }) {
  const { t } = useTranslation()

  return (
    <div className="pf-settings">
      <div className="pf-section-head">
        <div>
          <h2>{t('profile.nav.settings')}</h2>
          <p>{t('profile.settingsDescription')}</p>
        </div>
      </div>

      <div className="pf-settings__grid">
        <div className="pf-settings__col">
          <section className="pf-card">
            <span className="pf-card__icon"><FiUser /></span>
            <InfoTab user={user} onUpdated={onUpdated} resolveError={resolveError} />
          </section>
          <section className="pf-card">
            <span className="pf-card__icon"><FiMail /></span>
            <EmailTab user={user} onChanged={onReload} resolveError={resolveError} />
          </section>
        </div>
        <div className="pf-settings__col">
          <section className="pf-card">
            <span className="pf-card__icon"><FiKey /></span>
            <PasswordTab resolveError={resolveError} />
          </section>
        </div>
      </div>
    </div>
  )
}