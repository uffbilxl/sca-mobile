import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FileText, Mail, BookOpen, ArrowUpRight, ExternalLink } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import AppHeader from '../components/AppHeader'

interface Resource { title: string; description: string; fileUrl?: string; pages?: string }
interface Category { id: string; label: string; color: string; icon: any; resources: Resource[] }

const CATEGORIES: Category[] = [
  {
    id: 'cv', label: 'CV Templates', color: '#4a82f0', icon: FileText,
    resources: [
      { title: '1-Page CV Template', description: 'Clean, concise single-page CV — ideal for internships and graduate roles.', pages: '1 page', fileUrl: 'https://bcusca.org/cv-1page.docx' },
      { title: '2-Page CV Template', description: 'Extended format for candidates with more experience or academic projects.', pages: '2 pages', fileUrl: 'https://bcusca.org/cv-2page.docx' },
    ],
  },
  {
    id: 'cover-letter', label: 'Cover Letters', color: '#22c55e', icon: Mail,
    resources: [
      { title: 'Cover Letter Template', description: 'Professional cover letter structure with guidance on what to include for tech roles.', fileUrl: 'https://bcusca.org/cover-letter.docx' },
    ],
  },
  {
    id: 'guides', label: 'Guides', color: '#a855f7', icon: BookOpen,
    resources: [
      { title: 'More guides coming soon', description: 'Interview prep, LinkedIn tips, application strategies and more.' },
    ],
  },
]

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()

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
          <Text style={[styles.pageTitle, { color: c.textPrimary }]}>Resources</Text>
          <Text style={[styles.pageSubtitle, { color: c.textSecondary }]}>Templates and guides to help you land your next opportunity.</Text>
        </View>

        {CATEGORIES.map(cat => {
          const CatIcon = cat.icon
          return (
            <View key={cat.id} style={styles.category}>
              <View style={styles.catHeader}>
                <View style={[styles.catIconBox, { backgroundColor: `${cat.color}12`, borderColor: `${cat.color}25` }]}>
                  <CatIcon size={16} color={cat.color} strokeWidth={1.75} />
                </View>
                <Text style={[styles.catLabel, { color: c.textPrimary }]}>{cat.label}</Text>
                <View style={[styles.catLine, { backgroundColor: c.border }]} />
                <Text style={[styles.catCount, { color: c.textMuted }]}>
                  {cat.resources.length} {cat.resources.length === 1 ? 'item' : 'items'}
                </Text>
              </View>

              <View style={styles.resourceList}>
                {cat.resources.map(r => (
                  <View key={r.title} style={[styles.resourceCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
                    <View style={styles.resourceTop}>
                      <View style={styles.resourceTextBlock}>
                        <View style={styles.resourceTitleRow}>
                          <Text style={[styles.resourceTitle, { color: c.textPrimary }]}>{r.title}</Text>
                          {r.pages && (
                            <View style={[styles.pageBadge, { backgroundColor: c.bgInput }]}>
                              <Text style={[styles.pageBadgeText, { color: c.textMuted }]}>{r.pages}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.resourceDesc, { color: c.textSecondary }]}>{r.description}</Text>
                      </View>
                    </View>
                    {r.fileUrl && (
                      <TouchableOpacity
                        style={[styles.downloadBtn, { backgroundColor: c.blue }]}
                        onPress={() => Linking.openURL(r.fileUrl!)}
                        activeOpacity={0.85}
                      >
                        <ArrowUpRight size={14} color="#fff" strokeWidth={2} />
                        <Text style={styles.downloadBtnText}>Download</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )
        })}
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

  category: { gap: 10 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catIconBox: {
    width: 30, height: 30, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  catLabel: { fontSize: 13, fontFamily: 'Geist-SemiBold' },
  catLine: { flex: 1, height: 1 },
  catCount: { fontSize: 11, fontFamily: 'Geist-Regular' },

  resourceList: { gap: 8 },
  resourceCard: {
    borderWidth: 1, borderRadius: 14, padding: 14, gap: 12,
    shadowColor: '#0b1120', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  resourceTop: { gap: 8 },
  resourceTextBlock: { gap: 4 },
  resourceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  resourceTitle: { fontSize: 14, fontFamily: 'Geist-SemiBold', flex: 1 },
  resourceDesc: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },
  pageBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  pageBadgeText: { fontSize: 10, fontFamily: 'Geist-Medium' },
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 10,
  },
  downloadBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Geist-SemiBold' },
})
