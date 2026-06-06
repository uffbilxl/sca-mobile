# BCUSCA — Birmingham City University Student Computing Association

> The official mobile app for BCU's Student Computing Association. Built for every BCU computing student — from first year to first offer.

[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-blue)](https://bcusca.org)
[![Built with Expo](https://img.shields.io/badge/built%20with-Expo%20SDK%2054-black)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)](https://reactnative.dev)

---

## Overview

BCUSCA is a career and community hub for BCU computing students. The app surfaces internships, placements, graduate roles, upcoming events, committee members, and downloadable career resources — all in one place, with a clean light/dark UI built on Geist Sans.

---

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Hero overview with featured opportunities, strand cards, and a live ticker of partner companies |
| **Opportunities** | Full job board with type filters (Internship, Placement, Graduate, Part-time) and search |
| **Events** | Upcoming SCA events with countdown timers, location info, and RSVP links |
| **SCA Roles** | Live-synced internal SCA volunteer opportunities from Firestore |
| **Committee** | Meet the team — leadership and division members with LinkedIn links |
| **Resources** | Downloadable CV templates and cover letter (linked directly to bcusca.org) |
| **About** | Mission, values, and what the SCA does |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) SDK 54 |
| Language | TypeScript |
| Navigation | React Navigation v7 (Bottom Tabs + Native Stack) |
| Icons | [Lucide React Native](https://lucide.dev) |
| Font | Geist Sans (Light → Bold) |
| Theme | Custom `ThemeProvider` with AsyncStorage persistence |
| Backend | Firebase Firestore (SCA Roles screen) |
| Animation | React Native `Animated` — ambient background orbs + transition fades |

---

## Project Structure

```
├── App.tsx                     # Root navigator, tab config, theme wrapper
├── screens/
│   ├── HomeScreen.tsx
│   ├── OpportunitiesScreen.tsx
│   ├── EventsScreen.tsx
│   ├── SCAScreen.tsx           # Firestore-backed live roles
│   ├── CommitteeScreen.tsx
│   ├── ResourcesScreen.tsx
│   └── AboutScreen.tsx
├── components/
│   ├── AppHeader.tsx           # Shared header with auto back button + theme toggle
│   ├── AnimatedBackground.tsx  # Ambient drifting orb background
│   ├── OpportunityCard.tsx
│   ├── TickerBanner.tsx
│   └── SplashScreen.tsx
├── lib/
│   ├── theme.ts                # Light + dark token sets
│   ├── ThemeContext.tsx        # ThemeProvider + useTheme hook
│   ├── data.ts                 # Static opportunities data
│   ├── firestore.ts            # Firestore helpers
│   ├── firebase.ts             # Firebase config
│   └── types.ts
└── assets/
    └── fonts/                  # Geist Sans (5 weights)
```

---

## Design System

- **Light & dark mode** — persisted via AsyncStorage, toggled from any screen header
- **Token-based colours** — all colours reference `lightTokens` / `darkTokens` from `lib/theme.ts`, never hardcoded
- **Always-dark sections** — hero cards and CTAs stay dark in both modes (brand consistency)
- **Animated background** — 3 slow-drifting colour orbs (blue `#3b82f6`, teal `#3fb68b`, indigo `#6366f1`) float behind every screen at ~5% opacity
- **Navigation transitions** — tab switches use a 130ms opacity fade (0.88 → 1); stack pushes use `slide_from_right`

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your device (for physical device testing)

### Install

```bash
git clone https://github.com/uffbilxl/sca-mobile.git
cd sca-mobile
npm install
```

### Run

```bash
# Web (browser)
npm start

# iOS (requires Mac + Xcode or Expo Go)
npm run ios

# Android (requires Android Studio or Expo Go)
npm run android
```

Scan the QR code in your terminal with the **Expo Go** app to preview on a real device instantly.

---

## Firebase Setup

The SCA Roles screen reads from Firestore. To connect your own Firebase project:

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Cloud Firestore**
3. Replace the config in `lib/firebase.ts` with your project's credentials
4. The `seedIfEmpty` helper in `lib/firestore.ts` will auto-populate sample data on first load

---

## Links

- Website — [bcusca.org](https://bcusca.org)
- LinkedIn — [BCU Student Computing Association](https://www.linkedin.com/company/bcu-student-computing-association/)
- Join the committee — [tally.so/r/681g7e](https://tally.so/r/681g7e)

---

*Not affiliated with BCUSU, BCU Computer Science Society, or BCU Cyber Security Society.*
