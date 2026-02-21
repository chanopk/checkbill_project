import type { Member, FoodItem, TaxAndService } from '../types';
import { calculateBillSummary } from '../utils/calculateBill';
import { Calculator } from 'lucide-react';

interface Props {
    members: Member[];
    foodItems: FoodItem[];
    taxAndService: TaxAndService;
}

export function BillSummary({ members, foodItems, taxAndService }: Props) {
    const summaries = calculateBillSummary(members, foodItems, taxAndService);

    const grandTotalAll = summaries.reduce((acc, curr) => acc + curr.grandTotal, 0);

    return (
        <div className="glass-panel" style={{ animationDelay: '0.2s' }}>
            <h2 className="title title-accent">
                <Calculator size={24} />
                สรุปค่าใช้จ่าย (Bill Summary)
            </h2>

            {members.length === 0 ? (
                <p className="helper-text-italic">กรุณาเพิ่มสมาชิกและรายการอาหาร</p>
            ) : (
                <div>
                    <div className="summary-grid">
                        {summaries.map((summary) => (
                            <div
                                key={summary.member.id}
                                className="summary-item"
                            >
                                <div className="summary-name">{summary.member.name}</div>
                                <div className="summary-details">
                                    <div className="summary-total">
                                        ฿{summary.grandTotal.toFixed(2)}
                                    </div>
                                    <div className="summary-subtext">
                                        (ค่าอาหาร ฿{summary.baseTotal.toFixed(2)}
                                        {summary.serviceCharge > 0 ? ` + SC ฿${summary.serviceCharge.toFixed(2)}` : ''}
                                        {summary.vat > 0 ? ` + VAT ฿${summary.vat.toFixed(2)}` : ''})
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grand-total-box">
                        <div className="flex-between">
                            <span className="grand-label">ยอดรวมทั้งบิล (Grand Total):</span>
                            <span className="grand-value">฿{grandTotalAll.toFixed(2)}</span>
                        </div>
                        {(taxAndService.serviceChargePercentage > 0 || taxAndService.vatPercentage > 0) && (
                            <div className="tax-note">
                                รวม VAT {taxAndService.vatPercentage}% และ Service Charge {taxAndService.serviceChargePercentage}% แล้ว
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
