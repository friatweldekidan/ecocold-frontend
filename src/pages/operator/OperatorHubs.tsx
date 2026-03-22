import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../../services/api'

type Hub = {
  id: number
  name: string
  location: string
  capacity: number
}

export function OperatorHubs() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [capacity, setCapacity] = useState(100)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await api.get<Hub[]>('/hubs')
      setHubs(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to load hubs')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/hubs', { name, location, capacity })
      setName('')
      setLocation('')
      setCapacity(100)
      load()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to create hub')
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Storage hubs</h1>

      <section className="card-grid">
        <div className="card">
          <h2>Existing hubs</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {hubs.map((hub) => (
                <tr key={hub.id}>
                  <td>{hub.name}</td>
                  <td>{hub.location}</td>
                  <td>{hub.capacity}</td>
                </tr>
              ))}
              {hubs.length === 0 && (
                <tr>
                  <td colSpan={3} className="muted">
                    No hubs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form className="card form" onSubmit={handleCreate}>
          <h2>Add hub</h2>
          <label>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Location
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </label>
          <label>
            Capacity (crates)
            <input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
          </label>

          {error && <div className="error-banner">{error}</div>}

          <button className="btn primary" type="submit">
            Save hub
          </button>
        </form>
      </section>
    </div>
  )
}

