import { useState, useCallback } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { Download, WifiOff } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import type { ResourceCategory } from '../lib/types'
import { fetchResources } from '../lib/api'
import AppHeader from '../components/AppHeader'
import AnimatedBackground from '../components/AnimatedBackground'

function ResourceCard({ resource, c }: { resource: any; c: any }) {
  const getFileType = () => {
    if (resource.fileUrl.endsWith('.pdf')) return 'PDF'
    if (resource.fileUrl.endsWith('.docx')) return 'DOCX'
    return 'Download'
  }

  const handleDownload = async () => {
    const fileUrl = resource.fileUrl.startsWith('http')
      ? resource.fileUrl
      : `https://bcusca.org${resource.fileUrl}`

    try {
      await Linking.openURL(fileUrl)
    } catch (err) {
      console.error('Failed to open URL:', err)
    }
  }

  return (
    <View key={resource.id} style={[styles.resourceCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
      <View style={styles.resourceTop}>
        <View style={styles.resourceTextBlock}>
          <Text style={[styles.resourceTitle, { color: c.textPrimary }]}>{resource.title}</Text>
          {resource.description && (
            <Text style={[styles.resourceDesc, { color: c.textSecondary }]}>{resource.description}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.downloadBtn, { backgroundColor: c.blue }]}
        onPress={handleDownload}
        activeOpacity={0.85}
      >
        <Download size={14} color="#fff" strokeWidth={2} />
        <Text style={styles.downloadBtnText}>{getFileType()}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function ResourcesScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetchResources().then(({ data, live, error: err }) => {
      if (!active) return
      setCategories(data)
      setError(live ? null : err)
      setLoading(false)
    })
    return () => { active = false }
  }, []))

  const totalResources = categories.reduce((sum, cat) => sum + cat.resources.length, 0)

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AnimatedBackground />
      <AppHeader variant="screen" title="Resources" />

      {error && !loading && (
        <View style={[styles.errorCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <WifiOff size={18} color={c.textMuted} strokeWidth={1.75} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.errorTitle, { color: c.textPrimary }]}>Couldn't load resources</Text>
            <Text style={[styles.errorSub, { color: c.textMuted }]}>{error}</Text>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="small" color={c.blue} style={{ marginTop: 40 }} />
      ) : (
        <>
          <Text style={[styles.count, { color: c.textMuted }]}>
            {totalResources} {totalResources === 1 ? 'resource' : 'resources'}
          </Text>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
            showsVerticalScrollIndicator={false}
          >
            {categories.map(cat => (
              <View key={cat.id} style={styles.category}>
                <View style={styles.catHeader}>
                  <Text style={styles.catIcon}>{cat.icon}</Text>
                  <Text style={[styles.catLabel, { color: c.textPrimary }]}>{cat.label}</Text>
                  <View style={[styles.catLine, { backgroundColor: c.border }]} />
                  <Text style={[styles.catCount, { color: c.textMuted }]}>
                    {cat.resources.length} {cat.resources.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>

                <View style={styles.resourceList}>
                  {cat.resources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} c={c} />
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 20, paddingTop: 6 },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold' },
  errorSub: { fontSize: 11, fontFamily: 'Geist-Regular', marginTop: 1 },

  count: {
    fontSize: 11,
    fontFamily: 'Geist-Regular',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },

  category: { gap: 10 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catIcon: { fontSize: 20 },
  catLabel: { fontSize: 14, fontFamily: 'Geist-SemiBold' },
  catLine: { flex: 1, height: 1 },
  catCount: { fontSize: 11, fontFamily: 'Geist-Regular' },

  resourceList: { gap: 8 },
  resourceCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#0b1120',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  resourceTop: { gap: 8 },
  resourceTextBlock: { gap: 4, flex: 1 },
  resourceTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold', lineHeight: 18 },
  resourceDesc: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  downloadBtnText: { color: '#fff', fontSize: 11, fontFamily: 'Geist-SemiBold' },
})
