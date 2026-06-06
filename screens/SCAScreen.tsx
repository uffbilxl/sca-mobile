import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { subscribeToOpportunities, seedIfEmpty } from '../lib/firestore'
import { useTheme } from '../lib/ThemeContext'
import type { SCAOpportunity } from '../lib/types'
import OpportunityCard from '../components/OpportunityCard'
import AppHeader from '../components/AppHeader'
import AnimatedBackground from '../components/AnimatedBackground'

export default function SCAScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [opportunities, setOpportunities] = useState<SCAOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedIfEmpty().catch(console.error)
    const unsub = subscribeToOpportunities(opps => {
      setOpportunities(opps)
      setLoading(false)
    })
    return unsub
  }, [])

  return (
    <View style={[styles.outer, { backgroundColor: c.bgPage }]}>
      <AnimatedBackground />
      <AppHeader variant="screen" title="SCA Roles" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.pageHeader, { borderBottomColor: c.border }]}>
          <Text style={[styles.eyebrow, { color: c.blue }]}>Internal</Text>
          <Text style={[styles.pageTitle, { color: c.textPrimary }]}>SCA Opportunities</Text>
          <Text style={[styles.pageSubtitle, { color: c.textSecondary }]}>
            Committee roles, volunteering, and other ways to get involved with the Student Computing Association.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color={c.blue} style={{ marginTop: 40 }} />
        ) : opportunities.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: c.bgCard, borderColor: c.border }]}>
            <Text style={[styles.emptyTitle, { color: c.textPrimary }]}>No roles right now</Text>
            <Text style={[styles.emptyText, { color: c.textSecondary }]}>Check back soon — SCA positions are added throughout the year.</Text>
          </View>
        ) : (
          opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} />)
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },

  pageHeader: {
    marginBottom: 20, paddingBottom: 20,
    borderBottomWidth: 1, gap: 4, paddingTop: 16,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700' },
  pageTitle: { fontSize: 26, fontFamily: 'Geist-Bold', letterSpacing: -0.6 },
  pageSubtitle: { fontSize: 13, fontFamily: 'Geist-Regular', lineHeight: 19 },

  empty: {
    borderWidth: 1, borderRadius: 16, padding: 32,
    alignItems: 'center', gap: 10, marginTop: 8,
  },
  emptyTitle: { fontSize: 16, fontFamily: 'Geist-SemiBold' },
  emptyText: { fontSize: 13, fontFamily: 'Geist-Regular', textAlign: 'center', lineHeight: 20 },
})
