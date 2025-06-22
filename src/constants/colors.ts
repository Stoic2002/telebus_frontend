// Color Constants for consistent UI theming across the application

export const GRADIENTS = {
  blue: 'from-blue-500 to-blue-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600',
  green: 'from-green-500 to-green-500',
  amber: 'from-amber-500 to-amber-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  pink: 'from-pink-500 to-pink-600',
  teal: 'from-teal-500 to-emerald-600',
  slate: 'from-slate-800 to-slate-700',
  // Weather specific gradients
  weather: {
    temperature: 'from-red-500 to-orange-500',
    humidity: 'from-blue-500 to-cyan-500',
    wind: 'from-teal-500 to-emerald-500',
    pressure: 'from-purple-500 to-indigo-500',
    radiation: 'from-amber-500 to-yellow-500',
    evaporation: 'from-indigo-500 to-blue-500'
  },
  // PBS specific gradients
  pbs: {
    load: 'from-purple-500 to-indigo-600',
    outflow: 'from-blue-500 to-cyan-600',
    inflow: 'from-emerald-500 to-teal-600',
    dam: 'from-slate-500 to-gray-600',
    outflowTotal: 'from-orange-500 to-red-600'
  },
  // Rainfall specific gradients
  rainfall: {
    garung: 'from-blue-500 to-indigo-600',
    singomerto: 'from-cyan-500 to-blue-600',
    tulis: 'from-teal-500 to-emerald-600',
    mrica: 'from-purple-500 to-indigo-600'
  }
} as const;

export const BG_COLORS = {
  blue: 'bg-blue-50',
  cyan: 'bg-cyan-50',
  emerald: 'bg-emerald-50',
  green: 'bg-green-50',
  amber: 'bg-amber-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
  purple: 'bg-purple-50',
  indigo: 'bg-indigo-50',
  pink: 'bg-pink-50',
  teal: 'bg-teal-50',
  gray: 'bg-gray-50',
  slate: 'bg-slate-50'
} as const;

export const TEXT_COLORS = {
  blue: 'text-blue-700',
  cyan: 'text-cyan-700',
  emerald: 'text-emerald-700',
  green: 'text-green-700',
  amber: 'text-amber-700',
  orange: 'text-orange-700',
  red: 'text-red-700',
  purple: 'text-purple-700',
  indigo: 'text-indigo-700',
  pink: 'text-pink-700',
  teal: 'text-teal-700',
  gray: 'text-gray-700',
  slate: 'text-slate-700'
} as const;

export const ICON_BG_COLORS = {
  blue: 'bg-blue-100',
  cyan: 'bg-cyan-100',
  emerald: 'bg-emerald-100',
  green: 'bg-green-100',
  amber: 'bg-amber-100',
  orange: 'bg-orange-100',
  red: 'bg-red-100',
  purple: 'bg-purple-100',
  indigo: 'bg-indigo-100',
  pink: 'bg-pink-100',
  teal: 'bg-teal-100',
  gray: 'bg-gray-100'
} as const;

// Status color mappings
export const STATUS_COLORS = {
  normal: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300'
  },
  waspada: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300'
  },
  awas: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300'
  },
  default: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300'
  }
} as const;

// Color theme mappings for different card types
export const CARD_THEMES = {
  waterLevel: {
    gradient: GRADIENTS.blue,
    bgColor: BG_COLORS.blue,
    textColor: TEXT_COLORS.blue
  },
  volumeEffective: {
    gradient: GRADIENTS.cyan,
    bgColor: BG_COLORS.cyan,
    textColor: TEXT_COLORS.cyan
  },
  totalLoad: {
    gradient: GRADIENTS.emerald,
    bgColor: BG_COLORS.emerald,
    textColor: TEXT_COLORS.emerald
  },
  prediction: {
    gradient: GRADIENTS.indigo,
    bgColor: BG_COLORS.indigo,
    textColor: TEXT_COLORS.indigo
  },
  targetLevel: {
    gradient: GRADIENTS.orange,
    bgColor: BG_COLORS.orange,
    textColor: TEXT_COLORS.orange
  },
  sedimentLevel: {
    gradient: GRADIENTS.slate,
    bgColor: BG_COLORS.slate,
    textColor: TEXT_COLORS.slate
  }
} as const;

// Type definitions for better TypeScript support
export type GradientKey = keyof typeof GRADIENTS;
export type BgColorKey = keyof typeof BG_COLORS;
export type TextColorKey = keyof typeof TEXT_COLORS;
export type StatusType = keyof typeof STATUS_COLORS;
export type CardThemeKey = keyof typeof CARD_THEMES; 