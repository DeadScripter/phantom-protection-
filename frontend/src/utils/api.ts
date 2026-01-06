import axios from 'axios'
import { Script, WhitelistEntry } from './types'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
})

export const auth = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  signup: (email: string, password: string, cfToken: string) =>
    api.post('/auth/signup', { email, password, cfToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  setup2FA: () => api.post('/auth/2fa/setup'),
  verify2FA: (token: string) => api.post('/auth/2fa/verify', { token })
}

export const scripts = {
  list: () => api.get<Script[]>('/scripts'),
  get: (id: string) => api.get<Script>(`/scripts/${id}`),
  create: (data: Partial<Script>) => api.post<Script>('/scripts', data),
  update: (id: string, data: Partial<Script>) => api.put<Script>(`/scripts/${id}`, data),
  delete: (id: string) => api.delete(`/scripts/${id}`),
  loader: (id: string) => api.get<string>(`/scripts/${id}/loader`)
}

export const whitelist = {
  list: (scriptId: string) => api.get<WhitelistEntry[]>(`/whitelist/${scriptId}`),
  add: (data: Omit<WhitelistEntry, 'id'>) => api.post('/whitelist', data),
  remove: (id: string) => api.delete(`/whitelist/${id}`)
}
