import { useState } from 'react';
import type { Member, FoodItem, TaxAndService } from '../types';
import { calculateBillSummary } from '../utils/calculateBill';
import { Users, X } from 'lucide-react';

interface Props {
    members: Member[];
    foodItems: FoodItem[];
    taxAndService: TaxAndService;
    onAddMember: (name: string) => void;
    onRemoveMember: (id: string) => void;
    onUpdateTaxAndService: (field: keyof TaxAndService, value: number) => void;
}

export function UnifiedPartySummary({
    members,
    foodItems,
    taxAndService,
    onAddMember,
    onRemoveMember,
    onUpdateTaxAndService,
}: Props) {
    const [name, setName] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAddMember(name);
            setName('');
        }
    };

    const summaries = calculateBillSummary(members, foodItems, taxAndService);
    const grandTotalAll = summaries.reduce((acc, curr) => acc + curr.grandTotal, 0);

    return (
        <div className="glass-panel">
            <h2 className="title title-primary">
                <Users size={24} />
                ปาร์ตี้และสรุปค่าใช้จ่าย
            </h2>

            {/* Top: Add Member */}
            <form onSubmit={handleAdd} className="input-group">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อเพื่อน..."
                    className="input-base"
                />
                <button type="submit" className="btn btn-primary">
                    เพิ่ม
                </button>
            </form>

            {/* Middle: Member List with Individual Total */}
            <div className="unified-member-list">
                {members.length > 0 ? (
                    summaries.map((summary) => (
                        <div key={summary.member.id} className="unified-member-row animate-fade-in">
                            <div className="unified-member-name">
                                {summary.member.name}
                            </div>
                            <div className="unified-member-right">
                                <span className="unified-member-total">
                                    ฿{summary.grandTotal.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => onRemoveMember(summary.member.id)}
                                    className="remove-sm"
                                    title="ลบ"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="helper-text-italic">ยังไม่มีสมาชิก เพิ่มชื่อด้านบนเลย!</p>
                )}
            </div>

            {/* Bottom: Tax Config & Grand Total */}
            {members.length > 0 && (
                <div className="unified-bottom-section">
                    <div className="unified-tax-row">
                        <div className="flex-1">
                            <label className="label-text">Service Charge (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={taxAndService.serviceChargePercentage}
                                onChange={(e) =>
                                    onUpdateTaxAndService('serviceChargePercentage', Number(e.target.value) || 0)
                                }
                                className="input-base"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="label-text">VAT (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={taxAndService.vatPercentage}
                                onChange={(e) =>
                                    onUpdateTaxAndService('vatPercentage', Number(e.target.value) || 0)
                                }
                                className="input-base"
                            />
                        </div>
                    </div>

                    <div className="unified-grand-total">
                        <div className="flex-between">
                            <span className="grand-label">ยอดรวมทุกรายการ:</span>
                            <span className="grand-value">฿{grandTotalAll.toFixed(2)}</span>
                        </div>
                        {(taxAndService.serviceChargePercentage > 0 || taxAndService.vatPercentage > 0) && (
                            <div className="tax-note">
                                (รวม VAT {taxAndService.vatPercentage}% และ SC {taxAndService.serviceChargePercentage}%)
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
