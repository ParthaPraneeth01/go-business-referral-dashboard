import axios from 'axios'
import Cookies from 'js-cookie'

const BASE_URL = 'https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api'

export const loginRequest = (email, password) => {
  return axios.post(`${BASE_URL}/auth/signin`, { email, password })
}

export const fetchReferrals = (params = {}) => {
  const token = Cookies.get('jwt_token')
  return axios.get(`${BASE_URL}/referrals`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  })
}

export const fetchReferralById = (id) => {
  const token = Cookies.get('jwt_token')
  return axios.get(`${BASE_URL}/referrals`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { id },
  })
}
