import { OPPORTUNITIES } from './data'
import type { Opportunity, SCAEvent } from './types'

const API = 'https://bcusca.org/api'

function toDate(v: any): Date | null {
  if (v == null) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

function parseTags(raw: any): string[] {
  if (!Array.isArray(raw)) return []
  return raw.map((t: any) => {
    if (typeof t === 'string') return t
    if (t?.tag?.name) return t.tag.name
    if (t?.name) return t.name
    return String(t)
  })
}

function parseOpportunity(o: any): Opportunity {
  return {
    ...o,
    deadline: toDate(o.deadline),
    createdAt: toDate(o.createdAt) ?? new Date(0),
    tags: parseTags(o.tags),
  }
}

function parseEvent(e: any): SCAEvent {
  return { ...e, date: new Date(e.date), endDate: toDate(e.endDate) }
}

export async function fetchOpportunities(): Promise<{ data: Opportunity[]; live: boolean }> {
  try {
    const res = await fetch(`${API}/opportunities`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw: any[] = await res.json()
    if (!Array.isArray(raw)) throw new Error('unexpected shape')
    return { data: raw.map(parseOpportunity), live: true }
  } catch (err) {
    console.warn('[bcusca/api] fetchOpportunities – using static fallback:', err)
    return { data: OPPORTUNITIES, live: false }
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

export async function fetchEvents(): Promise<{ data: SCAEvent[]; live: boolean }> {
  try {
    const res = await fetch(`${API}/events`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const raw: any[] = await res.json()
    if (!Array.isArray(raw)) throw new Error('unexpected shape')
    return { data: raw.map(parseEvent), live: true }
  } catch (err) {
    console.warn('[bcusca/api] fetchEvents – using static fallback:', err)
    return { data: STATIC_EVENTS, live: false }
  }
}
