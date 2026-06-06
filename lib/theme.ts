export const lightTokens = {
  bgPage:        '#f4f6f9',
  bgCard:        '#ffffff',
  bgHeader:      '#ffffff',
  bgInput:       '#f1f5f9',
  border:        '#e4e9f0',
  textPrimary:   '#0b1120',
  textSecondary: '#4a5568',
  textMuted:     '#8896aa',
  blue:          '#4a82f0',
  blueLight:     '#edf2fe',
  blueText:      '#3a6bcc',
  greenBg:       '#edfaf3',
  greenText:     '#15803d',
  purpleBg:      '#f5f0fe',
  purpleText:    '#6d28d9',
  shadow:        'rgba(11,17,32,0.06)',
  shadow2:       'rgba(11,17,32,0.04)',
  isDark:        false as boolean,
}

export const darkTokens = {
  bgPage:        '#0b1120',
  bgCard:        '#111928',
  bgHeader:      '#0f1827',
  bgInput:       '#1a2540',
  border:        '#1e2d45',
  textPrimary:   '#f0f4ff',
  textSecondary: '#8da0bc',
  textMuted:     '#4a6080',
  blue:          '#4a82f0',
  blueLight:     '#1a2d52',
  blueText:      '#7baaf5',
  greenBg:       '#0d2a1a',
  greenText:     '#4ade80',
  purpleBg:      '#1e1040',
  purpleText:    '#a78bfa',
  shadow:        'rgba(0,0,0,0.3)',
  shadow2:       'rgba(0,0,0,0.2)',
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
