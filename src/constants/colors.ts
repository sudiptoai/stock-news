// App-wide color palette – dark financial theme
const Colors = {
  // Backgrounds
  background: '#0a0a1a',
  surface: '#12122a',
  card: '#1a1a35',
  cardAlt: '#1e1e40',

  // Brand
  primary: '#4f7cff',
  primaryLight: '#7a9fff',
  primaryDark: '#2d5be3',

  // Accent
  accent: '#00d4aa',
  accentLight: '#33ddb9',

  // Semantic
  positive: '#00c076',
  negative: '#ff4d6a',
  warning: '#ffaa00',
  neutral: '#8e8ea8',

  // Text
  textPrimary: '#f0f0ff',
  textSecondary: '#9898b8',
  textMuted: '#5a5a7a',

  // Borders
  border: '#2a2a4a',
  borderLight: '#3a3a5a',

  // Chart
  chartLine: '#4f7cff',
  chartFill: 'rgba(79,124,255,0.15)',

  // Overlay
  overlay: 'rgba(10,10,26,0.85)',
  cardShadow: 'rgba(0,0,0,0.4)',
} as const;

export default Colors;
