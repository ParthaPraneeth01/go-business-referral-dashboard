import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchReferrals } from '../utils/api'
import { formatDate, formatProfit } from '../utils/format'

const ROWS_PER_PAGE = 10

function Dashboard() {
  const [metrics, setMetrics] = useState([])
  const [serviceSummary, setServiceSummary] = useState(null)
  const [referral, setReferral] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    loadReferrals()
  }, [searchTerm, sortOrder])

  const loadReferrals = async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const params = { sort: sortOrder }
      if (searchTerm) {
        params.search = searchTerm
      }
      const response = await fetchReferrals(params)
      const data = response.data.data || response.data

      setMetrics(data.metrics || [])
      setServiceSummary(data.serviceSummary || null)
      setReferral(data.referral || null)
      setReferrals(data.referrals || [])
      setCurrentPage(1)
    } catch (err) {
      if (err.response && err.response.data) {
        const status = err.response.status
        const message = err.response.data.message || 'Failed to load referrals'
        setErrorMsg(`${message} (${status})`)
      } else {
        setErrorMsg('Failed to load referrals')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  }

  const totalPages = Math.ceil(referrals.length / ROWS_PER_PAGE)
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const pageRows = referrals.slice(startIndex, startIndex + ROWS_PER_PAGE)
  const fromCount = referrals.length === 0 ? 0 : startIndex + 1
  const toCount = Math.min(startIndex + ROWS_PER_PAGE, referrals.length)

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-content">
        <h1>Referral Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your referrals, earnings, and partner activity in one place.
        </p>

        {isLoading && <p>Loading...</p>}
        {errorMsg && (
          <p role="alert" className="error-text">
            {errorMsg}
          </p>
        )}

        {!isLoading && !errorMsg && (
          <>
            <section role="region" aria-label="Overview metrics" className="overview-section">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <div key={metric.id} className="metric-card">
                    <p className="metric-label">{metric.label}</p>
                    <p className="metric-value">{metric.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {serviceSummary && (
              <section aria-label="Service summary" className="service-summary-section">
                <h2>Service summary</h2>
                <div className="summary-grid">
                  <div>
                    <p className="summary-label">Service</p>
                    <p>{serviceSummary.service}</p>
                  </div>
                  <div>
                    <p className="summary-label">Your Referrals</p>
                    <p>{serviceSummary.yourReferrals}</p>
                  </div>
                  <div>
                    <p className="summary-label">Active Referrals</p>
                    <p>{serviceSummary.activeReferrals}</p>
                  </div>
                  <div>
                    <p className="summary-label">Total Ref. Earnings</p>
                    <p>{serviceSummary.totalRefEarnings}</p>
                  </div>
                </div>
              </section>
            )}

            {referral && (
              <section aria-label="Share referral" className="share-section">
                <h2>Refer friends and earn more</h2>
                <div className="share-row">
                  <label htmlFor="referral-link">Your Referral Link</label>
                  <input id="referral-link" type="text" value={referral.link} readOnly />
                  <button onClick={() => handleCopy(referral.link)}>Copy</button>
                </div>
                <div className="share-row">
                  <label htmlFor="referral-code">Your Referral Code</label>
                  <input id="referral-code" type="text" value={referral.code} readOnly />
                  <button onClick={() => handleCopy(referral.code)}>Copy</button>
                </div>
              </section>
            )}

            <section className="referrals-section">
              <h2>All referrals</h2>

              <div className="table-controls">
                <input
                  type="text"
                  placeholder="Name or service…"
                  aria-label="Search referrals"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <label>
                  Sort by date
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </label>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 && (
                    <tr>
                      <td colSpan="4">No matching entries</td>
                    </tr>
                  )}
                  {pageRows.map((row) => (
                    <tr key={row.id} onClick={() => navigate(`/referral/${row.id}`)}>
                      <td>{row.name}</td>
                      <td>{row.serviceName}</td>
                      <td>{formatDate(row.date)}</td>
                      <td>{formatProfit(row.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="table-footer">
                Showing {fromCount}–{toCount} of {referrals.length} entries
              </p>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={pageNum === currentPage ? 'page-active' : ''}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard
