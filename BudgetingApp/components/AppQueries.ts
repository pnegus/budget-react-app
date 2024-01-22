import {
    useMutation,
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReducer } from 'react';

const BUDGET_DATA = {
    budget: 100,
    amountSpent: 0,
    purchases: [],
};

export const queryUserData = () => useQuery({
    queryKey: ['budgetData'],
    queryFn: async ({queryKey}) => {
        let budgetData = await AsyncStorage.getItem(queryKey[0]);
        return budgetData === null ? BUDGET_DATA : JSON.parse(budgetData);
    },
});

export const addUserPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newPurchase: {name: string; cost: number}) => {
            let currentBudgetData = await AsyncStorage.getItem('budgetData');
            if (currentBudgetData === null) {
                currentBudgetData = JSON.stringify(BUDGET_DATA);
            }
            let newBudgetData = JSON.parse(currentBudgetData);
            newBudgetData.purchases.push(newPurchase);
            try{
                await AsyncStorage.setItem('budgetData', JSON.stringify(newBudgetData));
            }
            catch(e) {
                console.log(e);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['budgetData']});
        },
    })
};
