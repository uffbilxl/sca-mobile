import type { Opportunity, SCAEvent } from './types'

const API = 'https://bcusca.org/api'
const TIMEOUT_MS = 10000

function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  return fetch(url, {
    headers: { Accept: 'application/json' },
    signal: controller.signal,
  }).finally(() => clearTimeout(timer))
}

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

export type FetchResult<T> = { data: T[]; live: boolean; error: string | null }

export async function fetchOpportunities(): Promise<FetchResult<Opportunity>> {
  try {
    const res = await fetchWithTimeout(`${API}/opportunities`)
    if (!res.ok) throw new Error(`Server returned ${res.status}`)
    const raw: any[] = await res.json()
    if (!Array.isArray(raw)) throw new Error('Unexpected response shape')
    return { data: raw.map(parseOpportunity), live: true, error: null }
  } catch (err: any) {
    const msg = err?.name === 'AbortError' ? 'Request timed out' : (err?.message ?? 'Network error')
    console.warn('[bcusca/api] fetchOpportunities failed:', msg)
    return { data: [], live: false, error: msg }
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

export async function fetchEvents(): Promise<FetchResult<SCAEvent>> {
  try {
    const res = await fetchWithTimeout(`${API}/events`)
    if (!res.ok) throw new Error(`Server returned ${res.status}`)
    const raw: any[] = await res.json()
    if (!Array.isArray(raw)) throw new Error('Unexpected response shape')
    return { data: raw.map(parseEvent), live: true, error: null }
  } catch (err: any) {
    const msg = err?.name === 'AbortError' ? 'Request timed out' : (err?.message ?? 'Network error')
    console.warn('[bcusca/api] fetchEvents failed:', msg)
    return { data: STATIC_EVENTS, live: false, error: msg }
  }
}
