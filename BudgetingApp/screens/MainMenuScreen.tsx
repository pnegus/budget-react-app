import React, { useLayoutEffect, useContext } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
  } from 'react-native';

import PurchaseListItem from '../components/PurchaseListItem';

//DATA IMPORTS
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PropsWithChildren} from 'react';
import {useState, useEffect } from 'react';
import { queryUserData } from '../components/AppQueries';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

//NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContextMenu from "react-native-context-menu-view";
import {
  HeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu,
  Divider,
  ItemProps,
  HiddenItemProps,
  HeaderButtonProps,
  HeaderButton,
} from 'react-navigation-header-buttons';

//STYLES IMPORTS
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'react-native-linear-gradient';
import { RadialGradient } from 'react-native-svg';
import { Icon, FAB, ListItem } from '@rneui/themed';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { ThemeContext } from '../components/Contexts';

const categories = ["Food", "Gas", "Bills", "Misc."];
const iconNames = ["food", "gas-station", "cash-multiple", "dots-horizontal"];

function MainMenuScreen({ route, navigation }): React.JSX.Element {
  const theme = useContext(ThemeContext);
  const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};
  
  const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();
  const purchaseTotal = userData === undefined ? null : userData.purchases.reduce((acc, init) => acc + init.cost, 0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item 
            title = "Settings" 
            onPress = {() => {
                navigation.navigate('Settings');
              }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.infoContainer}>
        {
        isUserDataPending ? 
              (
                  <ActivityIndicator size = "large"/>
              ) : 
              (
                  <React.Fragment>
                      <Text style = {[styles.textDesc, {padding: 20}]}> Current Weekly Budget: ${userData.budget}</Text>
                      <SafeAreaView style = {styles.budgetProgressContainer}>
                          <AnimatedCircularProgress
                              size={120}
                              width={30}
                              fill={purchaseTotal / userData.budget * 100}
                              tintColor={
                                purchaseTotal >= 0.75 * userData.budget && purchaseTotal < userData.budget * 0.9 ? 'yellow' : 
                                purchaseTotal >= userData.budget * 0.9 ? 'red' :         
                                'green'}
                              onAnimationComplete={() => console.log('onAnimationComplete')}
                              backgroundColor="#3d5875"
                          >
                            {fill => <Text>{"$" + purchaseTotal}</Text>}
                          </AnimatedCircularProgress>
                      </SafeAreaView>
                      <SafeAreaView style = {styles.purchasesListHeader}>
                          <Text style = {styles.textDesc}>Purchases</Text>
                          <FAB 
                              icon = {{name: 'add', color: 'white'}} 
                              size = 'small' 
                              color = 'gray'
                              onPress = {() => {
                                //navigate to add purchase screen
                                //pass in budgetData
                                navigation.navigate('Add Purchase');
                          }}/>
                      </SafeAreaView>
                      <ScrollView style = {[styles.purchasesListTable, backgroundStyle]}>
                          {
                            iconNames.map((iconName, iconIndex) => {
                              return (
                                <PurchaseListItem key = {iconName} title = {categories[iconIndex]} iconName = {iconName}/>
                              );
                            })
                          }
                      </ScrollView>
                  </React.Fragment>    
              )
            }
        </SafeAreaView>
        <SafeAreaView style={styles.footer}>
          <Text>Budgeting App by @pnegus</Text>
        </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  radialGradient:{
    flex: 1,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 0.9,
  },
  footer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  purchasesListHeader: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
  },
  purchasesListTable: {
      flex: 1,
      width: '80%',
  },
  purchasesRowElement: {
    justifyContent: 'space-between',
    padding: 10,
  },
  budgetProgressContainer: {
      // paddingTop: 30,
      alignItems: 'center',
  },
  textDesc: {
      fontSize: 15,
      fontWeight: 'bold',
      padding: 10,
  },
});

export default MainMenuScreen;