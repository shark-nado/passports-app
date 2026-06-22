import { useApp } from '../../context/AppContext'
import { t } from '../../services/translations'

interface LayoutHeaderProps {
  hideOnSelect?: boolean
}

export default function LayoutHeader({ hideOnSelect }: LayoutHeaderProps) {
  const { currentLanguage } = useApp()

  if (hideOnSelect) return null

  return (
    <header className="layout-header">
      <a className="sr-only" href="#main-content">Skip to main content</a>
      <section className="layout-title" aria-label="Site Name">
        <div className="layout-container container">
          <a className="title-header title-header-large" href="/">
            {t('site.name', undefined, currentLanguage)}
          </a>
          <a className="title-header title-header-short" href="/">
            {t('site.short', undefined, currentLanguage)}
          </a>
          <a className="title-logo" href="https://www.ucsd.edu">
            UC San Diego
          </a>
        </div>
      </section>
    </header>
  )
}
