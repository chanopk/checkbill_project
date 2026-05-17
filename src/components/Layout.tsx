import { ReceiptText, Sun, Moon, Share2, Copy, Check } from 'lucide-react';

interface Props {
  dark: boolean;
  onToggleDark: () => void;
  onShare: () => void;
  shareLabel?: string;
}

export function Header({ dark, onToggleDark, onShare, shareLabel = 'แชร์' }: Props) {
  const copied = shareLabel !== 'แชร์';
  return (
    <header className="cb-header">
      <div className="cb-header-inner">
        <span style={{ color: 'var(--coral)', display: 'inline-flex' }}>
          <ReceiptText size={22} />
        </span>
        <span style={{ fontSize: 'var(--fs-20)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>
          <span style={{ color: 'var(--coral)' }}>Check</span>
          <span style={{ color: 'var(--ink)' }}>Bill</span>
        </span>

        <div className="cb-header-spacer" />

        <button
          className="cb-iconbtn"
          onClick={onToggleDark}
          aria-label={dark ? 'เปลี่ยนเป็น light mode' : 'เปลี่ยนเป็น dark mode'}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <span className="cb-header-share">
          <button
            className="cb-btn cb-btn-secondary cb-btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: copied ? 'var(--mint)' : undefined,
              borderColor: copied ? 'var(--mint)' : undefined,
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onClick={onShare}
            aria-label="แชร์สรุปบิล"
          >
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {shareLabel}
          </button>
        </span>

        {/* Mobile share icon (no text label) */}
        <span className="cb-header-share-mobile">
          <button
            className="cb-iconbtn"
            onClick={onShare}
            aria-label="แชร์สรุปบิล"
            style={{ color: copied ? 'var(--mint)' : undefined }}
          >
            {copied ? <Copy size={18} /> : <Share2 size={18} />}
          </button>
        </span>
      </div>
    </header>
  );
}
