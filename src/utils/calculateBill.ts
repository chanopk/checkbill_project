import type { Member, FoodItem, TaxAndService, MemberSummary } from '../types';

export function calculateBillSummary(
    members: Member[],
    foodItems: FoodItem[],
    taxAndService: TaxAndService
): MemberSummary[] {
    // Initialize summaries
    const summariesMap = new Map<string, MemberSummary>();
    members.forEach((member) => {
        summariesMap.set(member.id, {
            member,
            baseTotal: 0,
            serviceCharge: 0,
            vat: 0,
            grandTotal: 0,
        });
    });

    // Calculate base totals per member
    foodItems.forEach((item) => {
        const sharerCount = item.sharedBy.length;
        if (sharerCount > 0) {
            const splitAmount = item.price / sharerCount;
            item.sharedBy.forEach((memberId) => {
                const summary = summariesMap.get(memberId);
                if (summary) {
                    summary.baseTotal += splitAmount;
                }
            });
        }
    });

    // Apply Service Charge and VAT
    const { vatPercentage, serviceChargePercentage } = taxAndService;

    Array.from(summariesMap.values()).forEach((summary) => {
        summary.serviceCharge = summary.baseTotal * (serviceChargePercentage / 100);
        // VAT is usually calculated on top of (base + service charge)
        const amountSubjectToVat = summary.baseTotal + summary.serviceCharge;
        summary.vat = amountSubjectToVat * (vatPercentage / 100);

        summary.grandTotal = summary.baseTotal + summary.serviceCharge + summary.vat;
    });

    return Array.from(summariesMap.values());
}
