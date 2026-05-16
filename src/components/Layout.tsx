import { ReceiptText, Sun, Moon, Share2 } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggleDark: () => void;
}

export function Header({ dark, onToggleDark }: Props) {
  return (
    <header className="cb-header">
      <div className="cb-header-inner">
        <span style={{ color: 'var(--coral)', display: 'inline-flex' }}>
          <ReceiptText size={22} />
        </span>
        <span
          style={{
            fontSize: 'var(--fs-20)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: 'var(--coral)' }}>Check</span>
          <span style={{ color: 'var(--ink)' }}>Bill</span>
        </span>

        <div className="cb-header-spacer" />

        <button
          className="cb-iconbtn"
          onClick={onToggleDark}
          aria-label="toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <span className="cb-header-share">
          <button className="cb-btn cb-btn-secondary cb-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Share2 size={14} />
            แชร์
          </button>
        </span>
      </div>
    </header>
  );
}
