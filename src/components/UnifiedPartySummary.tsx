import { useState } from 'react';
import { SlidersHorizontal, QrCode, Smartphone } from 'lucide-react';
import type { Member, FoodItem, TaxAndService, MemberSummary } from '../types';
import { calculateBillSummary } from '../utils/calculateBill';
import { PromptPayQR } from './PromptPayQR';

/* ===== SummaryCard ===== */

interface SummaryCardProps {
  summary: MemberSummary;
  expanded: boolean;
  onToggle: () => void;
  promptPayId: string;
}

function SummaryCard({ summary, expanded, onToggle, promptPayId }: SummaryCardProps) {
  const { member, baseTotal, discountAmount, serviceCharge, vat, sponsorAmount, sponsorPool, grandTotal } = summary;
  const [showQR, setShowQR] = useState(false);
  const hasDiscount = discountAmount < -0.005;
  const hasSponsor = sponsorAmount < -0.005;
  const hasPool = sponsorPool > 0.005;
  const canShowQR = promptPayId.length > 0 && grandTotal > 0;

  return (
    <article className="cb-card" style={{ padding: '16px 18px' }}>
      {/* Header row — click to expand/collapse breakdown */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'transparent',
          border: 0,
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ fontSize: 'var(--fs-16)', fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {member.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {grandTotal === 0 && (
            <span className="cb-badge-mint">จ่ายครบแล้ว</span>
          )}
          <div style={{ fontSize: 'var(--fs-24)', fontWeight: 700, color: grandTotal === 0 ? 'var(--mint)' : 'var(--mint)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            ฿{grandTotal.toFixed(2)}
          </div>
        </div>
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 'var(--fs-13)', color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>
          <BillRow label="ค่าอาหาร" value={baseTotal} />
          {hasDiscount && <BillRow label="ส่วนลด" value={discountAmount} tone="mint" />}
          <BillRow label="Service Charge" value={serviceCharge} />
          <BillRow label="VAT" value={vat} />
          {hasSponsor && <BillRow label="สปอนเซอ" value={sponsorAmount} tone="mint" />}
          {hasPool && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--hairline-strong)' }}>
              <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>คืนเข้ากองกลาง</span>
              <span style={{ color: 'var(--warning)' }}>+฿{sponsorPool.toFixed(2)}</span>
            </div>
          )}

          {/* PromptPay QR button */}
          {canShowQR && (
            <div style={{ marginTop: 8 }}>
              <button
                onClick={e => { e.stopPropagation(); setShowQR(v => !v); }}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%', justifyContent: 'center' }}
              >
                <QrCode size={14} />
                {showQR ? 'ซ่อน QR Code' : 'แสดง QR Code พร้อมเพย์'}
              </button>
              {showQR && (
                <PromptPayQR
                  promptPayId={promptPayId}
                  amount={grandTotal}
                  name={member.name}
                />
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function BillRow({ label, value, tone }: { label: string; value: number; tone?: 'mint' }) {
  const color = tone === 'mint' ? 'var(--mint)' : 'var(--ink-2)';
  const sign = value < 0 ? '−' : '';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ color }}>{sign}฿{Math.abs(value).toFixed(2)}</span>
    </div>
  );
}

/* ===== PromptPay Input ===== */

interface PromptPayInputProps {
  value: string;
  onChange: (v: string) => void;
}

function PromptPayInput({ value, onChange }: PromptPayInputProps) {
  return (
    <div className="cb-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Smartphone size={16} style={{ color: 'var(--coral)' }} />
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 600, color: 'var(--ink-2)' }}>
          เลขพร้อมเพย์ (สำหรับสร้าง QR)
        </span>
      </div>
      <label className="cb-input-wrap">
        <input
          type="tel"
          placeholder="เบอร์มือถือ หรือ เลขบัตรประชาชน"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={13}
        />
      </label>
      {value.length > 0 && (
        <p style={{ margin: 0, fontSize: 'var(--fs-12)', color: 'var(--muted)' }}>
          เปิด breakdown ของแต่ละคน แล้วกด "แสดง QR Code"
        </p>
      )}
    </div>
  );
}

/* ===== BillAdjustments ===== */

interface AdjustmentsProps {
  tax: TaxAndService;
  memberCount: number;
  onChange: (next: TaxAndService) => void;
}

function BillAdjustments({ tax, memberCount, onChange }: AdjustmentsProps) {
  const equalShare = tax.sponsor > 0 && memberCount > 0 ? tax.sponsor / memberCount : 0;

  return (
    <div className="cb-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <SlidersHorizontal size={16} style={{ color: 'var(--muted)' }} />
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 600, color: 'var(--ink-2)' }}>ภาษีและค่าบริการ</span>
      </div>

      <div className="cb-tax-grid">
        <NumberField label="VAT %" value={tax.vatPercentage} onChange={v => onChange({ ...tax, vatPercentage: v })} />
        <NumberField label="Service %" value={tax.serviceChargePercentage} onChange={v => onChange({ ...tax, serviceChargePercentage: v })} />
      </div>

      <hr className="cb-divider" />

      <div className="cb-tax-grid">
        <DiscountField discount={tax.discount} onChange={d => onChange({ ...tax, discount: d })} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <NumberField
            label="สปอนเซอ (฿)"
            value={tax.sponsor}
            onChange={v => onChange({ ...tax, sponsor: v })}
            placeholder="0"
            step="1"
          />
          {equalShare > 0 && (
            <span style={{ fontSize: 'var(--fs-11)', color: 'var(--muted)' }}>
              คนละ ฿{equalShare.toFixed(2)} ({memberCount} คน)
            </span>
          )}
        </div>
      </div>

      {/* Sponsor mode toggle */}
      {tax.sponsor > 0 && memberCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)', fontWeight: 500 }}>วิธีแบ่งสปอนเซอ</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SponsorModeBtn
              selected={tax.sponsorMode === 'proportional'}
              onClick={() => onChange({ ...tax, sponsorMode: 'proportional' })}
              label="ตามสัดส่วนยอดของแต่ละคน"
              description="คนจ่ายเยอะได้รับสปอนเซอมาก"
            />
            <SponsorModeBtn
              selected={tax.sponsorMode === 'equal'}
              onClick={() => onChange({ ...tax, sponsorMode: 'equal' })}
              label="แบ่งเท่าๆ กันทุกคน"
              description={`คนละ ฿${equalShare.toFixed(2)} · ถ้าใครยอดน้อยกว่า ส่วนเกินคืนกองกลางให้คนอื่น`}
            />
          </div>
        </div>
      )}

      <p style={{ margin: 0, fontSize: 'var(--fs-12)', color: 'var(--muted)' }}>
        ส่วนลดหักก่อนคิดภาษี · สปอนเซอช่วยจ่ายหลังคิดภาษีแล้ว
      </p>
    </div>
  );
}

function SponsorModeBtn({ selected, onClick, label, description }: { selected: boolean; onClick: () => void; label: string; description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: selected ? '1.5px solid var(--coral)' : '1.5px solid var(--hairline)',
        background: selected ? 'var(--coral-soft)' : 'var(--paper)',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'all var(--dur-fast) var(--ease)',
      }}
    >
      <span style={{ width: 16, height: 16, borderRadius: '50%', border: selected ? '5px solid var(--coral)' : '2px solid var(--hairline-strong)', background: 'var(--paper)', flexShrink: 0, marginTop: 2, transition: 'all var(--dur-fast) var(--ease)' }} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 'var(--fs-13)', fontWeight: 600, color: selected ? 'var(--coral)' : 'var(--ink)' }}>{label}</span>
        <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)', lineHeight: 1.4 }}>{description}</span>
      </span>
    </button>
  );
}

function NumberField({ label, value, onChange, placeholder, step = '0.1' }: { label: string; value: number; onChange: (v: number) => void; placeholder?: string; step?: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)', fontWeight: 500 }}>{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={value === 0 ? '' : value}
        placeholder={placeholder ?? '0'}
        step={step}
        min="0"
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="cb-number-input"
      />
    </label>
  );
}

function DiscountField({ discount, onChange }: { discount: TaxAndService['discount']; onChange: (d: TaxAndService['discount']) => void }) {
  const { type, value } = discount;
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)', fontWeight: 500 }}>ส่วนลด</span>
      <div className="cb-discount-field">
        <input
          type="number"
          inputMode="decimal"
          value={value === 0 ? '' : value}
          placeholder="0"
          min="0"
          step={type === 'percent' ? '0.5' : '1'}
          onChange={e => onChange({ type, value: parseFloat(e.target.value) || 0 })}
        />
        <div className="cb-discount-toggle">
          {(['amount', 'percent'] as const).map(t => (
            <button key={t} type="button" onClick={() => onChange({ type: t, value })} className={`cb-discount-type-btn${type === t ? ' active' : ''}`}>
              {t === 'amount' ? '฿' : '%'}
            </button>
          ))}
        </div>
      </div>
    </label>
  );
}

/* ===== Summary root ===== */

interface Props {
  members: Member[];
  foodItems: FoodItem[];
  taxAndService: TaxAndService;
  onUpdateTaxAndService: (next: TaxAndService) => void;
  promptPayId: string;
  onChangePromptPayId: (id: string) => void;
}

export function UnifiedPartySummary({ members, foodItems, taxAndService, onUpdateTaxAndService, promptPayId, onChangePromptPayId }: Props) {
  const summaries = calculateBillSummary(members, foodItems, taxAndService);
  const grandTotal = summaries.reduce((s, x) => s + x.grandTotal, 0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const hasAdj = taxAndService.discount.value > 0 || taxAndService.sponsor > 0;

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--ink)' }}>สรุปยอด</h2>
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--muted)' }}>· รวม ฿{grandTotal.toFixed(2)}</span>
        {hasAdj && <span className="cb-badge-mint">มีส่วนลด/สปอนเซอ</span>}
      </div>

      {members.length === 0 ? (
        <div className="cb-empty">ยอดจะปรากฏที่นี่หลังเพิ่มเพื่อนและเมนู</div>
      ) : (
        <>
          <BillAdjustments tax={taxAndService} memberCount={members.length} onChange={onUpdateTaxAndService} />
          <PromptPayInput value={promptPayId} onChange={onChangePromptPayId} />
          {summaries.map(s => (
            <SummaryCard
              key={s.member.id}
              summary={s}
              expanded={expandedId === s.member.id}
              onToggle={() => setExpandedId(id => id === s.member.id ? null : s.member.id)}
              promptPayId={promptPayId}
            />
          ))}
        </>
      )}
    </section>
  );
}
