import { useState, useCallback } from 'react';
import type { Member, FoodItem, TaxAndService } from '../types';

export function useBillState() {
    const [members, setMembers] = useState<Member[]>([]);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [taxAndService, setTaxAndService] = useState<TaxAndService>({
        vatPercentage: 7,
        serviceChargePercentage: 10,
    });

    const addMember = useCallback((name: string) => {
        if (!name.trim()) return;
        const newMember: Member = {
            id: crypto.randomUUID(),
            name: name.trim(),
        };
        setMembers((prev) => [...prev, newMember]);
    }, []);

    const removeMember = useCallback((id: string) => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        // Also remove this member from any food item shares
        setFoodItems((prev) =>
            prev.map((item) => ({
                ...item,
                sharedBy: item.sharedBy.filter((memberId) => memberId !== id),
            }))
        );
    }, []);

    const addFoodItem = useCallback((name: string, price: number) => {
        if (!name.trim() || price <= 0) return;
        const newItem: FoodItem = {
            id: crypto.randomUUID(),
            name: name.trim(),
            price,
            sharedBy: [], // initially shared by no one
        };
        setFoodItems((prev) => [...prev, newItem]);
    }, []);

    const removeFoodItem = useCallback((id: string) => {
        setFoodItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const toggleShare = useCallback((foodId: string, memberId: string) => {
        setFoodItems((prev) =>
            prev.map((item) => {
                if (item.id === foodId) {
                    const isShared = item.sharedBy.includes(memberId);
                    return {
                        ...item,
                        sharedBy: isShared
                            ? item.sharedBy.filter((id) => id !== memberId)
                            : [...item.sharedBy, memberId],
                    };
                }
                return item;
            })
        );
    }, []);

    const selectAllShare = useCallback((foodId: string) => {
        setFoodItems((prev) =>
            prev.map((item) => {
                if (item.id === foodId) {
                    return {
                        ...item,
                        sharedBy: members.map(m => m.id),
                    };
                }
                return item;
            })
        );
    }, [members]);

    const updateTaxAndService = useCallback(
        (field: keyof TaxAndService, value: number) => {
            setTaxAndService((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

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
