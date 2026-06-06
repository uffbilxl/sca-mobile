import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { subscribeToOpportunities, seedIfEmpty } from '../lib/firestore'
import { colors } from '../lib/theme'
import type { SCAOpportunity } from '../lib/types'
import OpportunityCard from '../components/OpportunityCard'

export default function SCAScreen() {
  const insets = useSafeAreaInsets()
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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>Internal</Text>
        <Text style={styles.pageTitle}>SCA Opportunities</Text>
        <Text style={styles.pageSubtitle}>
          Committee roles, volunteering, and other ways to get involved with the Student Computing Association.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : opportunities.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No roles right now</Text>
          <Text style={styles.emptyText}>Check back soon — SCA positions are added throughout the year.</Text>
        </View>
      ) : (
        opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} />)
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg1 },
  content: { paddingHorizontal: 16 },

  pageHeader: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
    gap: 4,
  },
  eyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: '700', marginBottom: 2 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: colors.t1, letterSpacing: -0.7 },
  pageSubtitle: { fontSize: 13, color: colors.t3, lineHeight: 19 },

  empty: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.t2 },
  emptyText: { fontSize: 13, color: colors.t3, textAlign: 'center', lineHeight: 19 },
})
