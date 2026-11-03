/**
 * Indicative rates for the public cost calculator (BDT per sq ft).
 * Set by City Steel management, Nov 2026. Edit here to change the website.
 *
 * - shed:       standard PEB shed, steel frame + roof sheet, per sq ft of ground floor
 * - mezzanine:  mezzanine floor with deck sheet, per sq ft of mezzanine floor area
 * - civil:      civil works / foundation, per sq ft of ground floor
 */
export const COST_RATES = {
  shed: { min: 400, max: 550 },
  mezzanine: { min: 500, max: 750 },
  civil: { min: 400, max: 550 },
} as const;

export type CostInput = {
  lengthFt: number;
  widthFt: number;
  mezzanineSqft: number;
  includeCivil: boolean;
};

export type CostLine = { label: string; sqft: number; min: number; max: number };

export function estimateCost(input: CostInput) {
  const ground = Math.round(input.lengthFt * input.widthFt);
  const mezz = Math.round(Math.min(Math.max(input.mezzanineSqft, 0), ground * 3));
  const lines: CostLine[] = [
    { label: 'PEB shed (steel structure + roof sheet)', sqft: ground, min: ground * COST_RATES.shed.min, max: ground * COST_RATES.shed.max },
  ];
  if (mezz > 0) {
    lines.push({ label: 'Mezzanine floor with deck sheet', sqft: mezz, min: mezz * COST_RATES.mezzanine.min, max: mezz * COST_RATES.mezzanine.max });
  }
  if (input.includeCivil) {
    lines.push({ label: 'Civil works / foundation', sqft: ground, min: ground * COST_RATES.civil.min, max: ground * COST_RATES.civil.max });
  }
  const min = lines.reduce((s, l) => s + l.min, 0);
  const max = lines.reduce((s, l) => s + l.max, 0);
  return { ground, mezz, lines, min, max };
}

/** ৳ with Bangladeshi digit grouping, e.g. ৳1,25,00,000 */
export function formatTaka(n: number): string {
  return '৳' + Math.round(n).toLocaleString('en-IN');
}

/** Short form for headlines: ৳45.5 Lakh / ৳1.25 Crore */
export function formatTakaShort(n: number): string {
  if (n >= 1e7) return `৳${(n / 1e7).toFixed(2).replace(/\.?0+$/, '')} Crore`;
  if (n >= 1e5) return `৳${(n / 1e5).toFixed(1).replace(/\.0$/, '')} Lakh`;
  return formatTaka(n);
}
