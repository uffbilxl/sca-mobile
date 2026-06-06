import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import { colors, fonts } from './lib/theme'
import SplashScreen from './components/SplashScreen'

import HomeScreen from './screens/HomeScreen'
import OpportunitiesScreen from './screens/OpportunitiesScreen'
import SCAScreen from './screens/SCAScreen'
import EventsScreen from './screens/EventsScreen'
import CommitteeScreen from './screens/CommitteeScreen'
import ResourcesScreen from './screens/ResourcesScreen'
import AboutScreen from './screens/AboutScreen'

const Tab = createBottomTabNavigator()
const MoreStack = createNativeStackNavigator()

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Opportunities: '◈',
    SCA: '★',
    Events: '◷',
    More: '···',
  }
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: name === 'More' ? 10 : 16, color: focused ? colors.accent : colors.t4, fontFamily: 'Geist-Regular' }}>
        {icons[name] ?? '●'}
      </Text>
    </View>
  )
}

import { useNavigation } from '@react-navigation/native'

function MoreHomeScreen() {
  const navigation = useNavigation<any>()
  const items = [
    { label: 'Committee', desc: 'Meet the people behind the SCA', screen: 'Committee' },
    { label: 'Resources', desc: 'CV templates, cover letters & guides', screen: 'Resources' },
    { label: 'About', desc: 'Who we are and what we do', screen: 'About' },
  ]
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 8 }}>
      {items.map(item => (
        <TouchableOpacity
          key={item.screen}
          style={moreStyles.card}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.75}
        >
          <View style={{ flex: 1 }}>
            <Text style={moreStyles.label}>{item.label}</Text>
            <Text style={moreStyles.desc}>{item.desc}</Text>
          </View>
          <Text style={moreStyles.arrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const moreStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  label: { fontSize: 14, fontWeight: '700', color: colors.t1, marginBottom: 2, fontFamily: 'Geist-Bold' },
  desc: { fontSize: 11, color: colors.t4, fontFamily: 'Geist-Regular' },
  arrow: { fontSize: 16, color: colors.t4 },
})

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg1 },
        headerTintColor: colors.t1,
        headerTitleStyle: { fontWeight: '700', fontSize: 17, fontFamily: 'Geist-Bold' } as any,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg1 },
      }}
    >
      <MoreStack.Screen name="MoreHome" component={MoreHomeScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Committee" component={CommitteeScreen} options={{ title: 'Committee' }} />
      <MoreStack.Screen name="Resources" component={ResourcesScreen} options={{ title: 'Resources' }} />
      <MoreStack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </MoreStack.Navigator>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  const [fontsLoaded] = useFonts({
    'Geist-Light':    require('./assets/fonts/Geist-Light.ttf'),
    'Geist-Regular':  require('./assets/fonts/Geist-Regular.ttf'),
    'Geist-Medium':   require('./assets/fonts/Geist-Medium.ttf'),
    'Geist-SemiBold': require('./assets/fonts/Geist-SemiBold.ttf'),
    'Geist-Bold':     require('./assets/fonts/Geist-Bold.ttf'),
  })

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg1} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
            tabBarStyle: {
              backgroundColor: colors.bg1,
              borderTopColor: colors.border1,
              borderTopWidth: 1,
              height: 60,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.t4,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '600', fontFamily: 'Geist-Medium' } as any,
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'SCA' }} />
          <Tab.Screen name="Opportunities" component={OpportunitiesScreen} />
          <Tab.Screen name="SCA" component={SCAScreen} options={{ title: 'SCA Roles' }} />
          <Tab.Screen name="Events" component={EventsScreen} />
          <Tab.Screen name="More" component={MoreStackNavigator} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>

      {!splashDone && fontsLoaded && (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}
    </SafeAreaProvider>
  )
}
