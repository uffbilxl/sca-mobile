import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Linkedin, ExternalLink } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import AppHeader from '../components/AppHeader'

interface Member { name: string; role: string; linkedin?: string; website?: string }
interface Division { name: string; color: string; members: Member[] }

const LEADERSHIP: Member[] = [
  { name: 'Tayyeb Nadeem Somro', role: 'President', linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/', website: 'http://tayyebns.com' },
]

const DIVISIONS: Division[] = [
  { name: 'Cyber Security', color: '#ef4444', members: [
    { name: 'Bilal Arshad', role: 'VP Cyber Security', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
    { name: 'Prem Lodhia', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/prem-lodhia-29a888382/', website: 'https://premlodhia.com' },
    { name: 'Daeron Wallace', role: 'Cyber Security Project Supervisor', linkedin: 'https://www.linkedin.com/in/daeron-wallace/' },
  ]},
  { name: 'Software Engineering', color: '#22c55e', members: [
    { name: 'Yasamin Zaid', role: 'VP Software Engineering', linkedin: 'https://www.linkedin.com/in/yasaminzaid/', website: 'https://yasaminzaid.com' },
    { name: 'Asim Raza', role: 'Software Engineering Project Supervisor', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
    { name: 'Hamzah Abdur Rahman', role: 'Software Engineering Project Supervisor', linkedin: 'https://www.linkedin.com/in/hamzah-abdur-rahman-5553ab2b8/' },
    { name: 'Baber Khan', role: 'Technical Assistant', linkedin: 'https://www.linkedin.com/in/baberr/', website: 'https://baberr.com' },
  ]},
  { name: 'Artificial Intelligence', color: '#a855f7', members: [
    { name: 'Orlando Igwe', role: 'VP Artificial Intelligence', linkedin: 'https://www.linkedin.com/in/orlando-igwe/' },
    { name: 'Mohamed Dahir', role: 'Analytics Lead', linkedin: 'https://www.linkedin.com/in/m-a-dahir/' },
    { name: 'Ali Bhuiyan', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/shakayat-ali-bhuiyan-b93179309/' },
    { name: 'Zakaria Miah', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/zakaria-miah/' },
    { name: 'Al Tahsin Rafi', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/al-tahsin-rafi-18b75631b/' },
  ]},
  { name: 'Computer Science', color: '#f59e0b', members: [
    { name: 'Alaa Aljasem', role: 'VP Computer Science', linkedin: 'https://www.linkedin.com/in/alaa-aljasem-b816b83aa/' },
    { name: 'Jasleen Kaur', role: 'Events Assistant', linkedin: 'https://www.linkedin.com/in/jasleen-kaur-269367387/' },
    { name: 'Ayaan Ahmed', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/ayaan-ahmed-477289330/' },
  ]},
  { name: 'Digital Transformation', color: '#06b6d4', members: [
    { name: 'Hodane Gouled', role: 'VP Digital Transformation', linkedin: 'https://www.linkedin.com/in/hodane-gouled-b32534230/' },
    { name: 'Joe Paddock', role: 'Strategic Advisor', linkedin: 'https://www.linkedin.com/in/joepaddock-uk/' },
  ]},
  { name: 'Research & Development', color: '#f97316', members: [
    { name: 'Michael Martinak', role: 'Head of R&D', linkedin: 'https://www.linkedin.com/in/profile-mmartinak/' },
    { name: 'George James', role: 'Researcher', linkedin: 'https://www.linkedin.com/in/georgeojames/' },
    { name: 'Baber Khan', role: 'Researcher', linkedin: 'https://www.linkedin.com/in/baberr/', website: 'https://baberr.com' },
  ]},
  { name: 'Web Platform', color: '#ec4899', members: [
    { name: 'Muhammad Asim Raza', role: 'Web Platform Engineer', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
    { name: 'Bilal Arshad', role: 'Website Administrator', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
    { name: 'Laiba Raja', role: 'Website Administrator', linkedin: 'https://www.linkedin.com/in/laibaraja/' },
  ]},
  { name: 'Engagement & Marketing', color: '#2dd4bf', members: [
    { name: 'Maryam Ahmad', role: 'Head of Engagement', linkedin: 'https://www.linkedin.com/in/maryam-a-259297235' },
    { name: 'Samyaan Khan', role: 'Graphic Designer', linkedin: 'https://www.linkedin.com/in/samyaan-khan-036977250/' },
    { name: 'Mohammad Hamza', role: 'Social Media Manager', linkedin: 'https://www.linkedin.com/in/mohammad-hamza-97729322b/' },
    { name: 'Abrar Alam', role: 'Content Creator / Photographer', linkedin: 'https://www.linkedin.com/in/abrartalam/' },
  ]},
]

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

function MemberCard({ member, color, c }: { member: Member; color: string; c: any }) {
  return (
    <View style={[styles.memberCard, { backgroundColor: c.bgInput, borderColor: c.border }]}>
      <View style={[styles.avatar, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
        <Text style={[styles.avatarText, { color }]}>{initials(member.name)}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: c.textPrimary }]}>{member.name}</Text>
        <Text style={[styles.memberRole, { color: c.textMuted }]}>{member.role}</Text>
      </View>
      <View style={styles.memberLinks}>
        {member.linkedin && (
          <TouchableOpacity
            style={[styles.linkBtn, { backgroundColor: 'rgba(0,119,181,0.1)', borderColor: 'rgba(0,119,181,0.2)' }]}
            onPress={() => Linking.openURL(member.linkedin!)}
            accessibilityLabel="LinkedIn"
          >
            <Linkedin size={13} color="#0077b5" strokeWidth={1.75} />
          </TouchableOpacity>
        )}
        {member.website && (
          <TouchableOpacity
            style={[styles.linkBtn, { backgroundColor: c.bgInput, borderColor: c.border }]}
            onPress={() => Linking.openURL(member.website!)}
            accessibilityLabel="Website"
          >
            <ExternalLink size={13} color={c.textSecondary} strokeWidth={1.75} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default function CommitteeScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [selected, setSelected] = useState<string | null>(null)
  const activeDivision = DIVISIONS.find(d => d.name === selected) ?? null

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AppHeader variant="brand" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <Text style={[styles.eyebrow, { color: c.blue }]}>Student Computing Association</Text>
          <Text style={[styles.pageTitle, { color: c.textPrimary }]}>Meet the Committee</Text>
          <Text style={[styles.pageSubtitle, { color: c.textSecondary }]}>The people behind the SCA, organising events, driving projects, and building the BCU computing community.</Text>
        </View>

        {/* Leadership */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Leadership</Text>
            <View style={[styles.sectionLine, { backgroundColor: c.border }]} />
          </View>

          <View style={[styles.presidentCard, { backgroundColor: c.bgCard, borderColor: `${c.blue}20` }]}>
            <View style={[styles.avatar, styles.avatarLg, { backgroundColor: c.blueLight, borderColor: `${c.blue}25` }]}>
              <Text style={[styles.avatarText, { color: c.blue, fontSize: 16 }]}>TNS</Text>
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.presidentRow}>
                <Text style={[styles.memberName, { color: c.textPrimary }]}>{LEADERSHIP[0].name}</Text>
                <View style={[styles.presidentBadge, { backgroundColor: c.blueLight, borderColor: `${c.blue}30` }]}>
                  <Text style={[styles.presidentBadgeText, { color: c.blue }]}>President</Text>
                </View>
              </View>
            </View>
            <View style={styles.memberLinks}>
              {LEADERSHIP[0].linkedin && (
                <TouchableOpacity
                  style={[styles.linkBtn, { backgroundColor: 'rgba(0,119,181,0.1)', borderColor: 'rgba(0,119,181,0.2)' }]}
                  onPress={() => Linking.openURL(LEADERSHIP[0].linkedin!)}
                >
                  <Linkedin size={13} color="#0077b5" strokeWidth={1.75} />
                </TouchableOpacity>
              )}
              {LEADERSHIP[0].website && (
                <TouchableOpacity
                  style={[styles.linkBtn, { backgroundColor: c.bgInput, borderColor: c.border }]}
                  onPress={() => Linking.openURL(LEADERSHIP[0].website!)}
                >
                  <ExternalLink size={13} color={c.textSecondary} strokeWidth={1.75} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Divisions */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionLabelRow}>
            <Text style={[styles.sectionLabel, { color: c.textMuted }]}>Divisions</Text>
            <View style={[styles.sectionLine, { backgroundColor: c.border }]} />
            {selected && (
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Text style={[styles.closeBtn, { color: c.textMuted }]}>✕ close</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divisionGrid}>
            {DIVISIONS.map(div => {
              const isActive = selected === div.name
              const vp = div.members[0]
              return (
                <TouchableOpacity
                  key={div.name}
                  style={[
                    styles.divisionTile,
                    {
                      backgroundColor: isActive ? `${div.color}08` : c.bgCard,
                      borderColor: isActive ? `${div.color}40` : c.border,
                    },
                  ]}
                  onPress={() => setSelected(isActive ? null : div.name)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.divisionDot, { backgroundColor: div.color }]} />
                  <Text style={[styles.divisionName, { color: c.textPrimary }]}>{div.name}</Text>
                  <View style={styles.divisionVPRow}>
                    <View style={[styles.vpBadge, { backgroundColor: `${div.color}12`, borderColor: `${div.color}30` }]}>
                      <Text style={[styles.vpBadgeText, { color: div.color }]}>Vice President</Text>
                    </View>
                  </View>
                  <Text style={[styles.divisionVP, { color: c.textSecondary }]}>{vp.name}</Text>
                  <Text style={[styles.divisionCount, { color: c.textMuted }]}>
                    {div.members.length - 1} member{div.members.length - 1 !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {activeDivision && (
            <View style={[styles.membersPanel, { borderColor: `${activeDivision.color}25` }]}>
              <View style={[styles.membersPanelHeader, { backgroundColor: `${activeDivision.color}08`, borderBottomColor: `${activeDivision.color}20` }]}>
                <View style={[styles.panelDot, { backgroundColor: activeDivision.color }]} />
                <Text style={[styles.panelTitle, { color: c.textPrimary }]}>{activeDivision.name}</Text>
                <Text style={[styles.panelCount, { color: c.textMuted }]}>{activeDivision.members.length} members</Text>
              </View>
              <View style={styles.membersList}>
                {activeDivision.members.slice(1).map(m => (
                  <MemberCard key={m.name} member={m} color={activeDivision.color} c={c} />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.footerBlock, { borderTopColor: c.border }]}>
          <Text style={[styles.footerText, { color: c.textMuted }]}>Interested in joining the committee?{'  '}</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://tally.so/r/681g7e')}>
            <Text style={[styles.footerLink, { color: c.blue }]}>Apply here →</Text>
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
  pageSubtitle: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },

  sectionBlock: { gap: 14 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1 },
  closeBtn: { fontSize: 11 },

  presidentCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 16, padding: 16, gap: 12,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  presidentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  presidentBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  presidentBadgeText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },

  avatar: {
    width: 40, height: 40, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, flexShrink: 0,
  },
  avatarLg: { width: 44, height: 44, borderRadius: 12 },
  avatarText: { fontSize: 13, fontWeight: '800' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 13, fontFamily: 'Geist-SemiBold', lineHeight: 18 },
  memberRole: { fontSize: 11, fontFamily: 'Geist-Regular' },
  memberLinks: { flexDirection: 'row', gap: 4 },
  linkBtn: {
    width: 28, height: 28, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },

  divisionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  divisionTile: {
    width: '47.5%', borderWidth: 1, borderRadius: 14, padding: 14, gap: 4,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  divisionDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  divisionName: { fontSize: 12, fontWeight: '800' },
  divisionVPRow: { flexDirection: 'row' },
  vpBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  vpBadgeText: { fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  divisionVP: { fontSize: 11, fontFamily: 'Geist-Regular' },
  divisionCount: { fontSize: 10, fontFamily: 'Geist-Regular', marginTop: 2 },

  membersPanel: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  membersPanelHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, gap: 8, borderBottomWidth: 1,
  },
  panelDot: { width: 8, height: 8, borderRadius: 4 },
  panelTitle: { fontSize: 13, fontWeight: '800', flex: 1 },
  panelCount: { fontSize: 11 },
  membersList: { padding: 10, gap: 8 },
  memberCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderRadius: 12, padding: 10, gap: 10,
  },

  footerBlock: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, paddingTop: 16 },
  footerText: { fontSize: 12, fontFamily: 'Geist-Regular' },
  footerLink: { fontSize: 12, fontFamily: 'Geist-Medium' },
})
