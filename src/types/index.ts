// src/types/index.ts

export interface Member {
    id: string;
    name: string;
}

export interface FoodItem {
    id: string;
    name: string;
    price: number;
    sharedBy: string[]; // Array of Member IDs who share this item
}

export interface TaxAndService {
    vatPercentage: number;
    serviceChargePercentage: number;
}

export interface BillState {
    members: Member[];
    foodItems: FoodItem[];
    taxAndService: TaxAndService;
}

export interface MemberSummary {
    member: Member;
    baseTotal: number;
    serviceCharge: number;
    vat: number;
    grandTotal: number;
}
