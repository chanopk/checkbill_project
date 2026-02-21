import { useState } from 'react';
import type { Member } from '../types';
import { UserPlus, X } from 'lucide-react';

interface Props {
    members: Member[];
    onAdd: (name: string) => void;
    onRemove: (id: string) => void;
}

export function PartyMembers({ members, onAdd, onRemove }: Props) {
    const [name, setName] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name);
            setName('');
        }
    };

    return (
        <div className="glass-panel">
            <h2 className="title title-primary">
                <UserPlus size={24} />
                สมาชิกในปาร์ตี้ (Party Members)
            </h2>

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

            {members.length > 0 ? (
                <div className="member-list">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="member-badge animate-fade-in"
                        >
                            <span>{member.name}</span>
                            <button
                                onClick={() => onRemove(member.id)}
                                className="remove-sm"
                                title="ลบ"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="helper-text-italic">ยังไม่มีสมาชิก เพิ่มชื่อด้านบนเลย!</p>
            )}
        </div>
    );
}
