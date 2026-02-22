import { Layout } from './components/Layout';
import { UnifiedPartySummary } from './components/UnifiedPartySummary';
import { FoodItems } from './components/FoodItems';
import { useBillState } from './hooks/useBillState';
import './index.css';

function App() {
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
    <Layout>
      <div>
        <p className="helper-text">
          แอปพลิเคชันช่วยคำนวณและหารค่าอาหาร เพิ่มเพื่อน เพิ่มเมนู และดูสรุปยอดได้ทันที
        </p>

        <div className="top-section-single">
          <UnifiedPartySummary
            members={members}
            foodItems={foodItems}
            taxAndService={taxAndService}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            onUpdateTaxAndService={updateTaxAndService}
          />
        </div>

        <div className="bottom-section">
          <FoodItems
            members={members}
            foodItems={foodItems}
            onAdd={addFoodItem}
            onRemove={removeFoodItem}
            onToggleShare={toggleShare}
            onSelectAllShare={selectAllShare}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
