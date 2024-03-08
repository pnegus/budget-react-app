/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import FirstLaunchScreen from './screens/FirstLaunchScreen';
import AddPurchaseScreen from './screens/AddPurchaseScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import EditPurchaseScreen from './screens/EditPurchaseScreen';
import SettingsScreen from './screens/SettingsScreen';
import {ThemeContext} from './components/Contexts';

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
import GettingStartedScreen from './screens/GettingStartedScreen';

let checkFirstLaunchAsync = async (): Promise<boolean> => {
  let hasBeenLaunched = await AsyncStorage.getItem('hasBeenLaunched');
  return hasBeenLaunched === null ? false : true;
}

let setLaunchAsync = async (): Promise<void> => {
  await AsyncStorage.setItem('hasBeenLaunched', 'true');
}

const queryClient = new QueryClient();

//CREATE NAVIGATOR STACKS
const StackNav = createNativeStackNavigator();

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

  const theme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};

  return (
    <ThemeContext.Provider value = {theme}>
      <QueryClientProvider client = {queryClient}>
        <NavigationContainer>

          {
            hasBeenLaunched === null ? (
              <SafeAreaView style = {[styles.default, backgroundStyle]}><ActivityIndicator size = "large"/></SafeAreaView>
                ) : 
                  hasBeenLaunched === false ? (
                    <>
                        <StackNav.Navigator>
                        <StackNav.Screen name = "Welcome" component = {FirstLaunchScreen}/>
                        <StackNav.Screen name = "Get Started" component = {GettingStartedScreen}/> 
                        <StackNav.Screen name = "Main Menu" component = {MainMenuScreen} options={{
                            title: "Main Menu",
                            headerTitleStyle:{
                                fontWeight:'bold',
                            },
                            headerBackVisible:false
                          }}/>
                        <StackNav.Screen name = "Settings" component = {SettingsScreen}/>
                        <StackNav.Screen name = "Add Purchase" component = {AddPurchaseScreen}/>
                        <StackNav.Screen name = "InfoContainerScreen" component = {EditPurchaseScreen}/>
                        </StackNav.Navigator>
                        </>
                  ) : 
                  (
                    <>
                        <StackNav.Navigator>
                        <StackNav.Screen name = "Main Menu" component = {MainMenuScreen}/>
                        <StackNav.Screen name = "Settings" component = {SettingsScreen}/>
                        <StackNav.Screen name = "Add Purchase" component = {AddPurchaseScreen}/>
                        <StackNav.Screen name = "InfoContainerScreen" component = {EditPurchaseScreen}/>
                        </StackNav.Navigator>

                        <Toast></Toast>
                    </>
                  )
            }
      </NavigationContainer>

      </QueryClientProvider>
    </ThemeContext.Provider>
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
