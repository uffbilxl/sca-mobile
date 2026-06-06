import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../lib/theme'

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

function MemberCard({ member, color }: { member: Member; color: string }) {
  return (
    <View style={[styles.memberCard, { borderColor: `${color}25` }]}>
      <View style={[styles.avatar, { backgroundColor: `${color}18`, borderColor: `${color}30` }]}>
        <Text style={[styles.avatarText, { color }]}>{initials(member.name)}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
      </View>
      <View style={styles.memberLinks}>
        {member.linkedin && (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => Linking.openURL(member.linkedin!)}
          >
            <Text style={styles.linkBtnText}>in</Text>
          </TouchableOpacity>
        )}
        {member.website && (
          <TouchableOpacity
            style={[styles.linkBtn, styles.linkBtnGray]}
            onPress={() => Linking.openURL(member.website!)}
          >
            <Text style={styles.linkBtnGrayText}>↗</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default function CommitteeScreen() {
  const insets = useSafeAreaInsets()
  const [selected, setSelected] = useState<string | null>(null)
  const activeDivision = DIVISIONS.find(d => d.name === selected) ?? null

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Student Computing Association</Text>
        <Text style={styles.pageTitle}>Meet the Committee</Text>
        <Text style={styles.pageSubtitle}>The people behind the SCA, organising events, driving projects, and building the BCU computing community.</Text>
      </View>

      {/* Leadership */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Leadership</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* President */}
        <View style={styles.presidentCard}>
          <View style={[styles.avatar, styles.avatarLg, { backgroundColor: colors.accentBg, borderColor: colors.accentBorder }]}>
            <Text style={[styles.avatarText, { color: colors.accent, fontSize: 16 }]}>TNS</Text>
          </View>
          <View style={styles.memberInfo}>
            <View style={styles.presidentRow}>
              <Text style={styles.memberName}>{LEADERSHIP[0].name}</Text>
              <View style={styles.presidentBadge}>
                <Text style={styles.presidentBadgeText}>President</Text>
              </View>
            </View>
          </View>
          <View style={styles.memberLinks}>
            {LEADERSHIP[0].linkedin && (
              <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(LEADERSHIP[0].linkedin!)}>
                <Text style={styles.linkBtnText}>in</Text>
              </TouchableOpacity>
            )}
            {LEADERSHIP[0].website && (
              <TouchableOpacity style={[styles.linkBtn, styles.linkBtnGray]} onPress={() => Linking.openURL(LEADERSHIP[0].website!)}>
                <Text style={styles.linkBtnGrayText}>↗</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Divisions */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Divisions</Text>
          <View style={styles.sectionLine} />
          {selected && (
            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.closeBtn}>✕ close</Text>
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
                  { borderColor: isActive ? `${div.color}50` : colors.border1 },
                  isActive && { backgroundColor: `${div.color}10` },
                ]}
                onPress={() => setSelected(isActive ? null : div.name)}
                activeOpacity={0.75}
              >
                <View style={[styles.divisionDot, { backgroundColor: div.color }]} />
                <Text style={styles.divisionName}>{div.name}</Text>
                <View style={styles.divisionVPRow}>
                  <View style={[styles.vpBadge, { backgroundColor: `${div.color}18`, borderColor: `${div.color}35` }]}>
                    <Text style={[styles.vpBadgeText, { color: div.color }]}>Vice President</Text>
                  </View>
                </View>
                <Text style={styles.divisionVP}>{vp.name}</Text>
                <Text style={styles.divisionCount}>{div.members.length - 1} member{div.members.length - 1 !== 1 ? 's' : ''}</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {activeDivision && (
          <View style={[styles.membersPanel, { borderColor: `${activeDivision.color}30` }]}>
            <View style={[styles.membersPanelHeader, { backgroundColor: `${activeDivision.color}10`, borderBottomColor: `${activeDivision.color}25` }]}>
              <View style={[styles.panelDot, { backgroundColor: activeDivision.color }]} />
              <Text style={styles.panelTitle}>{activeDivision.name}</Text>
              <Text style={styles.panelCount}>{activeDivision.members.length} members</Text>
            </View>
            <View style={styles.membersList}>
              {activeDivision.members.slice(1).map(m => (
                <MemberCard key={m.name} member={m} color={activeDivision.color} />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footerBlock}>
        <Text style={styles.footerText}>Interested in joining the committee?{'  '}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://tally.so/r/681g7e')}>
          <Text style={styles.footerLink}>Apply here →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg1 },
  content: { padding: 16, paddingBottom: 40, gap: 24 },
  pageHeader: { gap: 6 },
  eyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  pageTitle: { fontSize: 26, fontFamily: 'Geist-Bold', color: colors.t1, letterSpacing: -0.6 },
  pageSubtitle: { fontSize: 12, color: colors.t3, lineHeight: 18 },

  sectionBlock: { gap: 14 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionLabel: { fontSize: 9, fontWeight: '700', color: colors.t4, letterSpacing: 1.2, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: 1, backgroundColor: colors.border1 },
  closeBtn: { fontSize: 11, color: colors.t4 },

  presidentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: `${colors.accent}25`,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  presidentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  presidentBadge: {
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  presidentBadgeText: { fontSize: 9, color: colors.accent, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  avatarLg: { width: 44, height: 44, borderRadius: 12 },
  avatarText: { fontSize: 13, fontWeight: '800' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 13, fontFamily: 'Geist-SemiBold', color: colors.t1, lineHeight: 18 },
  memberRole: { fontSize: 11, fontFamily: 'Geist-Regular', color: colors.t3 },
  memberLinks: { flexDirection: 'row', gap: 4 },
  linkBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0,119,181,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,119,181,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkBtnText: { fontSize: 11, fontWeight: '800', color: '#0077b5' },
  linkBtnGray: { backgroundColor: colors.bg3, borderColor: colors.border2 },
  linkBtnGrayText: { fontSize: 12, color: colors.t2 },

  divisionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  divisionTile: {
    width: '47.5%',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  divisionDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  divisionName: { fontSize: 12, fontWeight: '800', color: colors.t1 },
  divisionVPRow: { flexDirection: 'row' },
  vpBadge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  vpBadgeText: { fontSize: 8, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  divisionVP: { fontSize: 11, color: colors.t3 },
  divisionCount: { fontSize: 10, color: colors.t4, marginTop: 2 },

  membersPanel: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  membersPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  panelDot: { width: 8, height: 8, borderRadius: 4 },
  panelTitle: { fontSize: 13, fontWeight: '800', color: colors.t1, flex: 1 },
  panelCount: { fontSize: 11, color: colors.t4 },
  membersList: { padding: 10, gap: 8 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },

  footerBlock: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border1, paddingTop: 16 },
  footerText: { fontSize: 12, color: colors.t4 },
  footerLink: { fontSize: 12, color: colors.accent },
})
