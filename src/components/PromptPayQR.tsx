import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';

interface Props {
  promptPayId: string;
  amount: number;
  name: string;
}

export function PromptPayQR({ promptPayId, amount, name }: Props) {
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!promptPayId || amount <= 0) { setPayload(''); return; }
    try {
      const qrPayload = generatePayload(promptPayId.replace(/-/g, ''), { amount });
      setPayload(qrPayload);
      setError('');
    } catch {
      setError('เลขพร้อมเพย์ไม่ถูกต้อง');
      setPayload('');
    }
  }, [promptPayId, amount]);

  if (error) {
    return (
      <div className="cb-qr-box">
        <span style={{ fontSize: 'var(--fs-13)', color: 'var(--danger)' }}>{error}</span>
      </div>
    );
  }

  if (!payload) return null;

  return (
    <div className="cb-qr-box">
      <QRCodeSVG
        value={payload}
        size={180}
        bgColor="transparent"
        fgColor="var(--ink)"
        level="M"
      />
      <div className="cb-qr-amount">฿{amount.toFixed(2)}</div>
      <div className="cb-qr-label">
        {name} สแกนจ่ายผ่านแอปธนาคาร
      </div>
    </div>
  );
}
