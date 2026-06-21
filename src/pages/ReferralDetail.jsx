import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferralById } from '../utils/api'
import { formatDate, formatProfit } from '../utils/format'

function ReferralDetail() {
  const { id } = useParams()
  const [row, setRow] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadReferral()
  }, [id])

  const loadReferral = async () => {
    setIsLoading(true)
    setNotFound(false)
    try {
      const response = await fetchReferralById(id)
      const data = response.data.data || response.data

      let matchedRow = null
      if (data && data.id !== undefined) {
        matchedRow = data
      } else if (data && data.referrals) {
        matchedRow = data.referrals.find((r) => String(r.id) === String(id))
      }

      if (matchedRow) {
        setRow(matchedRow)
      } else {
        setNotFound(true)
      }
    } catch (err) {
      setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="detail-page">
      <Navbar />

      <main className="detail-content">
        {isLoading && <p>Loading...</p>}

        {!isLoading && notFound && <h1>Referral not found</h1>}

        {!isLoading && !notFound && row && (
          <>
            <h1>Referral Details</h1>
            <h2>{row.name}</h2>

            <dl className="detail-list">
              <dt>Referral ID</dt>
              <dd>{row.id}</dd>

              <dt>Service Name</dt>
              <dd>{row.serviceName}</dd>

              <dt>Date</dt>
              <dd>{formatDate(row.date)}</dd>

              <dt>Profit</dt>
              <dd>{formatProfit(row.profit)}</dd>
            </dl>

            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ReferralDetail
