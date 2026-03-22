import { useEffect, useState } from 'react'
import api from '../../services/api'

type Farmer = {
  id: number
  farm_name: string
  location: string
  phone: string
}

export function OperatorFarmers() {
  const [farmers, setFarmers] = useState<Farmer[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Farmer[]>('/farmers')
        setFarmers(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load farmers')
      }
    }
    load()
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">Farmers</h1>
      {error && <div className="error-banner">{error}</div>}
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Farm</th>
              <th>Location</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.farm_name}</td>
                <td>{farmer.location}</td>
                <td>{farmer.phone}</td>
              </tr>
            ))}
            {farmers.length === 0 && !error && (
              <tr>
                <td colSpan={3} className="muted">
                  No farmers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

