import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Sun, Moon, Search, SlidersHorizontal } from 'lucide-react-native'
import { useTheme } from '../lib/ThemeContext'

interface AppHeaderProps {
  variant?: 'brand' | 'screen'
  title?: string
  onSearchPress?: () => void
  onFilterPress?: () => void
}

export default function AppHeader({ variant = 'brand', title, onSearchPress, onFilterPress }: AppHeaderProps) {
  const { colors: c, isDark, toggle } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View style={[
      styles.header,
      {
        backgroundColor: c.bgHeader,
        borderBottomColor: c.border,
        paddingTop: insets.top + 8,
      },
    ]}>
      {/* Left */}
      {variant === 'brand' ? (
        <View style={styles.brand}>
          <View style={[styles.logoBox, { backgroundColor: '#0b1120' }]}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={[styles.wordmark, { color: c.textPrimary }]}>BCUSCA</Text>
        </View>
      ) : (
        <Text style={[styles.screenTitle, { color: c.textPrimary }]}>{title}</Text>
      )}

      {/* Right */}
      <View style={styles.right}>
        {variant === 'screen' && (
          <>
            {onSearchPress && (
              <TouchableOpacity
                onPress={onSearchPress}
                style={[styles.iconBtn, { backgroundColor: c.bgInput }]}
                accessibilityLabel="Search"
              >
                <Search size={18} color={c.textSecondary} strokeWidth={1.75} />
              </TouchableOpacity>
            )}
            {onFilterPress && (
              <TouchableOpacity
                onPress={onFilterPress}
                style={[styles.iconBtn, { backgroundColor: c.bgInput }]}
                accessibilityLabel="Filter"
              >
                <SlidersHorizontal size={18} color={c.textSecondary} strokeWidth={1.75} />
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={toggle}
          style={[styles.iconBtn, { backgroundColor: c.bgInput }]}
          accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun size={18} color={c.textSecondary} strokeWidth={1.75} />
            : <Moon size={18} color={c.textSecondary} strokeWidth={1.75} />
          }
        </TouchableOpacity>

        {variant === 'brand' && (
          <TouchableOpacity
            style={[styles.joinPill, { backgroundColor: c.blue }]}
            onPress={() => Linking.openURL('https://www.linkedin.com/company/bcu-student-computing-association/')}
            accessibilityLabel="Join SCA"
          >
            <Text style={styles.joinText}>Join SCA</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontSize: 14, fontFamily: 'Geist-Bold' },
  wordmark: { fontSize: 15, fontFamily: 'Geist-Bold', letterSpacing: -0.3 },
  screenTitle: { fontSize: 18, fontFamily: 'Geist-Bold', letterSpacing: -0.4 },

  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  joinText: { color: '#fff', fontSize: 12, fontFamily: 'Geist-SemiBold' },
})
