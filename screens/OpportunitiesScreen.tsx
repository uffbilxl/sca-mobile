import { useState, useMemo, useCallback } from 'react'
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking,
  LayoutAnimation, Platform, UIManager, ActivityIndicator,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { MapPin, ChevronDown, ChevronUp, ListFilter, WifiOff } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'
import { typeColors, typeLabels } from '../lib/theme'
import { fetchOpportunities } from '../lib/api'
import type { Opportunity, OpportunityType } from '../lib/types'
import AppHeader from '../components/AppHeader'
import AnimatedBackground from '../components/AnimatedBackground'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

const TYPE_FILTERS: { label: string; value: OpportunityType | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Internship', value: 'INTERNSHIP' },
  { label: 'Placement', value: 'PLACEMENT' },
  { label: 'Graduate', value: 'GRADUATE' },
  { label: 'Spring Week', value: 'SPRING_WEEK' },
  { label: 'Insight', value: 'INSIGHT' },
]

function OppCard({ opp, c }: { opp: Opportunity; c: any }) {
  const [open, setOpen] = useState(false)
  const tInfo = typeColors[opp.type]
  const badgeBg   = tInfo ? c[tInfo.bg]   : c.blueLight
  const badgeText = tInfo ? c[tInfo.text]  : c.blueText

  function toggle() {
    LayoutAnimation.configureNext({
      duration: 260,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    })
    setOpen(o => !o)
  }

  return (
    <View style={[
      styles.card,
      { backgroundColor: c.bgCard, borderColor: open ? `${c.blue}40` : c.border },
      c.isDark
        ? { shadowColor: '#000', shadowOpacity: 0.25 }
        : { shadowColor: '#0b1120', shadowOpacity: 0.05 },
    ]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.cardTopRow}>
            <View style={[styles.typeBadge, { backgroundColor: badgeBg }]}>
              <Text style={[styles.typeBadgeText, { color: badgeText }]}>{typeLabels[opp.type]}</Text>
            </View>
            {opp.sponsored && (
              <View style={[styles.sponsoredBadge, { backgroundColor: c.bgInput, borderColor: c.border }]}>
                <Text style={[styles.sponsoredText, { color: c.textMuted }]}>Sponsored</Text>
              </View>
            )}
          </View>
          <Text style={[styles.cardTitle, { color: c.textPrimary }]} numberOfLines={open ? undefined : 2}>{opp.title}</Text>
          <Text style={[styles.cardCompany, { color: c.blue }]}>{opp.company.name}</Text>
          <View style={styles.cardMeta}>
            <MapPin size={11} color={c.textMuted} strokeWidth={1.75} />
            <Text style={[styles.cardMetaText, { color: c.textSecondary }]}>{opp.location}</Text>
            <Text style={[styles.cardMetaDot, { color: c.border }]}>·</Text>
            <View style={[styles.modeChip, { backgroundColor: c.bgInput }]}>
              <Text style={[styles.modeChipText, { color: c.textSecondary }]}>{opp.workMode}</Text>
            </View>
          </View>
        </View>
        {open
          ? <ChevronUp size={16} color={c.textMuted} strokeWidth={2} />
          : <ChevronDown size={16} color={c.textMuted} strokeWidth={2} />
        }
      </TouchableOpacity>

      {open && (
        <View style={styles.cardBody}>
          <View style={[styles.divider, { backgroundColor: c.border }]} />
          <Text style={[styles.description, { color: c.textSecondary }]}>{opp.description}</Text>
          {opp.startDate && (
            <Text style={[styles.metaLine, { color: c.textMuted }]}>Start: {opp.startDate}</Text>
          )}
          {opp.applyUrl && (
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: c.blue }]}
              onPress={() => Linking.openURL(opp.applyUrl!)}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>Apply now →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

export default function OpportunitiesScreen() {
  const insets = useSafeAreaInsets()
  const { colors: c } = useTheme()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'ALL'>('ALL')
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetchOpportunities().then(({ data, live, error: err }) => {
      if (!active) return
      setOpps(data)
      setError(live ? null : err)
      setLoading(false)
    })
    return () => { active = false }
  }, []))

  const filtered = useMemo(() => {
    return opps.filter(o => {
      if (o.status === 'CLOSED') return false
      if (typeFilter !== 'ALL' && o.type !== typeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          o.title.toLowerCase().includes(q) ||
          o.company.name.toLowerCase().includes(q) ||
          o.location.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, typeFilter])

  return (
    <View style={[styles.container, { backgroundColor: c.bgPage }]}>
      <AnimatedBackground />
      <AppHeader variant="screen" title="Opportunities" />

      {error && !loading && (
        <View style={[styles.errorCard, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <WifiOff size={18} color={c.textMuted} strokeWidth={1.75} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.errorTitle, { color: c.textPrimary }]}>Couldn't load opportunities</Text>
            <Text style={[styles.errorSub, { color: c.textMuted }]}>{error}</Text>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={[styles.searchWrap, { backgroundColor: c.bgPage }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: c.bgInput, borderColor: c.border, color: c.textPrimary }]}
          placeholder="Search by role, company or location..."
          placeholderTextColor={c.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Type filter */}
      <View style={[styles.filterWrap, { borderBottomColor: c.border }]}>
        <View style={styles.filterLabelRow}>
          <ListFilter size={13} color={c.textMuted} strokeWidth={1.75} />
          <Text style={[styles.filterLabel, { color: c.textMuted }]}>Filter by type</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {TYPE_FILTERS.map(f => {
            const active = typeFilter === f.value
            const tInfo = f.value !== 'ALL' ? typeColors[f.value] : null
            const activeBg    = active ? (tInfo ? c[tInfo.bg]   : c.blue)        : 'transparent'
            const activeText  = active ? (tInfo ? c[tInfo.text]  : '#fff')        : c.textPrimary
            const activeBorder = active ? (tInfo ? c[tInfo.text] : c.blue)        : c.border
            return (
              <TouchableOpacity
                key={f.value}
                style={[
                  styles.filterChip,
                  { borderColor: activeBorder },
                  active
                    ? { backgroundColor: activeBg }
                    : { backgroundColor: c.bgCard },
                ]}
                onPress={() => setTypeFilter(f.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.filterChipText, { color: activeText }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {loading
        ? <ActivityIndicator size="small" color={c.blue} style={{ marginTop: 40 }} />
        : <Text style={[styles.count, { color: c.textMuted }]}>{filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'}</Text>
      }

      {!loading && (
        <FlatList
          data={filtered}
          keyExtractor={o => o.id}
          renderItem={({ item }) => <OppCard opp={item} c={c} />}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 10,
    padding: 12, borderRadius: 10, borderWidth: 1,
  },
  errorTitle: { fontSize: 13, fontFamily: 'Geist-SemiBold' },
  errorSub: { fontSize: 11, fontFamily: 'Geist-Regular', marginTop: 1 },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: 'Geist-Regular',
  },

  filterWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  filterLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  filterLabel: { fontSize: 10, fontFamily: 'Geist-Medium', letterSpacing: 0.8, textTransform: 'uppercase' },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: { fontSize: 12, fontFamily: 'Geist-SemiBold' },

  count: { fontSize: 11, fontFamily: 'Geist-Regular', paddingHorizontal: 16, paddingBottom: 6 },
  list: { paddingHorizontal: 16, gap: 8 },

  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 10 },
  cardLeft: { flex: 1, gap: 4 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  typeBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  typeBadgeText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
  sponsoredBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, borderWidth: 1 },
  sponsoredText: { fontSize: 10, fontWeight: '500' },
  cardTitle: { fontSize: 14, fontFamily: 'Geist-SemiBold', lineHeight: 20 },
  cardCompany: { fontSize: 12, fontFamily: 'Geist-Medium' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginTop: 2 },
  cardMetaText: { fontSize: 11, fontFamily: 'Geist-Regular' },
  cardMetaDot: { fontSize: 11 },
  modeChip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  modeChipText: { fontSize: 10, fontWeight: '500' },

  cardBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  divider: { height: 1, marginBottom: 4 },
  description: { fontSize: 12, fontFamily: 'Geist-Regular', lineHeight: 18 },
  metaLine: { fontSize: 11, fontFamily: 'Geist-Regular' },
  applyBtn: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, marginTop: 2 },
  applyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
})
