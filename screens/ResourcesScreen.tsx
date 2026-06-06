import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../lib/theme'

interface Resource { title: string; description: string; fileUrl?: string; pages?: string }
interface Category { id: string; label: string; color: string; icon: string; resources: Resource[] }

const CATEGORIES: Category[] = [
  {
    id: 'cv', label: 'CV Templates', color: '#5b8df5', icon: '📄',
    resources: [
      { title: '1-Page CV Template', description: 'Clean, concise single-page CV — ideal for internships and graduate roles.', pages: '1 page', fileUrl: 'https://www.keystonedigitalstrategy.co.uk/cv-1page.docx' },
      { title: '2-Page CV Template', description: 'Extended format for candidates with more experience or academic projects.', pages: '2 pages', fileUrl: 'https://www.keystonedigitalstrategy.co.uk/cv-2page.docx' },
    ],
  },
  {
    id: 'cover-letter', label: 'Cover Letters', color: '#22c55e', icon: '✉️',
    resources: [
      { title: 'Cover Letter Template', description: 'Professional cover letter structure with guidance on what to include for tech roles.', fileUrl: 'https://www.keystonedigitalstrategy.co.uk/cover-letter.docx' },
    ],
  },
  {
    id: 'guides', label: 'Guides', color: '#a855f7', icon: '📚',
    resources: [
      { title: 'More guides coming soon', description: 'Interview prep, LinkedIn tips, application strategies and more.' },
    ],
  },
]

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets()
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Student Computing Association</Text>
        <Text style={styles.pageTitle}>Resources</Text>
        <Text style={styles.pageSubtitle}>Templates and guides to help you land your next opportunity.</Text>
      </View>

      {CATEGORIES.map(cat => (
        <View key={cat.id} style={styles.category}>
          <View style={styles.catHeader}>
            <Text style={styles.catLabel}>{cat.label}</Text>
            <View style={styles.catLine} />
            <Text style={styles.catCount}>{cat.resources.length} {cat.resources.length === 1 ? 'item' : 'items'}</Text>
          </View>

          <View style={styles.resourceList}>
            {cat.resources.map(r => (
              <View key={r.title} style={styles.resourceCard}>
                <View style={styles.resourceTop}>
                  <View style={[styles.resourceIcon, { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}30` }]}>
                    <Text style={styles.resourceIconText}>{cat.icon}</Text>
                  </View>
                  <View style={styles.resourceTextBlock}>
                    <View style={styles.resourceTitleRow}>
                      <Text style={styles.resourceTitle}>{r.title}</Text>
                      {r.pages && <View style={styles.pageBadge}><Text style={styles.pageBadgeText}>{r.pages}</Text></View>}
                    </View>
                    <Text style={styles.resourceDesc}>{r.description}</Text>
                  </View>
                </View>

                {r.fileUrl ? (
                  <TouchableOpacity
                    style={[styles.downloadBtn, { backgroundColor: cat.color }]}
                    onPress={() => Linking.openURL(r.fileUrl!)}
                  >
                    <Text style={styles.downloadBtnText}>↓  Download DOCX</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.downloadBtn, styles.downloadBtnDisabled]}>
                    <Text style={styles.downloadBtnDisabledText}>Coming soon</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Have a resource to contribute?{'  '}</Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://tally.so/r/681g7e')}>
          <Text style={styles.footerLink}>Get in touch →</Text>
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

  category: { gap: 12 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catLabel: { fontSize: 10, fontWeight: '700', color: colors.t4, letterSpacing: 1, textTransform: 'uppercase' },
  catLine: { flex: 1, height: 1, backgroundColor: colors.border1 },
  catCount: { fontSize: 10, color: colors.t4 },

  resourceList: { gap: 8 },
  resourceCard: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  resourceTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resourceIconText: { fontSize: 18 },
  resourceTextBlock: { flex: 1, gap: 4 },
  resourceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  resourceTitle: { fontSize: 13, fontWeight: '700', color: colors.t1 },
  pageBadge: {
    backgroundColor: colors.bg3,
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pageBadgeText: { fontSize: 10, color: colors.t3 },
  resourceDesc: { fontSize: 11, color: colors.t3, lineHeight: 17 },
  downloadBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadBtnText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  downloadBtnDisabled: { backgroundColor: colors.bg3, borderWidth: 1, borderColor: colors.border2 },
  downloadBtnDisabledText: { fontSize: 12, color: colors.t4, fontWeight: '500' },

  footer: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border1, paddingTop: 16 },
  footerText: { fontSize: 12, color: colors.t4 },
  footerLink: { fontSize: 12, color: colors.accent },
})
