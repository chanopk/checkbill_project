import type { Member, FoodItem, TaxAndService, MemberSummary } from '../types';

/**
 * Proportional sponsor: each person's share = subtotal / totalSubtotal * sponsor
 * Equal sponsor: iterates from smallest bill → cascades overflow to remaining members
 *   sponsorPool = amount returned to common pool (for display only)
 */
function allocateEqualSponsor(subtotals: number[], sponsor: number): { applied: number; pool: number }[] {
  const n = subtotals.length;
  const zero = subtotals.map(() => ({ applied: 0, pool: 0 }));
  if (n === 0 || sponsor <= 0) return zero;

  const totalSub = subtotals.reduce((s, x) => s + x, 0);
  const poolClamped = Math.min(sponsor, totalSub);
  const initialEqualShare = poolClamped / n;

  const sorted = subtotals.map((sub, i) => ({ sub, i })).sort((a, b) => a.sub - b.sub);
  const applied = new Array(n).fill(0);

  let remaining = poolClamped;
  let remainingPeople = n;

  for (const { sub, i } of sorted) {
    const share = remaining / remainingPeople;
    const actual = Math.min(sub, share);
    applied[i] = actual;
    remaining -= actual;
    remainingPeople--;
  }

  return subtotals.map((_, i) => ({
    applied: applied[i],
    pool: Math.max(0, initialEqualShare - applied[i]),
  }));
}

export function calculateBillSummary(
  members: Member[],
  foodItems: FoodItem[],
  tax: TaxAndService,
): MemberSummary[] {
  const {
    vatPercentage = 0,
    serviceChargePercentage = 0,
    discount = { type: 'amount', value: 0 },
    sponsor = 0,
    sponsorMode = 'proportional',
  } = tax;

  // Step 1 — base share per person
  const baseShare: Record<string, number> = {};
  members.forEach(m => { baseShare[m.id] = 0; });
  foodItems.forEach(item => {
    const n = item.sharedBy.length;
    if (n === 0) return;
    const per = item.price / n;
    item.sharedBy.forEach(id => { if (baseShare[id] != null) baseShare[id] += per; });
  });
  const totalBase = members.reduce((s, m) => s + baseShare[m.id], 0);

  // Step 2 — discount total
  let discountTotal = 0;
  if (totalBase > 0) {
    discountTotal = discount.type === 'percent'
      ? totalBase * (Math.max(0, discount.value) / 100)
      : Math.min(Math.max(0, discount.value), totalBase);
  }

  // Step 3–6 — per-person subtotal
  const perPerson = members.map(m => {
    const base = baseShare[m.id];
    const personDiscount = totalBase > 0 ? (base / totalBase) * discountTotal : 0;
    const discountedBase = base - personDiscount;
    const serviceCharge = discountedBase * (serviceChargePercentage / 100);
    const vat = (discountedBase + serviceCharge) * (vatPercentage / 100);
    const subtotal = discountedBase + serviceCharge + vat;
    return { member: m, baseTotal: base, discountAmount: -personDiscount, discountedBase, serviceCharge, vat, subtotal };
  });

  // Step 7 — sponsor allocation
  const totalSubtotal = perPerson.reduce((s, p) => s + p.subtotal, 0);
  const sponsorClamped = Math.min(Math.max(0, sponsor), totalSubtotal);

  let sponsorPerPerson: { applied: number; pool: number }[];

  if (sponsorMode === 'equal') {
    sponsorPerPerson = allocateEqualSponsor(perPerson.map(p => p.subtotal), sponsorClamped);
  } else {
    // proportional
    sponsorPerPerson = perPerson.map(p => ({
      applied: totalSubtotal > 0 ? (p.subtotal / totalSubtotal) * sponsorClamped : 0,
      pool: 0,
    }));
  }

  return perPerson.map((p, i) => {
    const { applied, pool } = sponsorPerPerson[i];
    const grandTotal = Math.max(0, p.subtotal - applied);
    return {
      member: p.member,
      baseTotal: p.baseTotal,
      discountAmount: p.discountAmount,
      discountedBase: p.discountedBase,
      serviceCharge: p.serviceCharge,
      vat: p.vat,
      sponsorAmount: -applied,
      sponsorPool: pool,
      grandTotal,
    };
  });
}
