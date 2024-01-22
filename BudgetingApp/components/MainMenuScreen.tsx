import React from 'react';
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

  import { 
    Button,
  } from '@rneui/base';

//DATA IMPORTS
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PropsWithChildren} from 'react';
import {useState, useEffect } from 'react';
import { queryUserData } from './AppQueries';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

//NAVIGATION IMPORTS
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContextMenu from "react-native-context-menu-view";

//STYLES IMPORTS
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { LinearGradient } from 'react-native-linear-gradient';
import { RadialGradient } from 'react-native-svg';

function MainMenuScreen({ route, navigation }): React.JSX.Element {

  const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();
  const purchaseTotal = userData === undefined ? null : userData.purchases.reduce((acc, init) => acc + init.cost, 0);

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
                      <SafeAreaView style = {styles.budgetProgressContainer}>
                          <Text style = {styles.textDesc}> Current Weekly Budget: ${userData.budget}</Text>
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
                          <Button title = "+" onPress = {() => {
                              //navigate to add purchase screen
                              //pass in budgetData
                              navigation.navigate('Add Purchase');
                          }}/>
                      </SafeAreaView>
                      <ScrollView style = {styles.purchasesListTable}>
                          {
                              userData.purchases.map((purchase, index) => {
                                  return (
                                      <SafeAreaView key = {index} style = {styles.purchasesRowElement}>
                                          <Text>{purchase.name}</Text>
                                          <Text>{purchase.cost}</Text>
                                      </SafeAreaView>
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
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.9,
  },
  footer: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  purchasesListHeader: {
      flex: 0.,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
  },
  purchasesListTable: {
      flex: 1,
      width: '80%',
      // borderWidth: 0.5,
      // borderRadius: 5,
      // justifyContent: 'center',
  },
  purchasesRowElement: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'center',
      alignItems: 'center',
      width: '60%',
      // borderWidth: 0.5,
      // borderRadius: 5,
  },
  budgetProgressContainer: {
      paddingTop: 10,
      width: '80%',
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
  },
  textDesc: {
      fontSize: 15,
      fontWeight: 'bold',
      padding: 10,
  },
});

export default MainMenuScreen;