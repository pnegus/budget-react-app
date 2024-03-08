import React, {useContext, useCallback} from 'react';
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

import { Chip, ListItem } from '@rneui/themed';

import {
Colors,
DebugInstructions,
Header,
LearnMoreLinks,
ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Toast from 'react-native-toast-message';

import { queryUserData, addUserPurchase } from '../components/AppQueries';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { ThemeContext } from '../components/Contexts';

const priceInput = React.createRef();

const purchaseTypeWheel = ["Food", "Gas", "Bills", "Misc."];

function AddPurchaseScreen({ route, navigation }): React.JSX.Element {
    const theme = useContext(ThemeContext);
    const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};

    const pricePicker = Array(100).fill(1).map((n, i) => n + i);

    const [categoryIndex, setCategoryIndex] = React.useState(null);
    const [priceIndex, setPriceIndex] = React.useState(0);
    const [price, setPrice] = React.useState(1);
    const [addBtnDisabled, setAddBtnDisabled] = React.useState(true);

    const {mutate: mutateUserData} = addUserPurchase();

    const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
        if (viewableItems.length === 0) {
            return;
        }
        setPriceIndex(viewableItems[0].index);
        setPrice(viewableItems[0].item);
        categoryIndex === null ? setAddBtnDisabled(true) : setAddBtnDisabled(false);
        // console.log("Visible items are", viewableItems);
        // console.log("Changed in this iteration", changed);
    }, []);

    return (
        <SafeAreaView style={[backgroundStyle, styles.purchaseContainer]}>

            <SafeAreaView style = {styles.purchaseScreenHeader}>
                <Text>Select purchase type: </Text>
            </SafeAreaView>

            <SafeAreaView style = {styles.priceTypeContainer}>
                <ButtonGroup 
                    buttons = {["Food", "Gas", "Bills", "Misc."]}
                    selectedIndex = {categoryIndex} 
                    onPress = {(value) => {
                        setCategoryIndex(value);
                        price == 0 ? setAddBtnDisabled(true) : setAddBtnDisabled(false);
                    }}>
                </ButtonGroup>
            </SafeAreaView>

            <SafeAreaView style = {styles.purchaseScreenHeader}>
                <Text>Select purchase amount: ${price} </Text>
            </SafeAreaView>

            <SafeAreaView style = {styles.pricePickerContainer}>
                <FlatList 
                    ref={(ref) => {
                        this.flatListRef = ref;
                    }}
                    onMomentumScrollEnd={(event) => {
                        // work with: index
                        this.flatListRef.scrollToIndex({animated: true, index: priceIndex});
                    }}
                    onViewableItemsChanged={_onViewableItemsChanged}
                    showsVerticalScrollIndicator={false}
                    data = {pricePicker} 
                    renderItem ={({item}) => 
                        <ListItem 
                            containerStyle = {[styles.priceElemContainer, {backgroundColor: item === price ? 'gray' : 'transparent'}]}
                            >
                            <ListItem.Content style = {styles.pricePickerElem}>
                                <Text>{item}</Text>
                            </ListItem.Content>
                        </ListItem>}> 
                </FlatList>
            </SafeAreaView>

            <SafeAreaView style = {styles.confirmButton}>
                <Chip disabled = {addBtnDisabled} title = "Add Purchase" onPress = {() => {
                        if (categoryIndex == null || price == 0) {
                            //display toast
                            Toast.show({
                                type: 'error',
                                text1: 'Error',
                            });
                        }
                        else {
                            const newPurchase = {name: purchaseTypeWheel[categoryIndex], cost: price, date: new Date().toLocaleDateString()};
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
        alignItems: 'center',
    },
    priceElemContainer: {
        // padding: 10,
        // width: '50%',
        // alignSelf: 'center',
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