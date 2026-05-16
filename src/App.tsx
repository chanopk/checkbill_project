import { useState } from 'react';
import { Header } from './components/Layout';
import { MembersPanel } from './components/MembersPanel';
import { FoodItems } from './components/FoodItems';
import { UnifiedPartySummary } from './components/UnifiedPartySummary';
import { useBillState } from './hooks/useBillState';
import './index.css';

function App() {
  const [dark, setDark] = useState(false);
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

  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      style={{ minHeight: '100vh', background: 'var(--cream)', color: 'var(--ink)', fontFamily: 'var(--font-sans)' }}
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

        <div className="cb-area-summary">
          <UnifiedPartySummary
            members={members}
            foodItems={foodItems}
            taxAndService={taxAndService}
            onUpdateTaxAndService={updateTaxAndService}
          />
        </div>
      </main>

      <footer className="cb-footer">
        CheckBill · หารบิลกับเพื่อนแบบไม่ทะเลาะ
      </footer>
    </div>
  );
}

export default App;
