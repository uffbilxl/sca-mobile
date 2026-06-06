import { useRef, useEffect, useState } from 'react'
import { Animated, View, Text, StyleSheet, Easing } from 'react-native'
import { colors } from '../lib/theme'

const ITEMS = [
  'Google', 'Open to all BCU Computing students', 'Amazon', 'Internships & Placements',
  'Apple', 'Graduate Schemes', 'Cloudflare', 'Spring Weeks & Insight Programmes',
  'Microsoft', 'Career Events & Workshops', 'Quantinuum', 'CV & Cover Letter Templates',
  'Arm', 'Networking Opportunities', 'DRW', 'Peer Mentorship',
  'IBM', 'Built by BCU students, for BCU students', 'Accenture', 'Community first',
  'Mastercard', 'For every computing student', 'BCU SCA', 'Start your tech career here',
]

export default function TickerBanner() {
  const translateX = useRef(new Animated.Value(0)).current
  const [halfWidth, setHalfWidth] = useState(0)
  const doubled = [...ITEMS, ...ITEMS]

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
    <View style={styles.wrapper}>
      <Animated.View
        style={{ flexDirection: 'row', transform: [{ translateX }] }}
        onLayout={e => setHalfWidth(e.nativeEvent.layout.width / 2)}
      >
        {doubled.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={[styles.text, i % 2 === 0 ? styles.textBlue : styles.textMuted]}>
              {item}
            </Text>
            <Text style={styles.sep}>·</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: 34,
    overflow: 'hidden',
    backgroundColor: colors.bg1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border1,
    borderBottomColor: colors.border1,
    justifyContent: 'center',
  },
  item: { flexDirection: 'row', alignItems: 'center', height: 34 },
  text: { fontSize: 10, marginHorizontal: 10, letterSpacing: 0.5, fontFamily: 'Geist-Regular' },
  textBlue: { color: '#58a6ff' },
  textMuted: { color: colors.t4 },
  sep: { color: colors.border1, fontSize: 9 },
})
