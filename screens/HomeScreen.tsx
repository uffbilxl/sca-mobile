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

const whyItems = [
  { title: 'Curated for you', text: 'Internships, placements, grad schemes and spring weeks — filtered for BCU computing students.' },
  { title: 'Events & community', text: 'Industry panels, workshops, hackathons and networking events throughout the year.' },
  { title: 'Career support', text: 'CV templates, cover letter guides, and peer insights from BCU students.' },
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
  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent, opacity }} />
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
      {/* Blue radial glow behind hero */}
      <View pointerEvents="none" style={styles.glowWrap}>
        <View style={styles.glow1} />
        <View style={styles.glow2} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.liveBadge}>
            <PulseDot />
            <Text style={styles.liveBadgeText}>Now live · Updated regularly</Text>
          </View>

          <Text style={styles.heroTitle}>Student Computing{'\n'}Association</Text>
          <Text style={styles.heroSub}>Your home for tech careers, events, and community at Birmingham City University.</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => navigation.navigate('Opportunities')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnPrimaryText}>Browse opportunities →</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate('Events')}
              activeOpacity={0.85}
            >
              <Text style={styles.btnSecondaryText}>Events</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statNum}>{totalOpen}</Text>
            <Text style={styles.statLabel}>open opportunities</Text>
            <View style={styles.statDivider} />
            <Text style={styles.statLabel}>BCU computing students</Text>
          </View>
        </View>

        {/* Scrolling ticker */}
        <TickerBanner />

        {/* Featured */}
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
            {featured.map(opp => (
              <FeaturedCard
                key={opp.id}
                opp={opp}
                onPress={() => navigation.navigate('Opportunities')}
              />
            ))}
          </ScrollView>
        </View>

        {/* Strands */}
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

        {/* Why */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View>
              <Text style={styles.eyebrow}>Why the SCA</Text>
              <Text style={styles.sectionTitle}>Built for BCU students</Text>
            </View>
          </View>
          <View style={styles.whyList}>
            {whyItems.map((item, i) => (
              <View key={item.title} style={styles.whyCard}>
                <Text style={styles.whyNum}>0{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.whyTitle}>{item.title}</Text>
                  <Text style={styles.whyText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <Text style={styles.footerText}>Student Computing Association · BCU</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/bcu-student-computing-association/')} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Follow us on LinkedIn →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: colors.bg1 },

  glowWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 420,
    overflow: 'hidden',
    zIndex: 0,
  },
  glow1: {
    position: 'absolute',
    top: -100, left: -80, right: -80,
    height: 400,
    borderRadius: 999,
    backgroundColor: 'rgba(91,141,245,0.10)',
  },
  glow2: {
    position: 'absolute',
    top: -60, left: -20, right: -20,
    height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(91,141,245,0.05)',
  },

  scroll: { flex: 1, zIndex: 1 },
  content: { paddingBottom: 48 },

  hero: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    gap: 0,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    alignSelf: 'flex-start',
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    marginBottom: 20,
  },
  liveBadgeText: { fontSize: 10, color: colors.accent, fontWeight: '700', letterSpacing: 0.7 },

  heroTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.t1,
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    color: colors.t3,
    lineHeight: 22,
    marginBottom: 24,
  },

  btnRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  btnPrimary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnPrimaryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnSecondary: {
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnSecondaryText: { color: colors.t2, fontSize: 13, fontWeight: '600' },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statNum: { fontSize: 13, fontWeight: '700', color: colors.t2 },
  statLabel: { fontSize: 11, color: colors.t4 },
  statDivider: { width: 1, height: 12, backgroundColor: colors.border2 },

  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 9,
    color: colors.accent,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.t1, letterSpacing: -0.3 },
  seeAll: { fontSize: 12, color: colors.t3 },

  featRow: { gap: 10, paddingRight: 4 },
  featCard: {
    width: 185,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderTopWidth: 2,
    borderRadius: 14,
    padding: 15,
    gap: 6,
  },
  featBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 2,
  },
  featBadgeText: { fontSize: 8, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  featTitle: { fontSize: 13, fontWeight: '700', color: colors.t1, lineHeight: 18 },
  featCompany: { fontSize: 11, color: colors.accent, fontWeight: '600' },
  featLocation: { fontSize: 11, color: colors.t4 },

  strandsGrid: { gap: 8 },
  strandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  strandLabel: { fontSize: 13, fontWeight: '700', color: colors.t1, marginBottom: 2 },
  strandDesc: { fontSize: 11, color: colors.t4 },
  strandArrow: { fontSize: 14, color: colors.t4 },

  whyList: { gap: 8 },
  whyCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    borderRadius: 12,
    padding: 14,
  },
  whyNum: { fontSize: 10, color: colors.accent, letterSpacing: 1, fontWeight: '700', paddingTop: 2, width: 22 },
  whyTitle: { fontSize: 13, fontWeight: '700', color: colors.t1, marginBottom: 4 },
  whyText: { fontSize: 12, color: colors.t3, lineHeight: 18 },

  footer: { paddingHorizontal: 20, paddingTop: 28, gap: 4, alignItems: 'center' },
  footerText: { fontSize: 11, color: colors.t4 },
  footerLink: { fontSize: 11, color: `${colors.accent}70` },
})
