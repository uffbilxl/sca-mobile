import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { colors } from '../lib/theme'

const values = [
  { title: 'Inclusive by design', text: 'The SCA is open to every BCU computing student, regardless of year, background, or experience level.' },
  { title: 'Student-led, student-first', text: 'We are run entirely by students who have been in your position. Every decision we make is driven by what is genuinely useful to you.' },
  { title: 'Community over competition', text: 'We believe the tech industry is better when people support each other. We share opportunities openly and build a network that lasts beyond graduation.' },
]

const whatWeDo = [
  { label: 'Opportunities', desc: 'Internships, placements, graduate schemes, spring weeks, and insight programmes from across the UK tech industry.', tab: 'Opportunities' },
  { label: 'Events', desc: 'Industry panels, workshops, networking nights and hackathons throughout the year.', tab: 'Events' },
  { label: 'Career resources', desc: 'CV templates, cover letter guides, and practical career advice for computing students.', tab: 'Resources' },
  { label: 'A real community', desc: 'Join a network of like-minded students at BCU. Share experiences, find collaborators, and support each other.', tab: 'Committee' },
]

export default function AboutScreen() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation<any>()

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Birmingham City University</Text>
        <Text style={styles.pageTitle}>Who We Are</Text>
        <Text style={styles.pageSubtitle}>
          The Student Computing Association (SCA) is the computing society at Birmingham City University. We exist to support, connect, and empower every student in the computing faculty.
        </Text>
      </View>

      {/* Mission */}
      <View style={styles.missionBox}>
        <View style={styles.missionGlowWrap}>
          <View style={styles.missionGlow} />
        </View>
        <Text style={styles.missionEyebrow}>Our mission</Text>
        <Text style={styles.missionText}>
          To make the path from BCU student to tech professional as clear, supported, and accessible as possible — for everyone.
        </Text>
      </View>

      {/* What we do */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>What we do</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.grid}>
          {whatWeDo.map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.gridCard}
              onPress={() => navigation.navigate(item.tab)}
              activeOpacity={0.75}
            >
              <View style={styles.gridCardTop}>
                <Text style={styles.gridCardLabel}>{item.label}</Text>
                <Text style={styles.gridCardArrow}>→</Text>
              </View>
              <Text style={styles.gridCardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Values */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Our values</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.valueList}>
          {values.map((v, i) => (
            <View key={v.title} style={styles.valueCard}>
              <Text style={styles.valueNum}>0{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.valueTitle}>{v.title}</Text>
                <Text style={styles.valueText}>{v.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Position note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteEyebrow}>Our position</Text>
        <Text style={styles.noteText}>
          We aim to share as many opportunities as possible, but we are selective about what we promote. We will not list roles from defence companies. Every student deserves access to opportunity, and we take seriously our responsibility in shaping what that looks like.
        </Text>
      </View>

      {/* Get involved */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Get involved</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>Join the SCA</Text>
            <Text style={styles.gridCardDesc}>Open to all BCU computing students. Follow us on LinkedIn and stay up to date.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/bcu-student-computing-association/')} activeOpacity={0.7}>
              <Text style={styles.gridLink}>Follow on LinkedIn →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridCardLabel}>Join the committee</Text>
            <Text style={styles.gridCardDesc}>Want to help shape the SCA? We are always looking for students to contribute.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://tally.so/r/681g7e')} activeOpacity={0.7}>
              <Text style={styles.gridLink}>Apply here →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg1 },
  content: { padding: 16, paddingTop: 20, gap: 24 },

  pageHeader: { gap: 8 },
  eyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  pageTitle: { fontSize: 28, fontWeight: '900', color: colors.t1, letterSpacing: -0.7, lineHeight: 34 },
  pageSubtitle: { fontSize: 14, color: colors.t3, lineHeight: 22 },

  missionBox: {
    borderWidth: 1,
    borderColor: `${colors.accent}28`,
    backgroundColor: `${colors.accent}08`,
    borderLeftWidth: 2,
    borderLeftColor: colors.accent,
    borderRadius: 14,
    padding: 18,
    gap: 8,
    overflow: 'hidden',
  },
  missionGlowWrap: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, overflow: 'hidden' },
  missionGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 999, backgroundColor: 'rgba(91,141,245,0.12)' },
  missionEyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  missionText: { fontSize: 15, fontWeight: '600', color: colors.t1, lineHeight: 24 },

  sectionBlock: { gap: 12 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionLabel: { fontSize: 9, fontWeight: '700', color: colors.t4, letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.border1 },

  grid: { gap: 8 },
  gridCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  gridCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gridCardLabel: { fontSize: 13, fontWeight: '700', color: colors.t1 },
  gridCardArrow: { fontSize: 14, color: colors.t4 },
  gridCardDesc: { fontSize: 12, color: colors.t3, lineHeight: 18 },
  gridLink: { fontSize: 12, color: colors.accent, fontWeight: '600', marginTop: 4 },

  valueList: { gap: 8 },
  valueCard: {
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
  valueNum: { fontSize: 10, color: colors.accent, letterSpacing: 1, fontWeight: '700', paddingTop: 2, width: 22 },
  valueTitle: { fontSize: 13, fontWeight: '700', color: colors.t1, marginBottom: 4 },
  valueText: { fontSize: 12, color: colors.t3, lineHeight: 18 },

  noteBox: {
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.22)',
    backgroundColor: 'rgba(245,158,11,0.06)',
    borderLeftWidth: 2,
    borderLeftColor: '#f59e0b',
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  noteEyebrow: { fontSize: 9, color: '#fbbf24', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: '700' },
  noteText: { fontSize: 12, color: colors.t2, lineHeight: 19 },
})
