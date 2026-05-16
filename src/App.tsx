import { useState } from 'react';
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

  const summaries = calculateBillSummary(members, foodItems, taxAndService);
  const grandTotal = summaries.reduce((s, x) => s + x.grandTotal, 0);
  const hasItems = members.length > 0 && foodItems.some(f => f.sharedBy.length > 0);

  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-sans)', paddingBottom: hasItems ? 64 : 0 }}
    >
      <Header dark={dark} onToggleDark={() => setDark(d => !d)} />

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

      {/* Sticky bottom bar — mobile only, shows when there are items with sharers */}
      {hasItems && (
        <div className="cb-sticky-bar" onClick={() => document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' })}>
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
