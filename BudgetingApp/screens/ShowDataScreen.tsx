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
    Dimensions,
  } from 'react-native';

import {
Colors,
DebugInstructions,
Header,
LearnMoreLinks,
ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

import { Pie } from 'react-native-progress';
import { queryUserData } from '../components/AppQueries';

const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    propsForLabels: {
        y: "32",
    }
  };
  
function ShowDataScreen(): React.JSX.Element {
    const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    let budget = userData === undefined ? 0 : userData.budget;
    let week = userData === undefined ? 0 : new Date(userData.week).toDateString();
    let categories = new Set();
    userData.purchases.forEach((purchase) => {
        categories.add(purchase.name);
    });
    let numCategories = categories.size;
    let colorIter = 0;
    let purchases = userData === undefined ? [] : userData.purchases.forEach((purchase) => {
            purchase.color = "rgba(" + colorIter + ","+ colorIter + "," + colorIter + ", 0.5" + ")";
            colorIter += Math.floor(255 / numCategories);
    })

    return (
        <SafeAreaView style={[backgroundStyle, styles.container]}>

            {userData.purchases !== undefined ? (
                <>
                    <Text>Your data for the week of {week}</Text>
                    <PieChart
                        data={userData.purchases}
                        width={Dimensions.get("window").width / 1.2}
                        height={Dimensions.get("window").height / 4.0}
                        chartConfig={chartConfig}
                        accessor={"cost"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        hasLegend={true}
                        center={[0, 0]}

                        // absolute
                        />
                </>) : 
                <Text style = {styles.textBox}>
                    No data found for the week of {week}.
                </Text>
            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 1,
        flexWrap: 'wrap',
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    textBox: {
        // flex: 0.5,
        // justifyContent: 'space-between',
        // alignItems: 'center',
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    }
});

export default ShowDataScreen;