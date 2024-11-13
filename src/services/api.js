import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username: username, password: password }),
  getUserInfo: () => api.get('/auth/user'),
  changePassword: (id, username, newPassword) =>
    api.post('/auth/upsert', { id, username, newPassword }),
  create: (username, password, name) => api.post('/auth/signup', { username, password, name }),
  logout: () => localStorage.removeItem('token'),
}

export const accountService = {
  getAll: () => api.get('/account/list'),
  getById: (id) => api.get(`/account/${id}`),
  create: (data) => api.post('/account/create', data),
  update: (id, data) => api.put(`/account/update/${id}`, data),
}

export default api
