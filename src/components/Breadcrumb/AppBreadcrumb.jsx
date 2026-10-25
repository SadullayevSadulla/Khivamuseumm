import { Breadcrumb } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import './appBreadcrumb.css'

const AppBreadcrumb = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  if (pathname === '/') return null

  const homeItem = { title: <Link to="/">{t('header.home')}</Link> }
  let items = [homeItem]

  if (pathname === '/news') {
    items.push({ title: t('header.news') })
  } else if (pathname.startsWith('/news/')) {
    items.push({ title: <Link to="/news">{t('header.news')}</Link> })
    items.push({ title: t('breadcrumb.details') })
  } else if (pathname === '/announcements') {
    items.push({ title: t('header.announcements') })
  } else if (pathname.startsWith('/announcements/')) {
    items.push({ title: <Link to="/announcements">{t('header.announcements')}</Link> })
    items.push({ title: t('breadcrumb.details') })
  } else if (pathname === '/about') {
    items.push({ title: t('header.aboutTheMuseum') })
  } else if (pathname === '/employees') {
    items.push({ title: t('header.employees') })
  } else if (pathname === '/collections') {
    items.push({ title: t('header.museumCollection') })
  } else if (pathname === '/gallery') {
    items.push({ title: t('header.gallery') })
  }

  return (
    <div className="app-breadcrumb-wrap">
      <div className="container">
        <Breadcrumb className="app-breadcrumb" items={items} />
      </div>
    </div>
  )
}

export default AppBreadcrumb
