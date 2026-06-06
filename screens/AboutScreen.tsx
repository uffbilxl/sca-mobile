import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { ArrowUpRight } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import { teal } from '../lib/theme'
import AppHeader from '../components/AppHeader'

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
  const { colors: c } = useTheme()

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AppHeader variant="brand" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={[styles.eyebrow, { color: c.blue }]}>Birmingham City University</Text>
          <Text style={[styles.pageTitle, { color: c.textPrimary }]}>Who We Are</Text>
          <Text style={[styles.pageSubtitle, { color: c.textSecondary }]}>
            The Student Computing Association (SCA) is the computing society at Birmingham City University. We exist to support, connect, and empower every student in the computing faculty.
          </Text>
        </View>

        {/* Mission (always dark) */}
        <View style={styles.missionBox}>
          <View style={styles.missionGlow} />
          <Text style={styles.missionEyebrow}>Our mission</Text>
          <Text style={styles.missionText}>
            To make the path from BCU student to tech professional as clear, supported, and accessible as possible — for everyone.
          </Text>
        </View>

        {/* What we do */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: c.textMuted }]}>What we do</Text>
            <View style={[styles.sectionLine, { backgroundColor: c.border }]} />
          </View>
          <View style={styles.grid}>
            {whatWeDo.map(item => (
              <TouchableOpacity
                key={item.label}
                style={[styles.gridCard, { backgroundColor: c.bgCard, borderColor: c.border }]}
                onPress={() => navigation.navigate(item.tab)}
                activeOpacity={0.75}
              >
                <Text style={[styles.gridLabel, { color: c.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.gridDesc, { color: c.textSecondary }]}>{item.desc}</Text>
                <ArrowUpRight size={14} color={c.blue} strokeWidth={2} style={{ marginTop: 4 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Values */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Our values</Text>
            <View style={[styles.sectionLine, { backgroundColor: c.border }]} />
          </View>
          <View style={styles.valuesList}>
            {values.map((v, i) => (
              <View key={v.title} style={[styles.valueCard, { backgroundColor: c.bgCard, borderColor: c.border, borderLeftColor: c.blue }]}>
                <Text style={[styles.valueNum, { color: c.blue }]}>0{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.valueTitle, { color: c.textPrimary }]}>{v.title}</Text>
                  <Text style={[styles.valueText, { color: c.textSecondary }]}>{v.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Join */}
        <View style={[styles.joinCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <Text style={[styles.joinTitle, { color: c.textPrimary }]}>Want to get involved?</Text>
          <Text style={[styles.joinText, { color: c.textSecondary }]}>
            Follow us on LinkedIn for the latest events, opportunities, and updates. Everyone is welcome.
          </Text>
          <TouchableOpacity
            style={[styles.joinBtn, { backgroundColor: c.blue }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/company/bcu-student-computing-association/')}
            activeOpacity={0.85}
          >
            <Text style={styles.joinBtnText}>Follow on LinkedIn →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 24 },

  pageHeader: { gap: 6 },
  eyebrow: { fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  pageTitle: { fontSize: 26, fontFamily: 'Geist-Bold', letterSpacing: -0.6 },
  pageSubtitle: { fontSize: 13, fontFamily: 'Geist-Regular', lineHeight: 20 },

  /* Mission (always dark) */
  missionBox: {
    backgroundColor: '#0d1422', borderRadius: 16,
    padding: 20, overflow: 'hidden', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  missionGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(63,182,139,0.12)',
  },
  missionEyebrow: { fontSize: 9, color: teal, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  missionText: { fontSize: 16, fontFamily: 'Geist-SemiBold', color: '#f0f4ff', lineHeight: 24, letterSpacing: -0.2 },

  sectionBlock: { gap: 14 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCard: {
    width: '47.5%', borderWidth: 1, borderRadius: 14, padding: 14, gap: 4,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  gridLabel: { fontSize: 13, fontFamily: 'Geist-SemiBold' },
  gridDesc: { fontSize: 11, fontFamily: 'Geist-Regular', lineHeight: 16 },

  valuesList: { gap: 8 },
  valueCard: {
    flexDirection: 'row', gap: 14, borderWidth: 1, borderLeftWidth: 2,
    borderRadius: 14, padding: 14,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  valueNum: { fontSize: 10, letterSpacing: 1, fontFamily: 'Geist-Medium', paddingTop: 2, width: 22 },
  valueTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold', marginBottom: 4 },
  valueText: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },

  joinCard: {
    borderWidth: 1, borderRadius: 16, padding: 20, gap: 10,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  joinTitle: { fontSize: 16, fontFamily: 'Geist-SemiBold' },
  joinText: { fontSize: 13, fontFamily: 'Geist-Regular', lineHeight: 20 },
  joinBtn: { alignSelf: 'flex-start', paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10 },
  joinBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Geist-SemiBold' },
})
