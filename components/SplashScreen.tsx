import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, Dimensions, Easing, Image, Platform } from 'react-native'
import { colors, fonts } from '../lib/theme'

const nd = Platform.OS !== 'web'

const { width } = Dimensions.get('window')

const TICKER_ITEMS = [
  'Google', 'Amazon', 'Apple', 'Microsoft', 'Cloudflare', 'Quantinuum',
  'Arm', 'DRW', 'Accenture', 'Palantir', 'Goldman Sachs', 'Mastercard',
  'IBM', 'Capgemini', 'EY', 'KPMG', 'NatWest', 'Deliveroo',
]

function TickerText() {
  const translateX = useRef(new Animated.Value(0)).current
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  const itemWidth = 120
  const totalWidth = TICKER_ITEMS.length * itemWidth

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -totalWidth,
        duration: totalWidth * 20,
        useNativeDriver: nd,
        easing: Easing.linear,
      })
    ).start()
  }, [])

  return (
    <View style={styles.tickerWrap}>
      <Animated.View style={[styles.tickerRow, { transform: [{ translateX }] }]}>
        {doubled.map((item, i) => (
          <Text key={i} style={styles.tickerItem}>{item}  ·  </Text>
        ))}
      </Animated.View>
    </View>
  )
}

interface Props {
  onDone: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const logoOpacity = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.85)).current
  const pillOpacity = useRef(new Animated.Value(0)).current
  const pillY = useRef(new Animated.Value(12)).current
  const headingOpacity = useRef(new Animated.Value(0)).current
  const headingY = useRef(new Animated.Value(14)).current
  const taglineOpacity = useRef(new Animated.Value(0)).current
  const taglineY = useRef(new Animated.Value(14)).current
  const screenOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(100),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: nd }),
        Animated.timing(logoScale, { toValue: 1, duration: 600, easing: Easing.out(Easing.back(1.4)), useNativeDriver: nd }),
      ]),
      Animated.delay(0),
      Animated.parallel([
        Animated.timing(pillOpacity, { toValue: 1, duration: 380, useNativeDriver: nd }),
        Animated.timing(pillY, { toValue: 0, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: nd }),
      ]),
      Animated.delay(50),
      Animated.parallel([
        Animated.timing(headingOpacity, { toValue: 1, duration: 380, useNativeDriver: nd }),
        Animated.timing(headingY, { toValue: 0, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: nd }),
      ]),
      Animated.delay(50),
      Animated.parallel([
        Animated.timing(taglineOpacity, { toValue: 1, duration: 380, useNativeDriver: nd }),
        Animated.timing(taglineY, { toValue: 0, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: nd }),
      ]),
      Animated.delay(1200),
      Animated.timing(screenOpacity, { toValue: 0, duration: 400, useNativeDriver: nd }),
    ]).start(() => onDone())
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      {/* Teal glow — bottom left */}
      <View pointerEvents="none" style={[styles.glowBase, styles.glowTeal]} />
      {/* Purple glow — bottom right */}
      <View pointerEvents="none" style={[styles.glowBase, styles.glowPurple]} />

      {/* Ticker at bottom */}
      <View style={styles.tickerContainer} pointerEvents="none">
        <TickerText />
      </View>

      {/* Centre content */}
      <View style={styles.centre}>
        {/* Logo */}
        <Animated.View style={[styles.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Image
            source={{ uri: 'https://bcusca.org/sca-logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* BCU Pill */}
        <Animated.View style={[styles.pillWrap, { opacity: pillOpacity, transform: [{ translateY: pillY }] }]}>
          <View style={styles.pill}>
            <View style={styles.greenDot} />
            <Text style={styles.pillText}>BIRMINGHAM CITY UNIVERSITY · STUDENT COMPUTING ASSOCIATION</Text>
          </View>
        </Animated.View>

        {/* Heading */}
        <Animated.Text style={[styles.heading, { opacity: headingOpacity, transform: [{ translateY: headingY }] }]}>
          Student Computing Association
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity, transform: [{ translateY: taglineY }] }]}>
          From your first lecture to your first offer.
        </Animated.Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },

  glowBase: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
  },
  glowTeal: {
    bottom: -width * 0.5,
    left: -width * 0.4,
    backgroundColor: 'rgba(13,110,89,0.35)',
  },
  glowPurple: {
    bottom: -width * 0.5,
    right: -width * 0.4,
    backgroundColor: 'rgba(88,28,135,0.4)',
  },

  tickerContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    opacity: 0.2,
  },
  tickerWrap: { height: 24, overflow: 'hidden' },
  tickerRow: { flexDirection: 'row', alignItems: 'center' },
  tickerItem: { fontSize: 11, color: '#8b949e', letterSpacing: 0.5, width: 120 },

  centre: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },

  logoWrap: { marginBottom: 8 },
  logo: { width: 72, height: 72 },

  pillWrap: { alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3fb68b',
  },
  pillText: {
    fontSize: 9,
    color: '#8b949e',
    fontFamily: 'Geist-Regular',
    letterSpacing: 0.5,
  },

  heading: {
    fontSize: 26,
    color: '#ffffff',
    fontFamily: 'Geist-Bold',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 32,
  },

  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Geist-Light',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
})
