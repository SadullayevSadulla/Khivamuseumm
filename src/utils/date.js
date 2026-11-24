export const parseSiteDate = (value) => {
  if (!value) return null

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }

  if (typeof value === 'object') {
    const year = Number(value.year)
    const month = Number(value.month)
    const day = Number(value.day)
    if (year && month && day) {
      const date = new Date(Date.UTC(year, month - 1, day, 12))
      return Number.isNaN(date.getTime()) ? null : date
    }
  }

  let text = String(value).trim()
  if (!text) return null

  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(text)) {
    const [year, month, day] = text.slice(0, 10).replaceAll('/', '-').split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day, 12))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const monthNameMatch = text.match(/(\d{4})[^\d]*(?:M\s*)?(\d{1,2})[^\d]*(\d{1,2})/i)
  if (monthNameMatch) {
    const [, year, month, day] = monthNameMatch.map((part) => Number(part) || part)
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const date = new Date(Date.UTC(year, month - 1, day, 12))
      if (!Number.isNaN(date.getTime())) return date
    }
  }

  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatSiteDate = (value, language = 'uz', style = 'long') => {
  const date = parseSiteDate(value)
  if (!date) return ''

  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const year = date.getUTCFullYear()

  return `${day}.${month}.${year}`
}
