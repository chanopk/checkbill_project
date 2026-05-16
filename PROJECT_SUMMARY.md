# CheckBill — Project Summary for Redesign

## Overview

CheckBill เป็นเว็บแอปสำหรับหารค่าอาหารในกลุ่มเพื่อน ผู้ใช้สามารถเพิ่มสมาชิก เพิ่มเมนูอาหาร เลือกว่าใครกินเมนูไหนบ้าง แล้วแอปจะคำนวณยอดรวมของแต่ละคนโดยอัตโนมัติ รวมภาษีมูลค่าเพิ่มและค่าบริการ

**App Name:** CheckBill  
**Platform:** Web (React SPA)  
**Language:** ไทย (Thai UI)  
**Status:** MVP ที่ใช้งานได้ แต่ต้องการ redesign ใหม่ทั้งหมด

---

## Tech Stack (ปัจจุบัน — ห้ามเปลี่ยน)

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Icon Library | lucide-react |
| Styling | Vanilla CSS (ไม่มี CSS framework) |
| State | React useState + custom hook |
| Storage | In-memory only (refresh แล้วข้อมูลหาย) |

---

## Data Models

```typescript
interface Member {
  id: string;      // crypto.randomUUID()
  name: string;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  sharedBy: string[];  // array ของ Member.id ที่กินเมนูนี้
}

interface TaxAndService {
  vatPercentage: number;        // default 7
  serviceChargePercentage: number; // default 10
}

interface MemberSummary {
  member: Member;
  baseTotal: number;      // ยอดอาหารก่อนภาษี
  serviceCharge: number;  // ค่าบริการ
  vat: number;            // ภาษีมูลค่าเพิ่ม
  grandTotal: number;     // ยอดรวมทั้งหมด
}
```

---

## Business Logic (สำคัญ — ต้องคง logic นี้ไว้)

### การคำนวณ (calculateBill.ts)

1. **Split cost:** ราคาเมนูหารด้วยจำนวนคนที่เลือกเมนูนั้น (equal split)
2. **Service Charge:** `baseTotal × (serviceChargePercentage / 100)`
3. **VAT:** คำนวณบน `(baseTotal + serviceCharge)` ไม่ใช่แค่ baseTotal
4. **Grand Total:** `baseTotal + serviceCharge + vat`
5. เมนูที่ไม่มีใครเลือก (`sharedBy.length === 0`) จะไม่ถูกคำนวณ

### State Actions

| Action | พฤติกรรม |
|--------|---------|
| `addMember(name)` | เพิ่มสมาชิกใหม่ |
| `removeMember(id)` | ลบสมาชิก + ลบออกจาก sharedBy ของทุกเมนู |
| `addFoodItem(name, price)` | เพิ่มเมนู (sharedBy เริ่มต้นเป็น []) |
| `removeFoodItem(id)` | ลบเมนู |
| `toggleShare(foodId, memberId)` | toggle ว่าคนนี้กินเมนูนั้นหรือเปล่า |
| `selectAllShare(foodId)` | เลือกทุกคนสำหรับเมนูนั้น |
| `updateTaxAndService(field, value)` | แก้ VAT หรือ Service Charge |

---

## Component Architecture (ปัจจุบัน)

```
App.tsx
├── Layout.tsx          — Header ("CheckBill"), main wrapper, footer
├── UnifiedPartySummary.tsx — Panel บน: จัดการสมาชิก + สรุปยอด + ตั้ง VAT/SC
└── FoodItems.tsx       — Panel ล่าง: จัดการเมนูอาหาร + เลือกคนแชร์
```

### Layout ปัจจุบัน
- Header sticky อยู่บนสุด
- `UnifiedPartySummary` อยู่บน: max-width 32rem, center
- `FoodItems` อยู่ล่าง: max-width 48rem, center
- Layout เป็น single column ตลอด

---

## UX Flow ปัจจุบัน

1. ผู้ใช้ **เพิ่มชื่อเพื่อน** ในช่อง input ด้านบน → กด "เพิ่ม"
2. ผู้ใช้ **เพิ่มเมนูอาหาร** พร้อมราคา → กด "เพิ่ม"
3. ในแต่ละเมนู ผู้ใช้ **กดปุ่มชื่อคน** เพื่อ toggle ว่าใครกินเมนูนั้น (ปุ่มเปลี่ยนสีเมื่อ active)
4. มีปุ่ม "เลือกทุกคน" สำหรับแต่ละเมนู
5. ยอดรวมของแต่ละคนแสดงแบบ real-time ใน UnifiedPartySummary
6. ผู้ใช้ปรับ VAT% และ Service Charge% ได้ (แสดงเฉพาะเมื่อมีสมาชิก)

---

## Visual Design ปัจจุบัน

- **Theme:** Dark mode เท่านั้น
- **Style:** Glassmorphism (`backdrop-filter: blur`, semi-transparent panels)
- **Primary Color:** `#58a6ff` (น้ำเงิน)
- **Secondary Color:** `#ff7b72` (แดงส้ม)
- **Accent Color:** `#3fb950` (เขียว — ใช้กับยอดเงิน)
- **Background:** `#0d1117` gradient (ดำ GitHub-style)
- **Font:** Inter, Prompt (รองรับภาษาไทย)
- **Border Radius:** 8–16px rounded

---

## ปัญหาและข้อจำกัดที่มีอยู่

1. **ข้อมูลหายเมื่อ refresh** — ไม่มี localStorage หรือ backend
2. **ไม่มี mobile optimization** — ปุ่มชื่อคนในเมนูอาจล้นจอมือถือ
3. **ไม่มีสถานะว่าเมนูไหนยังไม่มีคนเลือก** — ผู้ใช้ต้องจำเอง
4. **Layout เป็น single column ทั้งหมด** — บนจอใหญ่พื้นที่ว่างเยอะ
5. **ไม่มี export/share** — ไม่สามารถแชร์ผลลัพธ์ให้เพื่อนได้
6. **VAT/SC ต้องตั้งทุกครั้ง** — ไม่มีค่า default ที่จำได้

---

## สิ่งที่ต้องการจาก Redesign

> **เป้าหมาย:** ออกแบบ UI/UX ใหม่ทั้งหมด โดยคง business logic และ data model เดิมไว้ทุกอย่าง

### สิ่งที่ต้องคง (DO NOT CHANGE)
- Data types ทั้งหมดใน `src/types/index.ts`
- Logic การคำนวณใน `src/utils/calculateBill.ts`
- State management ใน `src/hooks/useBillState.ts`
- Tech stack (React + TypeScript + Vite + Vanilla CSS)

### สิ่งที่ต้องการ redesign
- Component structure ทั้งหมด (`App.tsx`, `Layout.tsx`, components ทั้งหมด)
- CSS ทั้งหมดใน `src/index.css`
- UX flow อาจปรับได้
- อาจเพิ่ม feature ใหม่ได้ เช่น: สรุปแบบ step-by-step, mobile-first layout, dark/light toggle

---

## File Structure

```
src/
├── App.tsx                        — root component
├── main.tsx                       — entry point
├── index.css                      — global styles (ทั้งหมดอยู่ที่นี่)
├── App.css                        — (ว่างเปล่า ไม่ได้ใช้)
├── components/
│   ├── Layout.tsx                 — header + footer wrapper
│   ├── UnifiedPartySummary.tsx    — member management + bill summary
│   └── FoodItems.tsx              — food item management + share selector
├── hooks/
│   └── useBillState.ts            — all state logic
├── types/
│   └── index.ts                   — TypeScript interfaces
└── utils/
    └── calculateBill.ts           — calculation logic
```
