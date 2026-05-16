export interface Member {
  id: string;
  name: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  sharedBy: string[];
}

export interface Discount {
  type: 'amount' | 'percent';
  value: number;
}

export interface TaxAndService {
  vatPercentage: number;
  serviceChargePercentage: number;
  discount: Discount;
  sponsor: number;
  sponsorMode: 'proportional' | 'equal';
}

export interface MemberSummary {
  member: Member;
  baseTotal: number;
  discountAmount: number;
  discountedBase: number;
  serviceCharge: number;
  vat: number;
  sponsorAmount: number;  // negative: sponsor paid for this person
  sponsorPool: number;    // positive: amount returned to common pool (equal mode)
  grandTotal: number;
}
