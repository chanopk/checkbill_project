import { useState, useCallback } from 'react';
import type { Member, FoodItem, TaxAndService } from '../types';

export function useBillState() {
  const [members, setMembers] = useState<Member[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [taxAndService, setTaxAndService] = useState<TaxAndService>({
    vatPercentage: 7,
    serviceChargePercentage: 10,
    discount: { type: 'amount', value: 0 },
    sponsor: 0,
    sponsorMode: 'proportional',
  });

  const addMember = useCallback((name: string) => {
    if (!name.trim()) return;
    setMembers(prev => [...prev, { id: crypto.randomUUID(), name: name.trim() }]);
  }, []);

  const removeMember = useCallback((id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setFoodItems(prev =>
      prev.map(item => ({ ...item, sharedBy: item.sharedBy.filter(mid => mid !== id) }))
    );
  }, []);

  const addFoodItem = useCallback((name: string, price: number) => {
    if (!name.trim() || price <= 0) return;
    setFoodItems(prev => [...prev, { id: crypto.randomUUID(), name: name.trim(), price, sharedBy: [] }]);
  }, []);

  const removeFoodItem = useCallback((id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const toggleShare = useCallback((foodId: string, memberId: string) => {
    setFoodItems(prev =>
      prev.map(item => {
        if (item.id !== foodId) return item;
        const isShared = item.sharedBy.includes(memberId);
        return {
          ...item,
          sharedBy: isShared
            ? item.sharedBy.filter(id => id !== memberId)
            : [...item.sharedBy, memberId],
        };
      })
    );
  }, []);

  const selectAllShare = useCallback((foodId: string) => {
    setFoodItems(prev =>
      prev.map(item => item.id === foodId ? { ...item, sharedBy: members.map(m => m.id) } : item)
    );
  }, [members]);

  const updateTaxAndService = useCallback((next: TaxAndService) => {
    setTaxAndService(next);
  }, []);

  return {
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
  };
}
