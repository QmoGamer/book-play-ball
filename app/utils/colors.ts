export interface ChipStyle {
  bg: string
  text: string
  dot: string
  avatarBg: string
}

/** Purely positional palette so a day's roster reads as a lively, varied list. */
const CHIP_PALETTE: ChipStyle[] = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', avatarBg: 'bg-emerald-500' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', avatarBg: 'bg-indigo-500' },
  { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', avatarBg: 'bg-amber-500' },
]

export function chipStyle(index: number): ChipStyle {
  return CHIP_PALETTE[index % CHIP_PALETTE.length]!
}
