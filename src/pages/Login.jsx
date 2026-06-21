import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { loginRequest } from '../utils/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const token = Cookies.get('jwt_token')
  if (token) {
    return <Navigate to="/" replace />
  }

  const handleSignIn = async () => {
    try {
      const response = await loginRequest(email, password)
      const jwtToken = response.data.data.token
      Cookies.set('jwt_token', jwtToken)
      navigate('/')
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">Go Business</h1>
        <p className="login-tagline">Sign in to open your referral dashboard.</p>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleSignIn} className="signin-btn">
          Sign in
        </button>
      </div>
    </div>
  )
}

export default Login
