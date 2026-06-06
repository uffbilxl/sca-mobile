import { useState, useCallback, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Animated, Platform, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { MapPin, Wifi, Clock, Calendar, WifiOff } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import type { SCAEvent } from '../lib/types'
import { fetchEvents, STATIC_EVENTS } from '../lib/api'
import AppHeader from '../components/AppHeader'
import AnimatedBackground from '../components/AnimatedBackground'

const nd = Platform.OS !== 'web'

function pad(n: number) { return String(n).padStart(2, '0') }
function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
function formatTime(d: Date) {
  return d.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function useCountdown(target: Date | null) {
  const [diff, setDiff] = useState(() => (target ? Math.max(0, +target - Date.now()) : 0))
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setDiff(Math.max(0, +target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    over: diff === 0,
  }
}

function PulseDot({ color }: { color: string }) {
  const opacity = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.15, duration: 700, useNativeDriver: nd }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: nd }),
      ])
    ).start()
  }, [])
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, opacity }} />
}

function CountdownUnit({ value, label, c }: { value: number; label: string; c: any }) {
  return (
    <View style={styles.countUnit}>
      <View style={[styles.countBox, { backgroundColor: '#1a2540', borderColor: '#1e2d45' }]}>
        <Text style={styles.countNum}>{pad(value)}</Text>
      </View>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  )
}

export default function EventsScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [events, setEvents] = useState<SCAEvent[]>(STATIC_EVENTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetchEvents().then(({ data, live, error: err }) => {
      if (!active) return
      setEvents(data)
      setError(live ? null : err)
      setLoading(false)
    })
    return () => { active = false }
  }, []))

  const now = new Date()
  const upcoming = events.filter(e => e.date >= now).sort((a, b) => +a.date - +b.date)
  const past = events.filter(e => e.date < now).sort((a, b) => +b.date - +a.date)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const list = tab === 'upcoming' ? upcoming : past
  const nextEvent = upcoming[0] ?? null
  const countdown = useCountdown(nextEvent?.date ?? null)

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AnimatedBackground />
      <AppHeader variant="screen" title="Events" />
      {error && !loading && (
        <View style={[styles.errorCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <WifiOff size={18} color={c.textMuted} strokeWidth={1.75} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.errorTitle, { color: c.textPrimary }]}>Couldn't load events</Text>
            <Text style={[styles.errorSub, { color: c.textMuted }]}>{error}</Text>
          </View>
        </View>
      )}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading && <ActivityIndicator size="small" color="#4a82f0" style={{ marginTop: 32 }} />}

        {/* Countdown hero + tabs + list — hidden while loading */}
        {!loading && nextEvent && !countdown.over && (
          <View style={styles.hero}>
            <View pointerEvents="none" style={styles.heroGlowWrap}>
              <View style={styles.heroGlow} />
            </View>
            <View style={styles.heroLive}>
              <PulseDot color="#4a82f0" />
              <Text style={styles.heroLiveText}>Next Event</Text>
            </View>
            <Text style={styles.heroTitle}>{nextEvent.title}</Text>
            <View style={{ gap: 4 }}>
              <Text style={styles.heroMeta}>{formatDate(nextEvent.date)}</Text>
              <Text style={styles.heroMeta}>
                {formatTime(nextEvent.date)}{nextEvent.endDate ? ` – ${formatTime(nextEvent.endDate)}` : ''}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                {nextEvent.isOnline
                  ? <Wifi size={12} color="#8da0bc" strokeWidth={1.75} />
                  : <MapPin size={12} color="#8da0bc" strokeWidth={1.75} />
                }
                <Text style={styles.heroMeta}>{nextEvent.location}</Text>
              </View>
            </View>
            <View style={styles.countRow}>
              <CountdownUnit value={countdown.days} label="Days" c={c} />
              <Text style={styles.countSep}>:</Text>
              <CountdownUnit value={countdown.hours} label="Hrs" c={c} />
              <Text style={styles.countSep}>:</Text>
              <CountdownUnit value={countdown.mins} label="Min" c={c} />
              <Text style={styles.countSep}>:</Text>
              <CountdownUnit value={countdown.secs} label="Sec" c={c} />
            </View>
            {nextEvent.registrationUrl ? (
              <TouchableOpacity style={styles.registerBtn} onPress={() => Linking.openURL(nextEvent.registrationUrl!)} activeOpacity={0.85}>
                <Text style={styles.registerBtnText}>Register now →</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>Open to all — no registration needed</Text>
              </View>
            )}
          </View>
        )}

        {/* Tabs */}
        {!loading && <View style={[styles.tabs, { backgroundColor: c.bgInput }]}>
          {(['upcoming', 'past'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && [styles.tabActive, { backgroundColor: c.blue }]]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, { color: tab === t ? '#fff' : c.textMuted }, tab === t && styles.tabTextActive]}>
                {t === 'upcoming' ? `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` : 'Past'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>}

        {/* Event list */}
        {!loading && (list.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <Calendar size={28} color={c.textMuted} strokeWidth={1.5} />
            <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>{tab === 'upcoming' ? 'Events coming soon' : 'No past events yet'}</Text>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>
              {tab === 'upcoming'
                ? 'The SCA is busy planning workshops, talks, and networking events. Stay tuned.'
                : 'Previous events will appear here once they have taken place.'}
            </Text>
          </View>
        ) : (
          <View style={styles.eventList}>
            {list.map(event => {
              const isPast = event.date < now
              return (
                <View key={event.id} style={[
                  styles.eventCard,
                  { backgroundColor: c.bgCard, borderColor: c.border },
                  isPast && { opacity: 0.55 },
                ]}>
                  <View style={[
                    styles.dateBadge,
                    { backgroundColor: isPast ? c.bgInput : c.blueLight, borderColor: isPast ? c.border : `${c.blue}25` },
                  ]}>
                    <Text style={[styles.dateMonth, { color: isPast ? c.textMuted : `${c.blue}80` }]}>
                      {event.date.toLocaleString('en-GB', { month: 'short' }).toUpperCase()}
                    </Text>
                    <Text style={[styles.dateDay, { color: isPast ? c.textSecondary : c.blue }]}>
                      {event.date.getDate()}
                    </Text>
                    <Text style={[styles.dateWeekday, { color: isPast ? c.textMuted : `${c.blue}60` }]}>
                      {event.date.toLocaleString('en-GB', { weekday: 'short' }).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={[styles.eventTitle, { color: c.textPrimary }]}>{event.title}</Text>
                    {event.description && (
                      <Text style={[styles.eventDesc, { color: c.textSecondary }]} numberOfLines={3}>{event.description}</Text>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        {event.isOnline
                          ? <Wifi size={11} color={c.textMuted} strokeWidth={1.75} />
                          : <MapPin size={11} color={c.textMuted} strokeWidth={1.75} />
                        }
                        <Text style={[styles.eventMeta, { color: c.textMuted }]}>{event.location}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} color={c.textMuted} strokeWidth={1.75} />
                        <Text style={[styles.eventMeta, { color: c.textMuted }]}>
                          {formatTime(event.date)}{event.endDate ? ` – ${formatTime(event.endDate)}` : ''}
                        </Text>
                      </View>
                    </View>
                    {!isPast && !event.spots && !event.registrationUrl && (
                      <View style={[styles.openSmall, { borderColor: c.border }]}>
                        <Text style={[styles.openSmallText, { color: c.textSecondary }]}>Open to all</Text>
                      </View>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14, paddingTop: 14 },

  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 10,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  errorTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold' },
  errorSub: { fontSize: 11, fontFamily: 'Geist-Regular', marginTop: 1 },

  /* Hero (always dark) */
  hero: {
    backgroundColor: '#0d1422',
    borderWidth: 1,
    borderColor: 'rgba(74,130,240,0.2)',
    borderRadius: 16,
    padding: 20,
    gap: 14,
    overflow: 'hidden',
  },
  heroGlowWrap: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, overflow: 'hidden' },
  heroGlow: { position: 'absolute', inset: 0, borderRadius: 999, backgroundColor: 'rgba(74,130,240,0.10)' } as any,
  heroLive: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroLiveText: { fontSize: 10, color: '#4a82f0', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 20, fontFamily: 'Geist-Bold', color: '#f0f4ff', letterSpacing: -0.4, lineHeight: 26 },
  heroMeta: { fontSize: 12, color: '#8da0bc', lineHeight: 18 },
  countRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  countUnit: { alignItems: 'center', gap: 4 },
  countBox: { width: 54, height: 52, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  countNum: { fontSize: 22, fontWeight: '900', color: '#f0f4ff' },
  countLabel: { fontSize: 8, fontWeight: '700', color: '#4a6080', letterSpacing: 1, textTransform: 'uppercase' },
  countSep: { fontSize: 18, fontWeight: '900', color: '#1e2d45', marginBottom: 18 },
  openBadge: {
    borderWidth: 1, borderColor: '#1e2d45', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start',
  },
  openBadgeText: { fontSize: 12, color: '#8da0bc', fontWeight: '500' },
  registerBtn: {
    backgroundColor: '#4a82f0', paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 10, alignSelf: 'flex-start',
  },
  registerBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  tabs: {
    flexDirection: 'row', borderRadius: 10, padding: 4, alignSelf: 'flex-start', gap: 2,
  },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 7 },
  tabActive: {},
  tabText: { fontSize: 12, fontFamily: 'Geist-Medium' },
  tabTextActive: { fontFamily: 'Geist-SemiBold' },

  empty: {
    borderWidth: 1, borderRadius: 16, padding: 32,
    alignItems: 'center', gap: 10,
  },
  emptyTitle: { fontSize: 16, fontFamily: 'Geist-SemiBold' },
  emptyText: { fontSize: 13, fontFamily: 'Geist-Regular', textAlign: 'center', lineHeight: 20 },

  eventList: { gap: 8 },
  eventCard: {
    flexDirection: 'row', borderWidth: 1,
    borderRadius: 14, padding: 14, gap: 12,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  dateBadge: {
    width: 54, height: 62, borderRadius: 10,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  dateMonth: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  dateDay: { fontSize: 26, fontWeight: '900', lineHeight: 30 },
  dateWeekday: { fontSize: 9, fontWeight: '600', letterSpacing: 0.6 },
  eventInfo: { flex: 1, gap: 4 },
  eventTitle: { fontSize: 15, fontFamily: 'Geist-SemiBold', lineHeight: 20 },
  eventDesc: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 17 },
  eventMeta: { fontSize: 11, fontFamily: 'Geist-Regular' },
  openSmall: {
    alignSelf: 'flex-start', borderWidth: 1,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2,
  },
  openSmallText: { fontSize: 10, fontFamily: 'Geist-Medium' },
})
