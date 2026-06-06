import { useState } from 'react'
import {
  View, Text, TouchableOpacity, Linking, StyleSheet,
  LayoutAnimation, Platform, UIManager,
} from 'react-native'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import type { SCAOpportunity } from '../lib/types'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

function Tag({ label, accent, c }: { label: string; accent?: boolean; c: any }) {
  return (
    <View style={[
      styles.tag,
      { backgroundColor: accent ? c.blueLight : c.bgInput, borderColor: accent ? `${c.blue}30` : c.border },
    ]}>
      {accent && <View style={[styles.pulse, { backgroundColor: c.blue }]} />}
      <Text style={[styles.tagText, { color: accent ? c.blue : c.textSecondary }]}>{label}</Text>
    </View>
  )
}

function Pill({ label, c }: { label: string; c: any }) {
  return (
    <View style={[styles.pill, { backgroundColor: c.bgInput, borderColor: c.border }]}>
      <Text style={[styles.pillText, { color: c.textSecondary }]}>{label}</Text>
    </View>
  )
}

function SkillChip({ label, c }: { label: string; c: any }) {
  return (
    <View style={[styles.skillChip, { backgroundColor: c.blueLight }]}>
      <Text style={[styles.skillChipText, { color: c.blueText }]}>{label}</Text>
    </View>
  )
}

function Section({ title, children, c }: { title: string; children: React.ReactNode; c: any }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.textMuted }]}>{title}</Text>
      {children}
    </View>
  )
}

function BulletItem({ text, c }: { text: string; c: any }) {
  return (
    <View style={styles.bulletRow}>
      <ArrowRight size={12} color={c.blue} strokeWidth={2} style={{ marginTop: 2 }} />
      <Text style={[styles.bulletText, { color: c.textSecondary }]}>{text}</Text>
    </View>
  )
}

function BenefitItem({ text, c }: { text: string; c: any }) {
  return (
    <View style={styles.benefitRow}>
      <View style={[styles.benefitDot, { backgroundColor: c.blue }]} />
      <Text style={[styles.benefitText, { color: c.textSecondary }]}>{text}</Text>
    </View>
  )
}

export default function OpportunityCard({ opp }: { opp: SCAOpportunity }) {
  const { colors: c } = useTheme()
  const [open, setOpen] = useState(false)

  function toggle() {
    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    })
    setOpen(o => !o)
  }

  return (
    <View style={[
      styles.card,
      { backgroundColor: c.bgCard, borderColor: c.border },
      c.isDark
        ? { shadowColor: '#000', shadowOpacity: 0.25 }
        : { shadowColor: '#0b1120', shadowOpacity: 0.05 },
    ]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.tagRow}>
            <Tag label="Now open" accent c={c} />
            <Tag label={opp.division} c={c} />
            {opp.extraTags.map(t => <Tag key={t} label={t} c={c} />)}
          </View>
          <Text style={[styles.title, { color: c.textPrimary }]}>{opp.title}</Text>
          <Text style={[styles.subtitle, { color: c.textSecondary }]}>{opp.subtitle}</Text>
        </View>
        {open
          ? <ChevronUp size={16} color={c.textMuted} strokeWidth={2} />
          : <ChevronDown size={16} color={c.textMuted} strokeWidth={2} />
        }
      </TouchableOpacity>

      {open && (
        <View>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <View style={styles.body}>
            <Text style={[styles.description, { color: c.textSecondary }]}>{opp.description}</Text>

            {opp.roles && opp.roles.length > 0 && (
              <Section title="ROLES AVAILABLE" c={c}>
                <View style={styles.row}>
                  {opp.roles.map(r => <Pill key={r} label={r} c={c} />)}
                </View>
              </Section>
            )}

            <Section title="WHAT YOU'LL DO" c={c}>
              {opp.whatYoullDo.map(item => <BulletItem key={item} text={item} c={c} />)}
            </Section>

            <View style={styles.twoCol}>
              <View style={styles.col}>
                <Text style={[styles.sectionTitle, { color: c.textMuted }]}>EXPECTED SKILLS</Text>
                <View style={styles.row}>
                  {opp.skills.map(s => <SkillChip key={s} label={s} c={c} />)}
                </View>
                <Text style={[styles.noteText, { color: c.textMuted }]}>{opp.skillsNote}</Text>
              </View>
              <View style={styles.col}>
                <Text style={[styles.sectionTitle, { color: c.textMuted }]}>EXPERIENCE</Text>
                <Text style={[styles.bodySmall, { color: c.textSecondary }]}>{opp.experienceNote}</Text>
              </View>
            </View>

            <View style={[styles.benefitsBox, { backgroundColor: c.bgInput, borderColor: c.border }]}>
              <Text style={[styles.sectionTitle, { color: c.textMuted }]}>WHY APPLY</Text>
              {opp.benefits.map(b => <BenefitItem key={b} text={b} c={c} />)}
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <View style={styles.footer}>
            <View>
              <Text style={[styles.footerText, { color: c.textMuted }]}>{opp.footer}</Text>
              {opp.organiser && (
                <View style={styles.organiserRow}>
                  <Text style={[styles.footerText, { color: c.textMuted }]}>Organiser: </Text>
                  <TouchableOpacity onPress={() => Linking.openURL(`mailto:${opp.organiser!.email}`)}>
                    <Text style={[styles.link, { color: c.blue }]}>{opp.organiser.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.ctaRow}>
              {opp.contactEmail && (
                <TouchableOpacity
                  style={[styles.btnOutline, { borderColor: c.border }]}
                  onPress={() => Linking.openURL(`mailto:${opp.contactEmail}`)}
                >
                  <Text style={[styles.btnOutlineText, { color: c.textSecondary }]}>Contact organiser</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.btnPrimary, { backgroundColor: c.blue }]}
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
    borderWidth: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 12,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2,
  },
  header: {
    flexDirection: 'row', alignItems: 'flex-start',
    justifyContent: 'space-between', padding: 20, gap: 12,
  },
  headerLeft: { flex: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 999, borderWidth: 1,
  },
  tagText: { fontSize: 10, fontFamily: 'Geist-Medium', letterSpacing: 0.3 },
  pulse: { width: 6, height: 6, borderRadius: 3 },
  title: { fontSize: 17, fontFamily: 'Geist-Bold', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, fontFamily: 'Geist-Regular', marginTop: 2 },

  divider: { height: 1 },
  body: { padding: 20, gap: 18 },
  description: { fontSize: 13, fontFamily: 'Geist-Regular', lineHeight: 20 },

  section: { gap: 6 },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 4,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 8, borderWidth: 1,
  },
  pillText: { fontSize: 12, fontFamily: 'Geist-Medium' },
  skillChip: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  skillChipText: { fontSize: 11, fontFamily: 'Geist-Medium' },
  noteText: { fontSize: 11, fontFamily: 'Geist-Regular', marginTop: 4 },
  bodySmall: { fontSize: 11, fontFamily: 'Geist-Regular' },

  bulletRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bulletText: { fontSize: 12, fontFamily: 'Geist-Regular', flex: 1, lineHeight: 18 },

  twoCol: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  benefitsBox: { borderWidth: 1, borderRadius: 12, padding: 14, gap: 6 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitDot: { width: 5, height: 5, borderRadius: 3 },
  benefitText: { fontSize: 12, fontFamily: 'Geist-Regular' },

  footer: { padding: 16, paddingHorizontal: 20, gap: 12 },
  footerText: { fontSize: 11, fontFamily: 'Geist-Regular' },
  organiserRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  link: { fontSize: 11, fontFamily: 'Geist-SemiBold' },
  ctaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  btnOutline: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, borderWidth: 1 },
  btnOutlineText: { fontSize: 12, fontFamily: 'Geist-Medium' },
  btnPrimary: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 12 },
  btnPrimaryText: { fontSize: 13, color: '#fff', fontFamily: 'Geist-SemiBold' },
})
