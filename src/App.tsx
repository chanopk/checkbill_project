import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Layout';
import { MembersPanel } from './components/MembersPanel';
import { FoodItems } from './components/FoodItems';
import { UnifiedPartySummary } from './components/UnifiedPartySummary';
import { useBillState } from './hooks/useBillState';
import { calculateBillSummary } from './utils/calculateBill';
import './index.css';

function App() {
  const [dark, setDark] = useState(false);
  const [promptPayId, setPromptPayId] = useState('');
  const [shareLabel, setShareLabel] = useState('แชร์');
  const {
    members,
    foodItems,
    taxAndService,
    addMember,
    removeMember,
    addFoodItem,
    removeFoodItem,
    toggleShare,
    selectAllShare,
    updateTaxAndService,
  } = useBillState();

  // Apply dark mode to <html> so body + all CSS vars update correctly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const summaries = calculateBillSummary(members, foodItems, taxAndService);
  const grandTotal = summaries.reduce((s, x) => s + x.grandTotal, 0);
  const hasItems = members.length > 0 && foodItems.some(f => f.sharedBy.length > 0);

  const handleShare = useCallback(async () => {
    if (members.length === 0) return;

    const lines = summaries.map(s => `${s.member.name}: ฿${s.grandTotal.toFixed(2)}`);
    const parts = [
      'CheckBill — สรุปยอด',
      '',
      ...lines,
      '',
      `รวม: ฿${grandTotal.toFixed(2)}`,
    ];
    if (promptPayId) parts.push(`พร้อมเพย์: ${promptPayId}`);
    const text = parts.join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: 'CheckBill', text });
      } catch {
        // user cancelled — no action needed
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setShareLabel('คัดลอกแล้ว!');
        setTimeout(() => setShareLabel('แชร์'), 2000);
      } catch {
        setShareLabel('ไม่สามารถคัดลอกได้');
        setTimeout(() => setShareLabel('แชร์'), 2000);
      }
    }
  }, [members, summaries, grandTotal, promptPayId]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', paddingBottom: hasItems ? 64 : 0 }}>
      <Header
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        onShare={handleShare}
        shareLabel={shareLabel}
      />

      <main className="cb-main">
        <div className="cb-area-members">
          <MembersPanel
            members={members}
            onAdd={addMember}
            onRemove={removeMember}
          />
        </div>

        <div className="cb-area-foods">
          <FoodItems
            members={members}
            foodItems={foodItems}
            onAdd={addFoodItem}
            onRemove={removeFoodItem}
            onToggleShare={toggleShare}
            onSelectAllShare={selectAllShare}
          />
        </div>

        <div className="cb-area-summary" id="summary-section">
          <UnifiedPartySummary
            members={members}
            foodItems={foodItems}
            taxAndService={taxAndService}
            onUpdateTaxAndService={updateTaxAndService}
            promptPayId={promptPayId}
            onChangePromptPayId={setPromptPayId}
          />
        </div>
      </main>

      <footer className="cb-footer">
        CheckBill · หารบิลกับเพื่อนแบบไม่ทะเลาะ
      </footer>

      {hasItems && (
        <div
          className="cb-sticky-bar"
          onClick={() => document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span style={{ fontSize: 'var(--fs-14)', color: 'var(--ink-2)' }}>ยอดรวมทั้งหมด</span>
          <span style={{ fontSize: 'var(--fs-20)', fontWeight: 700, color: 'var(--mint)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
            ฿{grandTotal.toFixed(2)}
          </span>
          <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)' }}>กดดูสรุป ↓</span>
        </div>
      )}
    </div>
  );
}

export default App;
