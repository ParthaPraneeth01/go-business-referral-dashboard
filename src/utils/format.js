export const formatDate = (isoDate) => {
  if (!isoDate) return ''
  return isoDate.split('-').join('/')
}

export const formatProfit = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
