export const api = {
  async me() {
    const res = await fetch('/auth/me', { credentials: 'include' })
    return res.json()
  },
  async getUsers() {
    const res = await fetch('/users', { credentials: 'include' })
    return res.json()
  },
  async getReminders() {
    const res = await fetch('/reminders', { credentials: 'include' })
    return res.json()
  },
  async login(body) {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })
    return res.json()
  },
  async register(body) {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    })
    return res.json()
  },
  async logout() {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' })
  },
  async getTeams() {
    const r = await fetch('/teams', { credentials: 'include' })
    return r.json()
  },
  async createTeam(name) {
    const r = await fetch('/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ name }) })
    return r.json()
  },
  async addMember(teamId, user_id) {
    const r = await fetch(`/teams/${teamId}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ user_id }) })
    return r.json()
  },
  async deleteTeam(teamId) {
    const r = await fetch(`/teams/${teamId}`, { method: 'DELETE', credentials: 'include' })
    return r.json()
  },
  async inviteToTeam(teamId, email) {
    const r = await fetch(`/teams/${teamId}/invite`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ email }) })
    return r.json()
  },
  async getTasks(params = {}) {
    const qs = new URLSearchParams()
    if (params.teamId) qs.set('teamId', params.teamId)
    if (params.assigneeId) qs.set('assigneeId', params.assigneeId)
    const r = await fetch(`/tasks?${qs.toString()}`, { credentials: 'include' })
    return r.json()
  },
  async createTask(data) {
    const r = await fetch('/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(data) })
    return r.json()
  },
  async updateTask(id, changes) {
    const r = await fetch(`/tasks/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(changes) })
    return r.json()
  },
  async deleteTask(id) {
    const r = await fetch(`/tasks/${id}`, { method: 'DELETE', credentials: 'include' })
    return r.json()
  }
}
