import React, {useContext} from 'react';
import type {PropsWithChildren} from 'react';
import {
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
DebugInstructions,
Header,
LearnMoreLinks,
ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Icon, FAB, Input } from '@rneui/themed';

import SettingsOverlay from '../components/SettingsOverlay';
import { resetData, editUserBudget } from '../components/AppQueries';
import EditPurchaseScreen from './EditPurchaseScreen';
import ShowDataScreen from './ShowDataScreen';

import { ThemeContext } from '../components/Contexts';


function SettingsScreen(): React.JSX.Element {
    const theme = useContext(ThemeContext);
    const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};

    const {mutate: mutateUserBudget} = editUserBudget();
    const editBudgetInput = React.createRef();
    const [budget, setBudget] = React.useState(0);

    const {mutate: resetUserBudget} = resetData();

    return (
        //settingsoverlay is poorly named, these are the components corresponding to each individual setting option
        <SafeAreaView style={backgroundStyle}>
            <SettingsOverlay 
                title = "Edit Weekly Budget" 
                icon = {<Icon name="pencil" type="material-community" color="grey" />} 
                content = {
                    <View>
                        <Text>Enter new weekly budget:</Text>
                        <Input 
                            ref = {editBudgetInput}
                            onChangeText = {(text) => {
                                setBudget(Number.parseInt(text));
                            }}
                        >
                        </Input>
                    </View>
                }
                action = {
                    () => {
                        if (budget <= 0 || budget >= 1000000 || isNaN(budget)) {
                            throw "Invalid input";
                        }
                        mutateUserBudget(budget);
                    }
                }
                />
            <SettingsOverlay 
                title = "Edit Purchase Categories" 
                icon = {<Icon name="pencil" type="material-community" color="grey" />} 
                content = {<EditPurchaseScreen></EditPurchaseScreen>}
                action = {null}
                />
            <SettingsOverlay 
                title = "View Weekly Budget Data" 
                icon = {<Icon name="file-chart" type="material-community" color="grey" />} 
                content = {<ShowDataScreen></ShowDataScreen>}
                action = {null}
                />
            <SettingsOverlay 
                title = "Delete All Data" 
                icon = {<Icon name="trash-can-outline" type="material-community" color="grey" />} 
                content = {
                    <View>
                        <Text>Are you sure you want to delete all data?</Text>
                    </View>
                }
                action = {() => resetUserBudget()}
                />
        </SafeAreaView>
    );
}

export default SettingsScreen;