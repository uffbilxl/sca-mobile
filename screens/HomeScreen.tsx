import { useRef, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { colors, typeColors, typeLabels } from '../lib/theme'
import { OPPORTUNITIES } from '../lib/data'
import TickerBanner from '../components/TickerBanner'

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
        Animated.timing(opacity, { toValue: 0.15, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start()
  }, [])
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal, opacity }} />
}

function FeaturedCard({ opp, onPress }: { opp: typeof OPPORTUNITIES[0]; onPress: () => void }) {
  const tColor = typeColors[opp.type] ?? colors.accent
  return (
    <TouchableOpacity
      style={[styles.featCard, { borderTopColor: `${tColor}60` }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.featBadge, { backgroundColor: `${tColor}15`, borderColor: `${tColor}30` }]}>
        <Text style={[styles.featBadgeText, { color: tColor }]}>{typeLabels[opp.type]}</Text>
      </View>
      <Text style={styles.featTitle} numberOfLines={2}>{opp.title}</Text>
      <Text style={styles.featCompany} numberOfLines={1}>{opp.company.name}</Text>
      <Text style={styles.featLocation} numberOfLines={1}>{opp.location}</Text>
    </TouchableOpacity>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const openOpps = OPPORTUNITIES.filter(o => o.status !== 'CLOSED')
  const totalOpen = openOpps.length

  const types = ['INTERNSHIP', 'PLACEMENT', 'GRADUATE', 'SPRING_WEEK'] as const
  const perType = types.map(t => openOpps.filter(o => o.featured && o.type === t).slice(0, 2))
  const featured = [...perType.map(a => a[0]), ...perType.map(a => a[1])].filter(Boolean).slice(0, 6)

  return (
    <View style={styles.outer}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ─────────────────────────────────────── */}
        <View style={styles.hero}>
          {/* Ambient glows matching bcusca.org */}
          <View pointerEvents="none" style={[styles.heroGlow, styles.heroGlowTeal]} />
          <View pointerEvents="none" style={[styles.heroGlow, styles.heroGlowPurple]} />

          {/* BCU pill */}
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
            We are a student-run association, not an official BCU service. Opportunities are curated by students, for students.
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

        {/* ── Ticker ───────────────────────────────────── */}
        <TickerBanner />

        {/* ── Featured ─────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.eyebrow}>Handpicked</Text>
              <Text style={styles.sectionTitle}>Featured opportunities</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Opportunities')} activeOpacity={0.7}>
              <Text style={styles.seeAll}>View all →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featRow}>
            {featured.map((opp, i) => (
              <FeaturedCard
                key={opp.id + String(i)}
                opp={opp}
                onPress={() => navigation.navigate('Opportunities')}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── Where to start ───────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.eyebrow}>Everything we offer</Text>
              <Text style={styles.sectionTitle}>Where do you want to start?</Text>
            </View>
          </View>
          <View style={styles.strandsGrid}>
            {STRANDS.map(s => (
              <TouchableOpacity
                key={s.label}
                style={styles.strandCard}
                onPress={() => s.nested
                  ? navigation.navigate('More', { screen: s.to })
                  : navigation.navigate(s.to)
                }
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.strandLabel}>{s.label}</Text>
                  <Text style={styles.strandDesc}>{s.desc}</Text>
                </View>
                <Text style={styles.strandArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── What the SCA offers ──────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.eyebrow}>Why the SCA</Text>
              <Text style={styles.sectionTitle}>What the SCA offers</Text>
            </View>
          </View>
          <View style={styles.offerList}>
            {WHAT_WE_OFFER.map(item => (
              <View key={item.num} style={styles.offerCard}>
                <Text style={styles.offerNum}>{item.num}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.offerTitle}>{item.title}</Text>
                  <Text style={styles.offerText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── You belong here CTA ──────────────────────── */}
        <View style={styles.ctaSection}>
          <View pointerEvents="none" style={[styles.ctaGlow, styles.ctaGlowTeal]} />
          <View pointerEvents="none" style={[styles.ctaGlow, styles.ctaGlowPurple]} />
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
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.footerText}>© 2026 SCA BCU</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.keystonedigitalstrategy.co.uk/')} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Built with Keystone →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: '#0f1218' },
  scroll: { flex: 1 },
  content: { paddingBottom: 48 },

  /* Hero */
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    gap: 12,
    overflow: 'hidden',
    backgroundColor: '#0f1218',
  },
  heroGlow: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  heroGlowTeal: {
    bottom: -220,
    left: -150,
    backgroundColor: 'rgba(13,110,89,0.35)',
  },
  heroGlowPurple: {
    bottom: -220,
    right: -150,
    backgroundColor: 'rgba(88,28,135,0.40)',
  },

  bcuPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  bcuPillText: { fontSize: 9, color: colors.t3, fontFamily: 'Geist-Regular', letterSpacing: 0.6 },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(63,182,139,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(63,182,139,0.22)',
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  liveBadgeText: { fontSize: 10, color: colors.teal, fontFamily: 'Geist-Medium', letterSpacing: 0.4 },

  heroTitle: {
    fontSize: 32,
    fontFamily: 'Geist-Bold',
    color: colors.t1,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  heroSub: { fontSize: 14, fontFamily: 'Geist-Regular', color: colors.t3, lineHeight: 22 },
  heroDisclaimer: { fontSize: 11, fontFamily: 'Geist-Regular', color: colors.t4, lineHeight: 17 },

  btnRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btnPrimary: { backgroundColor: '#4f8ef7', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  btnPrimaryText: { color: '#fff', fontSize: 13, fontFamily: 'Geist-SemiBold' },
  btnSecondary: { borderWidth: 1, borderColor: colors.border1, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  btnSecondaryText: { color: colors.t2, fontSize: 13, fontFamily: 'Geist-Medium' },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statNum: { fontSize: 13, fontFamily: 'Geist-Bold', color: colors.t2 },
  statLabel: { fontSize: 11, fontFamily: 'Geist-Regular', color: colors.t4 },
  statDivider: { width: 1, height: 12, backgroundColor: colors.border2 },

  /* Shared section wrapper */
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    backgroundColor: colors.bg1,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eyebrow: { fontSize: 9, color: colors.t4, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Geist-Medium', marginBottom: 4 },
  sectionTitle: { fontSize: 17, fontFamily: 'Geist-Bold', color: colors.t1, letterSpacing: -0.3 },
  seeAll: { fontSize: 12, color: colors.t3, fontFamily: 'Geist-Regular' },

  /* Featured cards */
  featRow: { gap: 10, paddingRight: 4 },
  featCard: {
    width: 185,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderTopWidth: 2,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  featBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, borderWidth: 1, marginBottom: 2 },
  featBadgeText: { fontSize: 8, fontFamily: 'Geist-Medium', letterSpacing: 0.6, textTransform: 'uppercase' },
  featTitle: { fontSize: 13, fontFamily: 'Geist-Medium', color: colors.t2, lineHeight: 18 },
  featCompany: { fontSize: 11, color: colors.t3, fontFamily: 'Geist-Regular' },
  featLocation: { fontSize: 11, color: colors.t4, fontFamily: 'Geist-Regular' },

  /* Strands grid */
  strandsGrid: { gap: 8 },
  strandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  strandLabel: { fontSize: 13, fontFamily: 'Geist-SemiBold', color: colors.t1, marginBottom: 2 },
  strandDesc: { fontSize: 11, fontFamily: 'Geist-Regular', color: colors.t4 },
  strandArrow: { fontSize: 14, color: colors.t4 },

  /* 01/02/03 offer list */
  offerList: { gap: 8 },
  offerCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderLeftWidth: 2,
    borderLeftColor: '#58a6ff',
    borderRadius: 10,
    padding: 14,
  },
  offerNum: { fontSize: 10, color: '#58a6ff', letterSpacing: 1, fontFamily: 'Geist-Medium', paddingTop: 2, width: 22 },
  offerTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold', color: colors.t1, marginBottom: 4 },
  offerText: { fontSize: 12, fontFamily: 'Geist-Regular', color: colors.t3, lineHeight: 18 },

  /* CTA section */
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#0f1218',
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    overflow: 'hidden',
    gap: 12,
  },
  ctaGlow: { position: 'absolute', width: 400, height: 400, borderRadius: 200 },
  ctaGlowTeal: { bottom: -200, left: -100, backgroundColor: 'rgba(13,110,89,0.25)' },
  ctaGlowPurple: { bottom: -200, right: -100, backgroundColor: 'rgba(88,28,135,0.30)' },
  ctaEyebrow: { fontSize: 9, color: colors.teal, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Geist-Medium' },
  ctaTitle: { fontSize: 28, fontFamily: 'Geist-Bold', color: colors.t1, letterSpacing: -0.5 },
  ctaText: { fontSize: 13, fontFamily: 'Geist-Regular', color: colors.t3, lineHeight: 21, maxWidth: 320 },
  ctaBtn: { alignSelf: 'flex-start', backgroundColor: '#4f8ef7', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, marginTop: 4 },
  ctaBtnText: { color: '#fff', fontSize: 14, fontFamily: 'Geist-SemiBold' },

  /* Footer */
  footer: { paddingHorizontal: 20, paddingTop: 24, gap: 6, alignItems: 'center', backgroundColor: colors.bg1 },
  footerText: { fontSize: 11, color: colors.t4, fontFamily: 'Geist-Regular' },
  footerLink: { fontSize: 11, color: `${colors.accent}70`, fontFamily: 'Geist-Regular' },
})
