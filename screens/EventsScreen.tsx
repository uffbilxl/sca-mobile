import { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../lib/theme'
import type { SCAEvent } from '../lib/types'

const EVENTS: SCAEvent[] = [
  {
    id: 'social-night-june-2026',
    title: 'Social Night: Debate & Gaming',
    description: 'A collaborative social night with BCU Gaming Society and the Law Debating & Mooting Society. Speed debates on topics from Gaming and AI (12–3 PM), then a relaxed gaming session (3–8 PM).',
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

function PulseDot() {
  const opacity = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.15, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start()
  }, [])
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, opacity }} />
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.countUnit}>
      <View style={styles.countBox}>
        <Text style={styles.countNum}>{pad(value)}</Text>
      </View>
      <Text style={styles.countLabel}>{label}</Text>
    </View>
  )
}

export default function EventsScreen() {
  const insets = useSafeAreaInsets()
  const now = new Date()
  const upcoming = EVENTS.filter(e => e.date >= now).sort((a, b) => +a.date - +b.date)
  const past = EVENTS.filter(e => e.date < now).sort((a, b) => +b.date - +a.date)
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const list = tab === 'upcoming' ? upcoming : past
  const nextEvent = upcoming[0] ?? null
  const countdown = useCountdown(nextEvent?.date ?? null)

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>SCA</Text>
        <Text style={styles.pageTitle}>Events</Text>
        <Text style={styles.pageSubtitle}>Workshops, talks, networking and career events for BCU computing students.</Text>
      </View>

      {/* Countdown hero */}
      {nextEvent && !countdown.over && (
        <View style={styles.hero}>
          {/* glow */}
          <View pointerEvents="none" style={styles.heroGlowWrap}>
            <View style={styles.heroGlow} />
          </View>

          <View style={styles.heroLive}>
            <PulseDot />
            <Text style={styles.heroLiveText}>Next Event</Text>
          </View>
          <Text style={styles.heroTitle}>{nextEvent.title}</Text>
          <Text style={styles.heroMeta}>
            {formatDate(nextEvent.date)}
            {'\n'}
            {formatTime(nextEvent.date)}{nextEvent.endDate ? ` – ${formatTime(nextEvent.endDate)}` : ''}
            {'\n'}
            {nextEvent.isOnline ? '⊕' : '◎'} {nextEvent.location}
          </Text>
          <View style={styles.countRow}>
            <CountdownUnit value={countdown.days} label="Days" />
            <Text style={styles.countSep}>:</Text>
            <CountdownUnit value={countdown.hours} label="Hrs" />
            <Text style={styles.countSep}>:</Text>
            <CountdownUnit value={countdown.mins} label="Min" />
            <Text style={styles.countSep}>:</Text>
            <CountdownUnit value={countdown.secs} label="Sec" />
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
      <View style={styles.tabs}>
        {(['upcoming', 'past'] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'upcoming' ? `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` : 'Past'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event list */}
      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>◷</Text>
          <Text style={styles.emptyTitle}>{tab === 'upcoming' ? 'Events coming soon' : 'No past events yet'}</Text>
          <Text style={styles.emptyText}>
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
              <View key={event.id} style={[styles.eventCard, isPast && styles.eventCardPast]}>
                <View style={[styles.dateBadge, isPast && styles.dateBadgePast]}>
                  <Text style={[styles.dateMonth, isPast && styles.dateMuted]}>
                    {event.date.toLocaleString('en-GB', { month: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={[styles.dateDay, isPast && styles.dateDayPast]}>
                    {event.date.getDate()}
                  </Text>
                  <Text style={[styles.dateWeekday, isPast && styles.dateMuted]}>
                    {event.date.toLocaleString('en-GB', { weekday: 'short' }).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.description && <Text style={styles.eventDesc} numberOfLines={3}>{event.description}</Text>}
                  <Text style={styles.eventMeta}>
                    {event.isOnline ? '⊕' : '◎'} {event.location}  ◷ {formatTime(event.date)}{event.endDate ? ` – ${formatTime(event.endDate)}` : ''}
                  </Text>
                  {!isPast && !event.spots && !event.registrationUrl && (
                    <View style={styles.openSmall}>
                      <Text style={styles.openSmallText}>Open to all</Text>
                    </View>
                  )}
                </View>
              </View>
            )
          })}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg1 },
  content: { paddingHorizontal: 16, gap: 16 },

  pageHeader: { gap: 4, paddingBottom: 4 },
  eyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700', marginBottom: 2 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: colors.t1, letterSpacing: -0.7 },
  pageSubtitle: { fontSize: 13, color: colors.t3, lineHeight: 19 },

  hero: {
    backgroundColor: '#0d1422',
    borderWidth: 1,
    borderColor: `${colors.accent}28`,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    overflow: 'hidden',
  },
  heroGlowWrap: { position: 'absolute', top: -60, right: -60, width: 200, height: 200, overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999, backgroundColor: 'rgba(91,141,245,0.12)' },

  heroLive: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroLiveText: { fontSize: 10, color: colors.accent, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 20, fontWeight: '900', color: colors.t1, letterSpacing: -0.4, lineHeight: 26 },
  heroMeta: { fontSize: 12, color: colors.t3, lineHeight: 20 },
  countRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  countUnit: { alignItems: 'center', gap: 4 },
  countBox: {
    width: 54, height: 52, borderRadius: 10,
    backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  countNum: { fontSize: 22, fontWeight: '900', color: colors.t1 },
  countLabel: { fontSize: 8, fontWeight: '700', color: colors.t4, letterSpacing: 1, textTransform: 'uppercase' },
  countSep: { fontSize: 18, fontWeight: '900', color: colors.border2, marginBottom: 18 },

  openBadge: {
    borderWidth: 1, borderColor: colors.border2, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start',
  },
  openBadgeText: { fontSize: 12, color: colors.t3, fontWeight: '500' },
  registerBtn: {
    backgroundColor: colors.accent, paddingHorizontal: 18, paddingVertical: 10,
    borderRadius: 10, alignSelf: 'flex-start',
  },
  registerBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 10,
    padding: 4,
    alignSelf: 'flex-start',
    gap: 2,
  },
  tab: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 7 },
  tabActive: { backgroundColor: colors.accent },
  tabText: { fontSize: 12, color: colors.t3, fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  empty: {
    backgroundColor: colors.bg2, borderWidth: 1, borderColor: colors.border1,
    borderRadius: 16, padding: 32, alignItems: 'center', gap: 10,
  },
  emptyIcon: { fontSize: 28, marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.t1 },
  emptyText: { fontSize: 13, color: colors.t3, textAlign: 'center', lineHeight: 20 },

  eventList: { gap: 8 },
  eventCard: {
    flexDirection: 'row', backgroundColor: colors.bg2,
    borderWidth: 1, borderColor: colors.border1,
    borderRadius: 14, padding: 14, gap: 12,
  },
  eventCardPast: { opacity: 0.55 },
  dateBadge: {
    width: 54, height: 62, borderRadius: 10,
    backgroundColor: colors.accentBg, borderWidth: 1, borderColor: colors.accentBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  dateBadgePast: { backgroundColor: colors.bg3, borderColor: colors.border1 },
  dateMonth: { fontSize: 9, fontWeight: '700', letterSpacing: 0.8, color: `${colors.accent}80` },
  dateDay: { fontSize: 26, fontWeight: '900', color: colors.accent, lineHeight: 30 },
  dateDayPast: { color: colors.t3 },
  dateWeekday: { fontSize: 9, fontWeight: '600', letterSpacing: 0.6, color: `${colors.accent}60` },
  dateMuted: { color: colors.t4 },
  eventInfo: { flex: 1, gap: 4 },
  eventTitle: { fontSize: 15, fontWeight: '800', color: colors.t1, lineHeight: 20 },
  eventDesc: { fontSize: 12, color: colors.t3, lineHeight: 17 },
  eventMeta: { fontSize: 11, color: colors.t4 },
  openSmall: {
    alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border2,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 2,
  },
  openSmallText: { fontSize: 10, color: colors.t3, fontWeight: '500' },
})
