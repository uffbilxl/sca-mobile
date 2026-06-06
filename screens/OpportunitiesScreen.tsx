import { useState, useMemo } from 'react'
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, FlatList, Linking,
  LayoutAnimation, Platform, UIManager,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors, typeColors, typeLabels, modeColors } from '../lib/theme'
import { OPPORTUNITIES } from '../lib/data'
import type { OpportunityType } from '../lib/types'

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

function OppCard({ opp }: { opp: typeof OPPORTUNITIES[0] }) {
  const [open, setOpen] = useState(false)
  const tColor = typeColors[opp.type] ?? colors.accent
  const mColor = modeColors[opp.workMode] ?? colors.t4

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
    <View style={[styles.card, open && { borderColor: `${tColor}35` }]}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.75} style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <View style={styles.cardTopRow}>
            <View style={[styles.typeBadge, { backgroundColor: `${tColor}15`, borderColor: `${tColor}35` }]}>
              <Text style={[styles.typeBadgeText, { color: tColor }]}>{typeLabels[opp.type]}</Text>
            </View>
            {opp.sponsored && (
              <View style={styles.sponsoredBadge}>
                <Text style={styles.sponsoredText}>Sponsored</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardTitle} numberOfLines={open ? undefined : 2}>{opp.title}</Text>
          <Text style={styles.cardCompany}>{opp.company.name}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardMetaText}>{opp.location}</Text>
            <Text style={styles.cardMetaDot}>·</Text>
            <View style={[styles.modeChip, { backgroundColor: `${mColor}18` }]}>
              <Text style={[styles.modeChipText, { color: mColor }]}>{opp.workMode}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.cardBody}>
          <View style={styles.divider} />
          <Text style={styles.description}>{opp.description}</Text>
          {opp.startDate && (
            <Text style={styles.metaLine}>Start: {opp.startDate}</Text>
          )}
          {opp.applyUrl && (
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: tColor }]}
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
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'ALL'>('ALL')

  const filtered = useMemo(() => {
    return OPPORTUNITIES.filter(o => {
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.eyebrow}>BCU Computing</Text>
        <Text style={styles.pageTitle}>Opportunities</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by role, company or location..."
          placeholderTextColor={colors.t4}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Type filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}
      >
        {TYPE_FILTERS.map(f => {
          const active = typeFilter === f.value
          const tColor = f.value !== 'ALL' ? (typeColors[f.value] ?? colors.accent) : colors.accent
          return (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterChip,
                active && { backgroundColor: `${tColor}15`, borderColor: `${tColor}40` },
              ]}
              onPress={() => setTypeFilter(f.value)}
            >
              <Text style={[styles.filterChipText, active && { color: tColor, fontWeight: '700' }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <Text style={styles.count}>{filtered.length} opportunities</Text>

      <FlatList
        data={filtered}
        keyExtractor={o => o.id}
        renderItem={({ item }) => <OppCard opp={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg1 },

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border1,
  },
  eyebrow: { fontSize: 9, color: colors.accent, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Geist-Medium', marginBottom: 3 },
  pageTitle: { fontSize: 22, fontFamily: 'Geist-Bold', color: colors.t1, letterSpacing: -0.5 },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchInput: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.t1,
  },

  filterScroll: { flexGrow: 0 },
  filterRow: { paddingLeft: 16, paddingRight: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    marginRight: 8,
  },
  filterChipText: { fontSize: 12, color: colors.t3, fontWeight: '500' },

  count: { fontSize: 11, color: colors.t4, paddingHorizontal: 16, paddingBottom: 6 },
  list: { paddingHorizontal: 16, gap: 8 },

  card: {
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 10,
  },
  cardLeft: { flex: 1, gap: 4 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  typeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  typeBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  sponsoredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: `${colors.t4}12`,
    borderWidth: 1,
    borderColor: `${colors.t4}22`,
  },
  sponsoredText: { fontSize: 9, color: colors.t4, fontWeight: '600', letterSpacing: 0.4 },
  cardTitle: { fontSize: 14, fontFamily: 'Geist-SemiBold', color: colors.t1, lineHeight: 20 },
  cardCompany: { fontSize: 12, color: colors.accent, fontFamily: 'Geist-Medium' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardMetaText: { fontSize: 11, color: colors.t3 },
  cardMetaDot: { fontSize: 11, color: colors.t4 },
  modeChip: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  modeChipText: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4 },
  chevron: { fontSize: 10, color: colors.t4, marginTop: 2 },

  cardBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
  divider: { height: 1, backgroundColor: colors.border1, marginBottom: 4 },
  description: { fontSize: 12, color: colors.t2, lineHeight: 18 },
  metaLine: { fontSize: 11, color: colors.t3 },
  applyBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    marginTop: 2,
  },
  applyBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
})
