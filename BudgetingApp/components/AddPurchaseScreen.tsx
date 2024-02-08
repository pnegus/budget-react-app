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
    FlatList,
  } from 'react-native';

import { 
Button,
ButtonGroup,
Input,
} from '@rneui/base';

import { Chip } from '@rneui/themed';

import {
Colors,
DebugInstructions,
Header,
LearnMoreLinks,
ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Toast from 'react-native-toast-message';

import { queryUserData, addUserPurchase } from './AppQueries';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { ThemeContext } from './Contexts';

const priceInput = React.createRef();

const purchaseTypeWheel = ["Food / Groceries", "Gas", "Bills", "Misc."];

function AddPurchaseScreen({ route, navigation }): React.JSX.Element {
    const queryClient = useQueryClient();
    const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();

    const theme = useContext(ThemeContext);
    const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};

    const pricePicker = Array(100).fill(1).map((n, i) => n + i);

    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [price, setPrice] = React.useState(0);
    const [addBtnDisabled, setAddBtnDisabled] = React.useState(true);

    const {mutate: mutateUserData} = addUserPurchase();

    return (
        <SafeAreaView style={[backgroundStyle, styles.purchaseContainer]}>

            <SafeAreaView style = {styles.purchaseScreenHeader}>
                <Text>Select purchase type: </Text>
            </SafeAreaView>

            <SafeAreaView style = {styles.priceTypeContainer}>
                <ButtonGroup 
                    buttons = {["Food / Groceries", "Gas", "Bills", "Misc."]}
                    selectedIndex = {selectedIndex} 
                    onPress = {(value) => {
                        setSelectedIndex(value);
                        price == 0 ? setAddBtnDisabled(true) : setAddBtnDisabled(false);
                    }}>
                </ButtonGroup>
            </SafeAreaView>

            <SafeAreaView style = {styles.purchaseScreenHeader}>
                <Text>Select purchase amount: ${price} </Text>
            </SafeAreaView>

            <SafeAreaView style = {styles.pricePickerContainer}>
                <FlatList data = {pricePicker} renderItem ={({item}) => 
                    <Button 
                        style = {styles.pricePickerElem} 
                        title = {item.toString()} 
                        onPress = {() => {
                            setPrice(item);
                            selectedIndex === null ? setAddBtnDisabled(true) : setAddBtnDisabled(false);
                        }}>
                    </Button>}> 
                </FlatList>
            </SafeAreaView>

            <SafeAreaView style = {styles.confirmButton}>
                <Chip disabled = {addBtnDisabled} title = "Add Purchase" onPress = {() => {
                        if (selectedIndex == null || price == 0) {
                            //display toast
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                            });
                        }
                        else {
                            const newPurchase = {name: purchaseTypeWheel[selectedIndex], cost: price, date: new Date().toLocaleDateString()};
                            mutateUserData(newPurchase);
                            navigation.navigate('Main Menu');
                        }
                    }}>  
                </Chip>
            </SafeAreaView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    purchaseContainer: {
        flex: 1,
        // justifyContent: 'space-between',
    },
    purchaseScreenHeader: {
        // flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        // alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
    },
    priceTypeContainer: {
        // transform: [{scaleX: 0.75}, {scaleY: 0.75}],
        // flex: .25,
        justifyContent: 'center',
        // flexDirection: 'row',
        flexWrap: 'wrap',
        // width: '75%',
    },
    pricePickerElem: {
        // width: "50%",
    },
    pricePickerContainer: {
        flex: 0.75,
        alignSelf: 'center',
        paddingBottom: 30,
        width: '50%',
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // justifyContent:/\ 'center',
    },
    confirmButton: {
        padding: 10,
        // width: '20%',
        alignSelf: 'center',
    },
});

export default AddPurchaseScreen;