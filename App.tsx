import { useState, useRef, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar, Text, View, TouchableOpacity, StyleSheet, ScrollView, Switch, Animated } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { House, Briefcase, Star, Calendar, Ellipsis, ChevronRight, Users, FileText, Info, Sun, Moon } from 'lucide-react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { ThemeProvider, useTheme } from './lib/ThemeContext'
import SplashScreen from './components/SplashScreen'
import AppHeader from './components/AppHeader'

import HomeScreen from './screens/HomeScreen'
import OpportunitiesScreen from './screens/OpportunitiesScreen'
import SCAScreen from './screens/SCAScreen'
import EventsScreen from './screens/EventsScreen'
import CommitteeScreen from './screens/CommitteeScreen'
import ResourcesScreen from './screens/ResourcesScreen'
import AboutScreen from './screens/AboutScreen'

const Tab = createBottomTabNavigator()
const MoreStack = createNativeStackNavigator()

function withFade<P extends object>(Component: React.ComponentType<P>) {
  return function FadedScreen(props: P) {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(10)).current
    useFocusEffect(
      useCallback(() => {
        opacity.setValue(0)
        translateY.setValue(10)
        Animated.parallel([
          Animated.timing(opacity,     { toValue: 1, duration: 240, useNativeDriver: false }),
          Animated.timing(translateY,  { toValue: 0, duration: 240, useNativeDriver: false }),
        ]).start()
      }, [])
    )
    return (
      <Animated.View style={{ flex: 1, opacity, transform: [{ translateY }] }}>
        <Component {...(props as any)} />
      </Animated.View>
    )
  }
}

const TAB_ICONS: Record<string, any> = {
  Home:          House,
  Opportunities: Briefcase,
  SCA:           Star,
  Events:        Calendar,
  More:          Ellipsis,
}

function MoreHomeScreen() {
  const navigation = useNavigation<any>()
  const { colors: c, isDark, toggle } = useTheme()

  const items = [
    { label: 'Committee', desc: 'Meet the people behind the SCA', screen: 'Committee', icon: Users },
    { label: 'Resources', desc: 'CV templates, cover letters & guides', screen: 'Resources', icon: FileText },
    { label: 'About', desc: 'Who we are and what we do', screen: 'About', icon: Info },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: c.bgPage }}>
      <AppHeader variant="brand" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 8 }} showsVerticalScrollIndicator={false}>
        {items.map(item => {
          const Icon = item.icon
          return (
            <TouchableOpacity
              key={item.screen}
              style={[moreStyles.card, { backgroundColor: c.bgCard, borderColor: c.border }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.75}
            >
              <View style={[moreStyles.iconBox, { backgroundColor: c.blueLight }]}>
                <Icon size={18} color={c.blue} strokeWidth={1.75} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[moreStyles.label, { color: c.textPrimary }]}>{item.label}</Text>
                <Text style={[moreStyles.desc, { color: c.textMuted }]}>{item.desc}</Text>
              </View>
              <ChevronRight size={16} color={c.textMuted} strokeWidth={1.75} />
            </TouchableOpacity>
          )
        })}

        {/* Appearance */}
        <View style={[moreStyles.section, { borderTopColor: c.border }]}>
          <Text style={[moreStyles.sectionLabel, { color: c.textMuted }]}>APPEARANCE</Text>
        </View>
        <View style={[moreStyles.card, moreStyles.cardRow, { backgroundColor: c.bgCard, borderColor: c.border }]}>
          <View style={[moreStyles.iconBox, { backgroundColor: c.bgInput }]}>
            {isDark
              ? <Sun size={18} color={c.textSecondary} strokeWidth={1.75} />
              : <Moon size={18} color={c.textSecondary} strokeWidth={1.75} />}
          </View>
          <Text style={[moreStyles.label, { color: c.textPrimary, flex: 1 }]}>Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggle}
            trackColor={{ false: c.border, true: c.blue }}
            thumbColor="#fff"
          />
        </View>

        <Text style={[moreStyles.version, { color: c.textMuted }]}>BCUSCA v1.0.0</Text>
      </ScrollView>
    </View>
  )
}

const moreStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    shadowColor: '#0b1120',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRow: { justifyContent: 'space-between' },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: { fontSize: 14, fontFamily: 'Geist-SemiBold', marginBottom: 2 },
  desc: { fontSize: 11, fontFamily: 'Geist-Regular' },
  section: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  sectionLabel: { fontSize: 10, fontFamily: 'Geist-Medium', letterSpacing: 1.2, textTransform: 'uppercase' },
  version: { fontSize: 11, fontFamily: 'Geist-Regular', textAlign: 'center', marginTop: 16 },
})

function MoreStackNavigator() {
  const { colors: c } = useTheme()
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: c.bgPage },
        animation: 'slide_from_right',
        animationDuration: 280,
      }}
    >
      <MoreStack.Screen name="MoreHome" component={MoreHomeScreen} />
      <MoreStack.Screen name="Committee" component={CommitteeScreen} />
      <MoreStack.Screen name="Resources" component={ResourcesScreen} />
      <MoreStack.Screen name="About" component={AboutScreen} />
    </MoreStack.Navigator>
  )
}

function ThemedApp() {
  const [splashDone, setSplashDone] = useState(false)
  const { colors: c, isDark } = useTheme()

  const [fontsLoaded] = useFonts({
    'Geist-Light':    require('./assets/fonts/Geist-Light.ttf'),
    'Geist-Regular':  require('./assets/fonts/Geist-Regular.ttf'),
    'Geist-Medium':   require('./assets/fonts/Geist-Medium.ttf'),
    'Geist-SemiBold': require('./assets/fonts/Geist-SemiBold.ttf'),
    'Geist-Bold':     require('./assets/fonts/Geist-Bold.ttf'),
  })

  if (!fontsLoaded) return null

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={c.bgHeader}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color }) => {
              const Icon = TAB_ICONS[route.name]
              return Icon ? <Icon size={20} color={color} strokeWidth={focused ? 2.25 : 1.75} accessibilityLabel={route.name} /> : null
            },
            tabBarStyle: {
              backgroundColor: c.bgHeader,
              borderTopColor: c.border,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: c.blue,
            tabBarInactiveTintColor: c.textMuted,
            tabBarLabelStyle: { fontSize: 10, fontFamily: 'Geist-Medium' } as any,
          })}
        >
          <Tab.Screen name="Home" component={withFade(HomeScreen)} options={{ title: 'Home' }} />
          <Tab.Screen name="Opportunities" component={withFade(OpportunitiesScreen)} />
          <Tab.Screen name="Events" component={withFade(EventsScreen)} />
          <Tab.Screen name="SCA" component={withFade(SCAScreen)} options={{ title: 'SCA Roles' }} />
          <Tab.Screen name="More" component={MoreStackNavigator} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>

      {!splashDone && fontsLoaded && (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}
    </>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
