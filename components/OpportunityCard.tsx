import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { colors } from '../lib/theme'
import type { SCAOpportunity } from '../lib/types'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

function Tag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <View style={[styles.tag, accent && styles.tagAccent]}>
      {accent && <View style={styles.pulse} />}
      <Text style={[styles.tagText, accent && styles.tagTextAccent]}>{label}</Text>
    </View>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  )
}

function SkillChip({ label }: { label: string }) {
  return (
    <View style={styles.skillChip}>
      <Text style={styles.skillChipText}>{label}</Text>
    </View>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

function BulletItem({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletArrow}>→</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  )
}

function BenefitItem({ text }: { text: string }) {
  return (
    <View style={styles.benefitRow}>
      <Text style={styles.benefitStar}>✦</Text>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  )
}

export default function OpportunityCard({ opp }: { opp: SCAOpportunity }) {
  const [open, setOpen] = useState(false)

  function toggle() {
    LayoutAnimation.configureNext({
      duration: 280,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    })
    setOpen(o => !o)
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.tagRow}>
            <Tag label="Now open" accent />
            <Tag label={opp.division} />
            {opp.extraTags.map(t => <Tag key={t} label={t} />)}
          </View>
          <Text style={styles.title}>{opp.title}</Text>
          <Text style={styles.subtitle}>{opp.subtitle}</Text>
        </View>
        <Text style={[styles.chevron, open && styles.chevronOpen]}>▼</Text>
      </TouchableOpacity>

      {open && (
        <View>
          <View style={styles.divider} />
          <View style={styles.body}>
            <Text style={styles.description}>{opp.description}</Text>

            {opp.roles && opp.roles.length > 0 && (
              <Section title="ROLES AVAILABLE">
                <View style={styles.row}>
                  {opp.roles.map(r => <Pill key={r} label={r} />)}
                </View>
              </Section>
            )}

            <Section title="WHAT YOU'LL DO">
              {opp.whatYoullDo.map(item => <BulletItem key={item} text={item} />)}
            </Section>

            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>EXPECTED SKILLS</Text>
                <View style={styles.row}>
                  {opp.skills.map(s => <SkillChip key={s} label={s} />)}
                </View>
                <Text style={styles.noteText}>{opp.skillsNote}</Text>
              </View>
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>EXPERIENCE</Text>
                <Text style={styles.bodySmall}>{opp.experienceNote}</Text>
              </View>
            </View>

            <View style={styles.benefitsBox}>
              <Text style={styles.sectionTitle}>WHY APPLY</Text>
              {opp.benefits.map(b => <BenefitItem key={b} text={b} />)}
            </View>
          </View>

          <View style={styles.divider} />
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerText}>{opp.footer}</Text>
              {opp.organiser && (
                <View style={styles.organiserRow}>
                  <Text style={styles.footerText}>Organiser: </Text>
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${opp.organiser!.email}`)}>
                    <Text style={styles.link}>{opp.organiser.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.ctaRow}>
              {opp.contactEmail && (
                <TouchableOpacity
                  style={styles.btnOutline}
                  onPress={() => Linking.openURL(`mailto:${opp.contactEmail}`)}
                >
                  <Text style={styles.btnOutlineText}>Contact organiser</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => Linking.openURL(opp.applyUrl)}
              >
                <Text style={styles.btnPrimaryText}>Apply now →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  headerLeft: { flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  tagAccent: {
    backgroundColor: colors.accentBg,
    borderColor: colors.accentBorder,
  },
  tagText: { fontSize: 10, color: colors.t3, fontWeight: '600', letterSpacing: 0.5 },
  tagTextAccent: { color: colors.accent },
  pulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.t1, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: colors.t3, marginTop: 2 },
  chevron: { fontSize: 11, color: colors.t4, marginTop: 4 },
  chevronOpen: { opacity: 0.6 },

  divider: { height: 1, backgroundColor: colors.border1 },
  body: { padding: 20, gap: 18 },
  description: { fontSize: 13, color: colors.t2, lineHeight: 20 },

  section: { gap: 6 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.t4,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  pillText: { fontSize: 12, color: colors.t2, fontWeight: '500' },
  skillChip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: colors.accentBg,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  skillChipText: { fontSize: 11, color: colors.accent, fontWeight: '600' },
  noteText: { fontSize: 11, color: colors.t4, marginTop: 4 },
  bodySmall: { fontSize: 11, color: colors.t3 },

  bulletRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletArrow: { color: colors.accent, fontSize: 12, marginTop: 1 },
  bulletText: { fontSize: 12, color: colors.t2, flex: 1, lineHeight: 18 },

  twoCol: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  benefitsBox: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  benefitStar: { color: colors.accent, fontSize: 9 },
  benefitText: { fontSize: 12, color: colors.t2 },

  footer: {
    padding: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  footerText: { fontSize: 11, color: colors.t4 },
  organiserRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  link: { fontSize: 11, color: colors.accent, fontWeight: '600' },
  ctaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btnOutline: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  btnOutlineText: { fontSize: 12, color: colors.t2, fontWeight: '500' },
  btnPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },
  btnPrimaryText: { fontSize: 13, color: '#fff', fontWeight: '700' },
})
