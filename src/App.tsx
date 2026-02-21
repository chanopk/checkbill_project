import { Layout } from './components/Layout';
import { PartyMembers } from './components/PartyMembers';
import { FoodItems } from './components/FoodItems';
import { TaxAndServiceConfig } from './components/TaxAndServiceConfig';
import { BillSummary } from './components/BillSummary';
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

        <PartyMembers members={members} onAdd={addMember} onRemove={removeMember} />

        <FoodItems
          members={members}
          foodItems={foodItems}
          onAdd={addFoodItem}
          onRemove={removeFoodItem}
          onToggleShare={toggleShare}
          onSelectAllShare={selectAllShare}
        />

        <TaxAndServiceConfig taxAndService={taxAndService} onUpdate={updateTaxAndService} />

        <BillSummary members={members} foodItems={foodItems} taxAndService={taxAndService} />
      </div>
    </Layout>
  );
}

export default App;
