import {
    useMutation,
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useReducer } from 'react';

const USER_DATA = {
    weekData: 
        [
            {
                week: new Date().getTime(),
                budget: 100,
                amountSpent: 0,
                purchases: [],
            },
            
        ]
};

export const queryUserData = () => useQuery({
    queryKey: ['budgetData'],
    queryFn: async ({queryKey}) => {
        let userData = await AsyncStorage.getItem(queryKey[0]);
        if (userData === null) {
            return USER_DATA.weekData[0];
        }
        let userDataObj = JSON.parse(userData);
        let currentWeekData = userDataObj.weekData[userDataObj.weekData.length - 1];
        let lastDate = currentWeekData.week;
        let currentDate = new Date().getTime();
        if (currentDate - lastDate > 604800000) {
            userDataObj.weekData.push({
                week: currentDate,
                budget: 100,
                amountSpent: 0,
                purchases: [],
            });
            try{
                await AsyncStorage.setItem('budgetData', JSON.stringify(userDataObj));
            }
            catch(e) {
                console.log(e);
            }
            return userDataObj.weekData[userDataObj.weekData.length - 1];
        }        
        return currentWeekData;
    },
});

export const addUserPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newPurchase: {name: string; cost: number}) => {
            let currentBudgetData = await AsyncStorage.getItem('budgetData');
            if (currentBudgetData === null) {
                currentBudgetData = JSON.stringify(USER_DATA);
            }
            let newBudgetData = JSON.parse(currentBudgetData);
            newBudgetData.weekData[0].purchases.push(newPurchase);
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
