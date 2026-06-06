import { useRef, useEffect, useState } from 'react'
import { Animated, View, Text, StyleSheet, Easing, Platform } from 'react-native'
import { useTheme } from '../lib/ThemeContext'

const ITEMS = [
  'Google', 'Open to all BCU Computing students', 'Amazon', 'Internships & Placements',
  'Apple', 'Graduate Schemes', 'Cloudflare', 'Spring Weeks & Insight Programmes',
  'Microsoft', 'Career Events & Workshops', 'Quantinuum', 'CV & Cover Letter Templates',
  'Arm', 'Networking Opportunities', 'DRW', 'Peer Mentorship',
  'IBM', 'Built by BCU students, for BCU students', 'Accenture', 'Community first',
  'Mastercard', 'For every computing student', 'BCU SCA', 'Start your tech career here',
]

const doubled = [...ITEMS, ...ITEMS]

const HIGHLIGHTED = new Set(['Google', 'Amazon', 'Apple', 'Microsoft', 'Quantinuum', 'Arm', 'DRW', 'IBM', 'Accenture', 'Mastercard', 'Cloudflare'])

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const id = 'sca-ticker-kf'
  if (!document.getElementById(id)) {
    const el = document.createElement('style')
    el.id = id
    el.textContent = `@keyframes scaTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`
    document.head.appendChild(el)
  }
}

function WebTicker({ blueColor, mutedColor, borderColor, bg }: { blueColor: string; mutedColor: string; borderColor: string; bg: string }) {
  return (
    <View style={[styles.wrapper, { backgroundColor: bg, borderTopColor: borderColor, borderBottomColor: borderColor }]}>
      <View
        style={[styles.webRow, {
          animationName: 'scaTicker',
          animationDuration: '32s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        } as any]}
      >
        {doubled.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, { color: HIGHLIGHTED.has(item) ? blueColor : mutedColor }]}>{item}</Text>
            <Text style={[styles.sep, { color: borderColor }]}>·</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

function NativeTicker({ blueColor, mutedColor, borderColor, bg }: { blueColor: string; mutedColor: string; borderColor: string; bg: string }) {
  const translateX = useRef(new Animated.Value(0)).current
  const [halfWidth, setHalfWidth] = useState(0)

  useEffect(() => {
    if (halfWidth === 0) return
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -halfWidth,
        duration: halfWidth * 16,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    )
    anim.start()
    return () => anim.stop()
  }, [halfWidth])

  return (
    <View style={[styles.wrapper, { backgroundColor: bg, borderTopColor: borderColor, borderBottomColor: borderColor }]}>
      <Animated.View
        style={[styles.webRow, { transform: [{ translateX }] }]}
        onLayout={e => setHalfWidth(e.nativeEvent.layout.width / 2)}
      >
        {doubled.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, { color: HIGHLIGHTED.has(item) ? blueColor : mutedColor }]}>{item}</Text>
            <Text style={[styles.sep, { color: borderColor }]}>·</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

export default function TickerBanner() {
  const { colors: c } = useTheme()
  const props = { blueColor: c.blue, mutedColor: c.textMuted, borderColor: c.border, bg: c.bgCard }
  return Platform.OS === 'web' ? <WebTicker {...props} /> : <NativeTicker {...props} />
}

const styles = StyleSheet.create({
  wrapper: {
    height: 34,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  webRow: { flexDirection: 'row', alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', height: 34 },
  text: { fontSize: 10, marginHorizontal: 10, letterSpacing: 0.5, fontFamily: 'Geist-Regular' },
  sep: { fontSize: 9 },
})
