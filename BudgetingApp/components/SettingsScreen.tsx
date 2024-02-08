import React from 'react';
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

import { ListItem } from '@rneui/themed';
import { Icon, FAB } from '@rneui/themed';


function SettingsScreen(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={backgroundStyle}>
            <ListItem>
                <Icon name="pencil" type="material-community" color="grey" />
                <ListItem.Content>
                <ListItem.Title>Edit Weekly Budget</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem>
                <Icon name="pencil" type="material-community" color="grey" />
                <ListItem.Content>
                <ListItem.Title>Add Purchase Category</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem>
                <Icon name="file-chart" type="material-community" color="grey" />
                <ListItem.Content>
                <ListItem.Title>View All Data</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
            <ListItem>
                <Icon name="trash-can-outline" type="material-community" color="grey" />
                <ListItem.Content>
                <ListItem.Title>Delete All Data</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        </SafeAreaView>
    );
}

export default SettingsScreen;