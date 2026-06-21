export const lightTokens = {
  bgPage:        '#f0ece6',
  bgCard:        '#faf8f5',
  bgHeader:      '#f5f1eb',
  bgInput:       '#e8e4de',
  border:        '#ddd9d2',
  textPrimary:   '#1a1814',
  textSecondary: '#4a4540',
  textMuted:     '#9e9891',
  blue:          '#2b6cb0',
  blueLight:     '#e8eff8',
  blueText:      '#1e4d8c',
  greenBg:       '#edf7f0',
  greenText:     '#166534',
  purpleBg:      '#f3f0fb',
  purpleText:    '#5b21b6',
  shadow:        'rgba(26,24,20,0.06)',
  shadow2:       'rgba(26,24,20,0.04)',
  isDark:        false as boolean,
}

export const darkTokens = {
  bgPage:        '#161412',
  bgCard:        '#1e1c19',
  bgHeader:      '#1a1814',
  bgInput:       '#252220',
  border:        '#302d2a',
  textPrimary:   '#f0ece6',
  textSecondary: '#a89f96',
  textMuted:     '#6b6460',
  blue:          '#5b9bd5',
  blueLight:     '#1a2535',
  blueText:      '#8bbae8',
  greenBg:       '#0f2418',
  greenText:     '#4ade80',
  purpleBg:      '#1c1428',
  purpleText:    '#c4b5fd',
  shadow:        'rgba(0,0,0,0.35)',
  shadow2:       'rgba(0,0,0,0.25)',
  isDark:        true as boolean,
}

export type ThemeTokens = typeof lightTokens

export const colors = darkTokens as ThemeTokens

export const typeColors: Record<string, { bg: keyof ThemeTokens; text: keyof ThemeTokens }> = {
  INTERNSHIP:  { bg: 'blueLight', text: 'blueText' },
  PLACEMENT:   { bg: 'blueLight', text: 'blueText' },
  GRADUATE:    { bg: 'greenBg',   text: 'greenText' },
  SPRING_WEEK: { bg: 'purpleBg',  text: 'purpleText' },
  INSIGHT:     { bg: 'blueLight', text: 'blueText' },
}

export const typeLabels: Record<string, string> = {
  INTERNSHIP:  'Internship',
  PLACEMENT:   'Placement',
  GRADUATE:    'Graduate',
  SPRING_WEEK: 'Spring Week',
  INSIGHT:     'Insight',
}

export const fonts = {
  light:    'Geist-Light',
  regular:  'Geist-Regular',
  medium:   'Geist-Medium',
  semiBold: 'Geist-SemiBold',
  bold:     'Geist-Bold',
}

export const teal = '#3fb68b'
