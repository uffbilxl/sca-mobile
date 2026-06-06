import { OPPORTUNITIES } from './data'
import type { Opportunity, SCAEvent } from './types'

const API = 'https://bcusca.org/api'

function toDate(v: any): Date | null {
  if (v == null) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

function parseOpportunity(o: any): Opportunity {
  return { ...o, deadline: toDate(o.deadline), createdAt: toDate(o.createdAt) ?? new Date(0) }
}

function parseEvent(e: any): SCAEvent {
  return { ...e, date: new Date(e.date), endDate: toDate(e.endDate) }
}

export async function fetchOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch(`${API}/opportunities`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: any[] = await res.json()
    if (!Array.isArray(data)) throw new Error('unexpected shape')
    return data.map(parseOpportunity)
  } catch (err) {
    console.warn('[bcusca/api] fetchOpportunities – using static fallback:', err)
    return OPPORTUNITIES
  }
}

export const STATIC_EVENTS: SCAEvent[] = [
  {
    id: 'social-night-june-2026',
    title: 'Social Night: Debate & Gaming',
    description:
      'A collaborative social night with BCU Gaming Society and the Law Debating & Mooting Society. Speed debates on topics from Gaming and AI (12–3 PM), then a relaxed gaming session (3–8 PM).',
    location: 'STEAMhouse, CST-302',
    isOnline: false,
    date: new Date('2026-06-04T12:00:00'),
    endDate: new Date('2026-06-04T20:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'OTHER',
  },
]

export async function fetchEvents(): Promise<SCAEvent[]> {
  try {
    const res = await fetch(`${API}/events`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: any[] = await res.json()
    if (!Array.isArray(data)) throw new Error('unexpected shape')
    return data.map(parseEvent)
  } catch (err) {
    console.warn('[bcusca/api] fetchEvents – using static fallback:', err)
    return STATIC_EVENTS
  }
}
