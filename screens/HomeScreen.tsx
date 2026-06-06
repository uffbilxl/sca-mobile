import { useRef, useEffect, useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Animated, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { typeColors, typeLabels, teal } from '../lib/theme'
import { useTheme } from '../lib/ThemeContext'
import { fetchOpportunities } from '../lib/api'
import type { Opportunity } from '../lib/types'
import TickerBanner from '../components/TickerBanner'
import AppHeader from '../components/AppHeader'
import AnimatedBackground from '../components/AnimatedBackground'

const nd = Platform.OS !== 'web'

const STRANDS = [
  { label: 'Opportunities', desc: 'Internships, placements & graduate roles', to: 'Opportunities' as const, nested: false },
  { label: 'Events', desc: 'Workshops, panels & networking nights', to: 'Events' as const, nested: false },
  { label: 'Resources', desc: 'CV templates, cover letters & guides', to: 'Resources' as const, nested: true },
  { label: 'Committee', desc: 'The people behind the SCA', to: 'Committee' as const, nested: true },
  { label: 'SCA Roles', desc: 'Internal SCA opportunities', to: 'SCA' as const, nested: false },
  { label: 'About', desc: 'Who we are and what we do', to: 'About' as const, nested: true },
]

const WHAT_WE_OFFER = [
  { num: '01', title: 'Curated opportunities', text: 'Internships, placements, grad schemes and spring weeks — filtered for BCU computing students.' },
  { num: '02', title: 'Events & community', text: 'Industry panels, workshops, hackathons and networking events throughout the year.' },
  { num: '03', title: 'Career support', text: 'CV templates, cover letter guides, and peer insights from BCU students.' },
]

function PulseDot() {
  const opacity = useRef(new Animated.Value(1)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.15, duration: 700, useNativeDriver: nd }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: nd }),
      ])
    ).start()
  }, [])
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: teal, opacity }} />
}

function FeaturedCard({ opp, onPress, c }: { opp: Opportunity; onPress: () => void; c: any }) {
  const tInfo = typeColors[opp.type]
  const badgeBg  = tInfo ? c[tInfo.bg]   : c.blueLight
  const badgeText = tInfo ? c[tInfo.text] : c.blueText
  return (
    <TouchableOpacity
      style={[styles.featCard, { backgroundColor: c.bgCard, borderColor: c.border, shadowColor: c.isDark ? '#000' : '#0b1120' }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.featBadge, { backgroundColor: badgeBg }]}>
        <Text style={[styles.featBadgeText, { color: badgeText }]}>{typeLabels[opp.type]}</Text>
      </View>
      <Text style={[styles.featTitle, { color: c.textPrimary }]} numberOfLines={2}>{opp.title}</Text>
      <Text style={[styles.featCompany, { color: c.blue }]} numberOfLines={1}>{opp.company.name}</Text>
      <Text style={[styles.featLocation, { color: c.textMuted }]} numberOfLines={1}>{opp.location}</Text>
    </TouchableOpacity>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [opps, setOpps] = useState<Opportunity[]>([])

  useFocusEffect(useCallback(() => {
    let active = true
    fetchOpportunities().then(({ data }) => {
      if (active) setOpps(data)
    })
    return () => { active = false }
  }, []))

  const openOpps = opps.filter(o => o.status !== 'CLOSED')
  const totalOpen = openOpps.length
  const types = ['INTERNSHIP', 'PLACEMENT', 'GRADUATE', 'SPRING_WEEK'] as const
  const perType = types.map(t => openOpps.filter(o => o.featured && o.type === t).slice(0, 2))
  const featured = [...perType.map(a => a[0]), ...perType.map(a => a[1])].filter(Boolean).slice(0, 6)

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AnimatedBackground />
      <AppHeader variant="brand" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card (always dark) ───────────────────── */}
        <View style={styles.heroWrap}>
          <View style={styles.hero}>
            <View style={[{ pointerEvents: 'none' } as any, styles.heroGlow, styles.heroGlowTeal]} />
            <View style={[{ pointerEvents: 'none' } as any, styles.heroGlow, styles.heroGlowPurple]} />

            <View style={styles.bcuPill}>
              <View style={styles.greenDot} />
              <Text style={styles.bcuPillText}>BCU STUDENT COMPUTING ASSOCIATION</Text>
            </View>

            <View style={styles.liveBadge}>
              <PulseDot />
              <Text style={styles.liveBadgeText}>Now live · Updated regularly</Text>
            </View>

            <Text style={styles.heroTitle}>Your BCU Computing{'\n'}Community & Career Hub</Text>
            <Text style={styles.heroSub}>
              The SCA connects BCU computing students with internships, placements, events, and career resources. Open to all. Free forever.
            </Text>
            <Text style={styles.heroDisclaimer}>
              Student-run, not an official BCU service. Opportunities curated by students, for students.
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => navigation.navigate('Opportunities')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Explore Opportunities →</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => navigation.navigate('Events')}
                activeOpacity={0.85}
              >
                <Text style={styles.btnSecondaryText}>Upcoming Events</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <Text style={styles.statNum}>{totalOpen}</Text>
              <Text style={styles.statLabel}>open opportunities</Text>
              <View style={styles.statDivider} />
              <Text style={styles.statLabel}>BCU computing students</Text>
            </View>
          </View>
        </View>

        {/* ── Ticker ───────────────────────────────────── */}
        <TickerBanner />

        {/* ── Featured ─────────────────────────────────── */}
        <View style={[styles.section, { backgroundColor: c.bgPage }]}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={[styles.eyebrow, { color: c.textMuted }]}>Handpicked</Text>
              <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Featured opportunities</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Opportunities')} activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: c.blue }]}>View all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featRow}>
            {featured.map((opp, i) => (
              <FeaturedCard
                key={opp.id + String(i)}
                opp={opp}
                c={c}
                onPress={() => navigation.navigate('Opportunities')}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Where to start ───────────────────────────── */}
        <View style={[styles.section, { backgroundColor: c.bgPage }]}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={[styles.eyebrow, { color: c.textMuted }]}>Everything we offer</Text>
              <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>Where do you want to start?</Text>
            </View>
          </View>
          <View style={styles.strandsGrid}>
            {STRANDS.map(s => (
              <TouchableOpacity
                key={s.label}
                style={[styles.strandCard, { backgroundColor: c.bgCard, borderColor: c.border }]}
                onPress={() => s.nested
                  ? navigation.navigate('More', { screen: s.to })
                  : navigation.navigate(s.to)
                }
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.strandLabel, { color: c.textPrimary }]}>{s.label}</Text>
                  <Text style={[styles.strandDesc, { color: c.textMuted }]}>{s.desc}</Text>
                </View>
                <Text style={[styles.strandArrow, { color: c.textMuted }]}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── What the SCA offers ──────────────────────── */}
        <View style={[styles.section, { backgroundColor: c.bgPage }]}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={[styles.eyebrow, { color: c.textMuted }]}>Why the SCA</Text>
              <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>What the SCA offers</Text>
            </View>
          </View>
          <View style={styles.offerList}>
            {WHAT_WE_OFFER.map(item => (
              <View key={item.num} style={[styles.offerCard, { backgroundColor: c.bgCard, borderColor: c.border, borderLeftColor: c.blue }]}>
                <Text style={[styles.offerNum, { color: c.blue }]}>{item.num}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.offerTitle, { color: c.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.offerText, { color: c.textSecondary }]}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── You belong here CTA (always dark) ────────── */}
        <View style={styles.ctaSection}>
          <View style={[{ pointerEvents: 'none' } as any, styles.ctaGlow, styles.ctaGlowTeal]} />
          <View style={[{ pointerEvents: 'none' } as any, styles.ctaGlow, styles.ctaGlowPurple]} />
          <Text style={styles.ctaEyebrow}>Open to everyone</Text>
          <Text style={styles.ctaTitle}>You belong here</Text>
          <Text style={styles.ctaText}>
            The SCA is for every BCU computing student. No experience needed. No application required. Just show up.
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => Linking.openURL('https://www.linkedin.com/company/bcu-student-computing-association/')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>Join the SCA →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ───────────────────────────────────── */}
        <View style={[styles.footer, { borderTopColor: c.border }]}>
          <Text style={[styles.footerText, { color: c.textMuted }]}>© 2026 SCA BCU</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.keystonedigitalstrategy.co.uk/')} activeOpacity={0.7}>
            <Text style={[styles.footerLink, { color: c.blue }]}>Built with Keystone →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },

  /* Hero (always dark — does not participate in theme) */
  heroWrap: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 },
  hero: {
    backgroundColor: '#0d1420',
    borderRadius: 18,
    padding: 20,
    gap: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  heroGlow: { position: 'absolute', width: 500, height: 500, borderRadius: 250 },
  heroGlowTeal:   { bottom: -220, left: -150, backgroundColor: 'rgba(13,110,89,0.07)' },
  heroGlowPurple: { bottom: -220, right: -150, backgroundColor: 'rgba(88,28,135,0.09)' },

  bcuPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: '#21262d', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 5, marginTop: 4,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: teal },
  bcuPillText: { fontSize: 9, color: '#8b949e', fontFamily: 'Geist-Regular', letterSpacing: 0.6 },

  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
    backgroundColor: 'rgba(63,182,139,0.10)', borderWidth: 1,
    borderColor: 'rgba(63,182,139,0.22)', borderRadius: 999,
    paddingHorizontal: 11, paddingVertical: 5,
  },
  liveBadgeText: { fontSize: 10, color: teal, fontFamily: 'Geist-Medium', letterSpacing: 0.4 },

  heroTitle: { fontSize: 28, fontFamily: 'Geist-Bold', color: '#f0f4ff', letterSpacing: -0.7, lineHeight: 36 },
  heroSub: { fontSize: 13, fontFamily: 'Geist-Regular', color: '#8da0bc', lineHeight: 21 },
  heroDisclaimer: { fontSize: 11, fontFamily: 'Geist-Regular', color: '#4a6080', lineHeight: 17 },

  btnRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btnPrimary: { backgroundColor: '#4a82f0', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  btnPrimaryText: { color: '#fff', fontSize: 13, fontFamily: 'Geist-SemiBold' },
  btnSecondary: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  btnSecondaryText: { color: '#c9d1d9', fontSize: 13, fontFamily: 'Geist-Medium' },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statNum: { fontSize: 13, fontFamily: 'Geist-Bold', color: '#e6edf3' },
  statLabel: { fontSize: 11, fontFamily: 'Geist-Regular', color: '#4a6080' },
  statDivider: { width: 1, height: 12, backgroundColor: '#1e2d45' },

  /* Sections */
  section: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 },
  sectionHead: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'space-between', marginBottom: 14,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Geist-Medium', marginBottom: 4 },
  sectionTitle: { fontSize: 17, fontFamily: 'Geist-Bold', letterSpacing: -0.3 },
  seeAll: { fontSize: 12, fontFamily: 'Geist-Medium' },

  /* Featured cards */
  featRow: { gap: 10, paddingRight: 4 },
  featCard: {
    width: 180,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featBadge: { alignSelf: 'flex-start', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5, marginBottom: 2 },
  featBadgeText: { fontSize: 10, fontFamily: 'Geist-Medium', fontWeight: '600' },
  featTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold', lineHeight: 18 },
  featCompany: { fontSize: 11, fontFamily: 'Geist-Medium' },
  featLocation: { fontSize: 11, fontFamily: 'Geist-Regular' },

  /* Strands grid */
  strandsGrid: { gap: 8 },
  strandCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, gap: 10,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  strandLabel: { fontSize: 13, fontFamily: 'Geist-SemiBold', marginBottom: 2 },
  strandDesc: { fontSize: 11, fontFamily: 'Geist-Regular' },
  strandArrow: { fontSize: 14 },

  /* Offer list */
  offerList: { gap: 8 },
  offerCard: {
    flexDirection: 'row', gap: 14,
    borderWidth: 1, borderLeftWidth: 2,
    borderRadius: 14, padding: 14,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  offerNum: { fontSize: 10, letterSpacing: 1, fontFamily: 'Geist-Medium', paddingTop: 2, width: 22 },
  offerTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold', marginBottom: 4 },
  offerText: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },

  /* CTA section (always dark) */
  ctaSection: {
    marginHorizontal: 12, marginTop: 16, marginBottom: 8,
    backgroundColor: '#0d1420',
    borderRadius: 18, padding: 24,
    overflow: 'hidden', gap: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  ctaGlow: { position: 'absolute', width: 400, height: 400, borderRadius: 200 },
  ctaGlowTeal:   { bottom: -200, left: -100, backgroundColor: 'rgba(13,110,89,0.07)' },
  ctaGlowPurple: { bottom: -200, right: -100, backgroundColor: 'rgba(88,28,135,0.09)' },
  ctaEyebrow: { fontSize: 9, color: teal, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Geist-Medium' },
  ctaTitle: { fontSize: 26, fontFamily: 'Geist-Bold', color: '#f0f4ff', letterSpacing: -0.5 },
  ctaText: { fontSize: 13, fontFamily: 'Geist-Regular', color: '#8da0bc', lineHeight: 21 },
  ctaBtn: { alignSelf: 'flex-start', backgroundColor: '#4a82f0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 4 },
  ctaBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Geist-SemiBold' },

  /* Footer */
  footer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8, gap: 4, alignItems: 'center', borderTopWidth: 1 },
  footerText: { fontSize: 11, fontFamily: 'Geist-Regular' },
  footerLink: { fontSize: 11, fontFamily: 'Geist-Regular' },
})
