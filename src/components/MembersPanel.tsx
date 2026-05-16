import { useState } from 'react';
import { UserPlus, Plus, Trash2 } from 'lucide-react';
import type { Member } from '../types';

interface Props {
  members: Member[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export function MembersPanel({ members, onAdd, onRemove }: Props) {
  const [name, setName] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onAdd(n);
    setName('');
  };

  return (
    <section className="cb-card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--fs-18)', fontWeight: 600, color: 'var(--ink)' }}>
          เพื่อนในวง
        </h2>
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--muted)' }}>
          · {members.length} คน
        </span>
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <label className="cb-input-wrap" style={{ flex: 1 }}>
          <UserPlus size={18} className="cb-input-icon" />
          <input
            placeholder="ใส่ชื่อเพื่อน..."
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="cb-btn cb-btn-primary"
          disabled={!name.trim()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} />
          เพิ่ม
        </button>
      </form>

      {members.length === 0 ? (
        <div className="cb-empty">ยังไม่มีใคร เริ่มเพิ่มเพื่อนกันก่อน</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {members.map(m => (
            <span
              key={m.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 8px 6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1.5px solid var(--hairline)',
                background: 'var(--paper)',
                fontSize: 'var(--fs-14)',
                fontWeight: 500,
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              {m.name}
              <button
                onClick={() => onRemove(m.id)}
                aria-label={`ลบ ${m.name}`}
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: 4,
                  borderRadius: 999,
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'inline-flex',
                  transition: 'color var(--dur-fast) var(--ease)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
