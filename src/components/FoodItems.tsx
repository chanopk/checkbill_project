import { useState } from 'react';
import type { Member, FoodItem } from '../types';
import { Utensils, X, Users, CheckSquare, Square } from 'lucide-react';

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

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const p = parseFloat(price);
        if (name.trim() && !isNaN(p) && p > 0) {
            onAdd(name, p);
            setName('');
            setPrice('');
        }
    };

    return (
        <div className="glass-panel" style={{ animationDelay: '0.1s' }}>
            <h2 className="title title-secondary">
                <Utensils size={24} />
                รายการอาหาร (Food Items)
            </h2>

            <form onSubmit={handleAdd} className="input-group" style={{ flexWrap: 'wrap' }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อเมนู..."
                    className="input-base flex-2"
                    required
                />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="ราคา (฿)"
                    min="0"
                    step="0.01"
                    className="input-base flex-1"
                    required
                />
                <button type="submit" className="btn btn-primary">
                    เพิ่ม
                </button>
            </form>

            {foodItems.length > 0 ? (
                <div className="food-list">
                    {foodItems.map((item) => (
                        <div
                            key={item.id}
                            className="food-card animate-fade-in"
                        >
                            <div className="food-header">
                                <div className="food-title">
                                    {item.name} <span className="food-price">฿{item.price.toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="btn-danger-icon"
                                    title="ลบเมนู"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {members.length > 0 ? (
                                <div>
                                    <div className="share-header">
                                        <span className="share-count">
                                            <Users size={14} /> คนแชร์เมนูนี้ ({item.sharedBy.length}/{members.length})
                                        </span>
                                        <button
                                            onClick={() => onSelectAllShare(item.id)}
                                            className="select-all-btn"
                                        >
                                            เลือกทุกคน
                                        </button>
                                    </div>
                                    <div className="share-list">
                                        {members.map((member) => {
                                            const isShared = item.sharedBy.includes(member.id);
                                            return (
                                                <button
                                                    key={member.id}
                                                    onClick={() => onToggleShare(item.id, member.id)}
                                                    className={`share-btn ${isShared ? 'active' : ''}`}
                                                >
                                                    {isShared ? <CheckSquare size={14} /> : <Square size={14} />}
                                                    {member.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className="helper-text-italic">
                                    ต้องเพิ่มสมาชิกก่อนถึงจะเลือกคนแชร์ได้
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="helper-text-italic">ยังไม่มีรายการอาหาร</p>
            )}
        </div>
    );
}
