import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useTheme } from '../lib/ThemeContext'

interface OrbProps {
  color: string
  size: number
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
}

function Orb({ color, size, startX, startY, endX, endY, duration }: OrbProps) {
  const x = useRef(new Animated.Value(startX)).current
  const y = useRef(new Animated.Value(startY)).current

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(x, { toValue: endX, duration, useNativeDriver: false, isInteraction: false }),
          Animated.timing(y, { toValue: endY, duration, useNativeDriver: false, isInteraction: false }),
        ]),
        Animated.parallel([
          Animated.timing(x, { toValue: startX, duration, useNativeDriver: false, isInteraction: false }),
          Animated.timing(y, { toValue: startY, duration, useNativeDriver: false, isInteraction: false }),
        ]),
      ])
    )
    anim.start()
    return () => anim.stop()
  }, [])

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        left: x,
        top: y,
      }}
    />
  )
}

export default function AnimatedBackground() {
  const { isDark } = useTheme()
  const a = isDark ? '0e' : '09'

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Orb color={`#c8b89a${a}`} size={300} startX={-80} startY={-60} endX={10}  endY={40}  duration={14000} />
      <Orb color={`#3fb68b${a}`} size={240} startX={160} startY={320} endX={110} endY={400} duration={11500} />
      <Orb color={`#a89070${a}`} size={200} startX={40}  startY={580} endX={90}  endY={500} duration={9800}  />
    </View>
  )
}
