/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import FirstLaunchScreen from './components/FirstLaunchScreen';
import AddPurchaseScreen from './components/AddPurchaseScreen';
import MainMenuScreen from './components/MainMenuScreen';
import EditPurchaseScreen from './components/EditPurchaseScreen';
import SettingsScreen from './components/SettingsScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import React from 'react';
import type {PropsWithChildren} from 'react';
import {useState, useEffect } from 'react';
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
  Colors,
} from 'react-native/Libraries/NewAppScreen';

let checkFirstLaunchAsync = async (): Promise<boolean> => {
  let hasBeenLaunched = await AsyncStorage.getItem('hasBeenLaunched');
  return hasBeenLaunched === null ? false : true;
}

let setLaunchAsync = async (): Promise<void> => {
  await AsyncStorage.setItem('hasBeenLaunched', 'true');
}

const queryClient = new QueryClient();

//CREATE NAVIGATOR STACKS
const FirstLaunchStack = createNativeStackNavigator();
const MainAppStack = createNativeStackNavigator();

function App(): React.JSX.Element {
  //check if app has been launched, then set flag
  const [hasBeenLaunched, setHasBeenLaunched] = React.useState<boolean | null>(null);

  //oneshot useeffect
  useEffect(() => {
    checkFirstLaunchAsync().then((result) => {
      setHasBeenLaunched(result);
      setLaunchAsync();
    });
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    hasBeenLaunched === null ? (
      <SafeAreaView style = {styles.default}><ActivityIndicator size = "large"/></SafeAreaView>
    ) : 
    hasBeenLaunched === false ? (
      <NavigationContainer>
        <FirstLaunchStack.Navigator>
          <FirstLaunchStack.Screen name = "Welcome" component = {FirstLaunchScreen}/>
        </FirstLaunchStack.Navigator>
      </NavigationContainer>
    ) : 
    (
      <QueryClientProvider client = {queryClient}>
        <NavigationContainer>
          <MainAppStack.Navigator>
            <MainAppStack.Screen name = "Main Menu" component = {MainMenuScreen}/>
            <MainAppStack.Screen name = "Settings" component = {SettingsScreen}/>
            <MainAppStack.Screen name = "Add Purchase" component = {AddPurchaseScreen}/>
            <MainAppStack.Screen name = "InfoContainerScreen" component = {EditPurchaseScreen}/>
          </MainAppStack.Navigator>
          <Toast></Toast>
        </NavigationContainer>
      </QueryClientProvider>
    )
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
