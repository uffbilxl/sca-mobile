import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Easing, Platform, View } from 'react-native'

const nd = Platform.OS !== 'web'

interface Props {
  onDone: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const screenOpacity = useRef(new Animated.Value(1)).current
  const scaScale    = useRef(new Animated.Value(0.82)).current
  const scaOpacity  = useRef(new Animated.Value(0)).current
  const subOpacity  = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      // SCA slides in
      Animated.parallel([
        Animated.timing(scaScale, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: nd,
        }),
        Animated.timing(scaOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: nd,
        }),
      ]),
      // Subtitle fades in
      Animated.timing(subOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: nd,
      }),
      // Hold
      Animated.delay(900),
      // Fade out whole screen
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.in(Easing.quad),
        useNativeDriver: nd,
      }),
    ]).start(() => onDone())
  }, [])

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.sca,
            { opacity: scaOpacity, transform: [{ scale: scaScale }] },
          ]}
        >
          SCA
        </Animated.Text>
        <Animated.Text style={[styles.sub, { opacity: subOpacity }]}>
          Student Computing Association
        </Animated.Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0ece6',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 14,
  },
  sca: {
    fontSize: 96,
    fontFamily: 'Geist-Bold',
    color: '#1a1814',
    letterSpacing: -2,
  },
  sub: {
    fontSize: 14,
    fontFamily: 'Geist-Regular',
    color: '#4a4540',
    letterSpacing: 0.5,
  },
})
