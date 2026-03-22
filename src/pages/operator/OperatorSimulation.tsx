import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import api from '../../services/api'

type SimulationResult = {
  scenario: string
  temperature_celsius: number
  humidity_percent?: number
  battery_level_percent: number
  door_status: string
  door_open_minutes: number
  temp_rise_rate_per_min: number
  risk_score: number
  alert_triggered: string
}

type Hub = {
  id: number
  name: string
  location: string
}

export function OperatorSimulation() {
  const [hubs, setHubs] = useState<Hub[]>([])
  const [hubId, setHubId] = useState<number | ''>('')
  const [scenarioKey, setScenarioKey] = useState<'A' | 'B' | 'C' | ''>('')
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const riskClass =
    result && result.risk_score >= 0.95
      ? 'risk-high'
      : result && result.risk_score >= 0.45
        ? 'risk-medium'
        : 'risk-low'

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<Hub[]>('/hubs')
        setHubs(res.data)
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load hubs')
      }
    }
    load()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!hubId) {
      setError('Select a storage hub.')
      return
    }
    if (!scenarioKey) {
      setError('Choose a scenario (A, B, or C).')
      return
    }

    setLoading(true)
    try {
      const res = await api.post<SimulationResult>('/simulate', {
        hub_id: hubId,
        scenario: scenarioKey,
      })
      setResult(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Unable to run simulation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Simulation</h1>
      <p className="muted">
        Run sensor scenarios (A, B, C) against a specific hub to see risk level
        and alerts, as in the EcoCold monitoring screens.
      </p>

      <section className="card-grid">
        <form className="card form" onSubmit={handleSubmit}>
          <h2>Simulation setup</h2>
          <label>
            Storage hub
            <select
              value={hubId}
              onChange={(e) => setHubId(Number(e.target.value) || '')}
              required
            >
              <option value="">Select hub…</option>
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.name} — {hub.location}
                </option>
              ))}
            </select>
          </label>

          <label>
            Scenario
            <div className="role-fieldset">
              {['A', 'B', 'C'].map((key) => (
                <label key={key} className="radio-pill">
                  <input
                    type="radio"
                    name="scenario"
                    value={key}
                    checked={scenarioKey === key}
                    onChange={() => setScenarioKey(key as 'A' | 'B' | 'C')}
                  />
                  <span>Scenario {key}</span>
                </label>
              ))}
            </div>
          </label>

          {error && <div className="error-banner">{error}</div>}

          <button className="btn primary" type="submit">
            {loading ? 'Running…' : 'Run simulation'}
          </button>
        </form>

        <div className="card">
          <h2>Result</h2>
          {result ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="traffic-light">
                  <div
                    className={
                      'traffic-dot green' +
                      (riskClass === 'risk-low' ? ' active' : '')
                    }
                  />
                  <div
                    className={
                      'traffic-dot yellow' +
                      (riskClass === 'risk-medium' ? ' active' : '')
                    }
                  />
                  <div
                    className={
                      'traffic-dot red' +
                      (riskClass === 'risk-high' ? ' active' : '')
                    }
                  />
                </div>
                <div className={`risk-pill ${riskClass}`}>
                  <span>{result.scenario}</span>
                </div>
              </div>

              <p className="stat-label">Risk score</p>
              <p className="stat-value">
                {(result.risk_score * 100).toFixed(0)}%
              </p>

              <p className="stat-label">Alert triggered</p>
              <p className="stat-value">{result.alert_triggered}</p>

              {result.alert_triggered === 'operator_push' && (
                <div className="alert-banner alert-operator">
                  Operator alert: "Hub door open. Check inverter / seal."
                </div>
              )}
              {result.alert_triggered === 'farmer_sms' && (
                <div className="alert-banner alert-farmer">
                  Farmer SMS sent: "EcoCold ALERT: Heat warning! Your tomatoes are
                  getting hot. Pick up now to save money."
                </div>
              )}

              <p className="muted small">
                Temp {result.temperature_celsius}°C • Humidity{' '}
                {result.humidity_percent ?? '—'}% • Battery{' '}
                {result.battery_level_percent}% • Door {result.door_status} (
                {result.door_open_minutes} min open)
              </p>
            </>
          ) : (
            <p className="muted">Choose a hub and scenario to see the result.</p>
          )}
        </div>
      </section>
    </div>
  )
}

