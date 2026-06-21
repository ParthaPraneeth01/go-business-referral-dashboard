import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}

export default NotFound
