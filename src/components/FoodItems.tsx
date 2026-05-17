import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import type { Member, FoodItem } from '../types';

interface FoodRowProps {
  item: FoodItem;
  members: Member[];
  onToggleShare: (foodId: string, memberId: string) => void;
  onSelectAll: (foodId: string) => void;
  onRemove: (id: string) => void;
}

function FoodRow({ item, members, onToggleShare, onSelectAll, onRemove }: FoodRowProps) {
  const sharedCount = item.sharedBy.length;
  const perPerson = sharedCount > 0 ? item.price / sharedCount : 0;
  const empty = sharedCount === 0;

  return (
    <article className="cb-card" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: 'var(--fs-16)',
              fontWeight: 600,
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.name}
          </div>
          <div style={{ marginTop: 3, minHeight: 18 }}>
            {empty ? (
              <span className="cb-badge-warning">ยังไม่มีคนเลือก</span>
            ) : (
              <span style={{ fontSize: 'var(--fs-12)', color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                ฿{perPerson.toFixed(2)} / คน · แบ่ง {sharedCount} คน
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            fontSize: 'var(--fs-18)',
            fontWeight: 600,
            color: 'var(--ink)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.01em',
            flexShrink: 0,
          }}
        >
          ฿{item.price.toFixed(2)}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 14 }}>
        {members.length === 0 ? (
          <span style={{ fontSize: 'var(--fs-13)', color: 'var(--muted)' }}>เพิ่มเพื่อนก่อนถึงจะกดได้</span>
        ) : (
          <>
            {members.map(m => {
              const active = item.sharedBy.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => onToggleShare(item.id, m.id)}
                  className={`cb-chip ${active ? 'cb-chip-active' : 'cb-chip-inactive'}`}
                >
                  {active && <Check size={14} />}
                  {m.name}
                </button>
              );
            })}
            <button
              onClick={() => onSelectAll(item.id)}
              className="cb-chip cb-chip-dashed"
            >
              เลือกทุกคน
            </button>
          </>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="cb-iconbtn danger"
            onClick={() => onRemove(item.id)}
            aria-label={`ลบ ${item.name}`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

interface Props {
  members: Member[];
  foodItems: FoodItem[];
  onAdd: (name: string, price: number) => void;
  onRemove: (id: string) => void;
  onToggleShare: (foodId: string, memberId: string) => void;
  onSelectAllShare: (foodId: string) => void;
}

export function FoodItems({ members, foodItems, onAdd, onRemove, onToggleShare, onSelectAllShare }: Props) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const p = parseFloat(price);
    if (!n || isNaN(p) || p <= 0) return;
    onAdd(n, p);
    setName('');
    setPrice('');
  };

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--ink)' }}>
          รายการอาหาร
        </h2>
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--muted)' }}>
          · {foodItems.length} เมนู
        </span>
      </div>

      <form
        onSubmit={submit}
        className="cb-card cb-food-form"
        style={{ padding: '14px 16px' }}
      >
        <div className="cb-ff-name">
          <label className="cb-input-wrap">
            <input
              placeholder="ชื่อเมนู"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
        </div>
        <div className="cb-ff-price">
          <label className="cb-input-wrap">
            <input
              placeholder="ราคา"
              inputMode="decimal"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
            <span className="cb-input-suffix">฿</span>
          </label>
        </div>
        <div className="cb-ff-submit">
          <button
            type="submit"
            className="cb-btn cb-btn-primary"
            disabled={!name.trim() || !price}
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            เพิ่ม
          </button>
        </div>
      </form>

      {foodItems.length === 0 ? (
        <div className="cb-empty">เพิ่มเมนูแรกของวันนี้</div>
      ) : (
        foodItems.map(item => (
          <FoodRow
            key={item.id}
            item={item}
            members={members}
            onToggleShare={onToggleShare}
            onSelectAll={onSelectAllShare}
            onRemove={onRemove}
          />
        ))
      )}
    </section>
  );
}
