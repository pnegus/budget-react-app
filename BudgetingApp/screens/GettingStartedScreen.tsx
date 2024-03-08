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

import { Icon, FAB, ListItem } from '@rneui/themed';

function GettingStartedScreen({route, navigation}): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    return (
        <SafeAreaView style={[backgroundStyle, styles.containerStyle]}>
            <Text>Get started now!</Text>
            <FAB 
                icon = {{name: 'arrow-forward', color: 'white'}} 
                size = 'small' 
                color = 'gray'
                onPress = {() => {
                navigation.navigate('Main Menu');
            }}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GettingStartedScreen;