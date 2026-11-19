import "./auth.css";

export default function AuthLayout({
  children,
  compact = false,
  eyebrow,
  title,
  subtitle,
  footer,
}) {
  return (
    <section className="au-page">
      <div className={`au-card${compact ? " au-card--compact" : ""}`}>
        {!compact && (
          <aside className="au-aside" aria-hidden="true">
            <div className="au-aside__text">
              {eyebrow && <span className="kh-eyebrow">{eyebrow}</span>}
              {title && <h2>{title}</h2>}
              {subtitle && <p>{subtitle}</p>}
            </div>
          </aside>
        )}

        <div className="au-main">
          <header className="au-head">
            {eyebrow && <span className="kh-eyebrow">{eyebrow}</span>}
            {title && <h1>{title}</h1>}
            {subtitle && <p className="au-subtitle">{subtitle}</p>}
          </header>

          {children}

          {footer && <div className="au-footer">{footer}</div>}
        </div>
      </div>
    </section>
  );
}
