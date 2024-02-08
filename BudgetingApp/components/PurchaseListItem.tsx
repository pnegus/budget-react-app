import React, {useContext} from 'react';
import { Icon, FAB, ListItem } from '@rneui/themed';
import { queryUserData } from './AppQueries';
import {Text, StyleSheet,useColorScheme} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { ThemeContext } from './Contexts';

function PurchaseListItem({title, iconName}): React.JSX.Element {
  const theme = useContext(ThemeContext);
  const backgroundStyle = {backgroundColor: theme === 'dark' ? Colors.darker : Colors.lighter};

  const [expanded, setExpanded] = React.useState(false);
  const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();

  return (
    <ListItem.Accordion
      containerStyle = {backgroundStyle}
      content={
        <React.Fragment>
          <ListItem.Content style = {styles.purchasesRowElement}>
            <Icon name= {iconName} type="material-community" color="grey" />
            <Text> {title} </Text>
            <Text> ${
              userData.purchases.reduce((acc, curr) => {
                return curr.name === title ? acc + curr.cost : acc;
              }, 0)
            } </Text>
          </ListItem.Content>
        </React.Fragment>
        }
      isExpanded={expanded}
      onPress={() => {setExpanded(!expanded)}}
    >
        {
              userData.purchases.map((purchase, index) => {
                return purchase.name === title ? 
                  (
                    <ListItem 
                      containerStyle = {[backgroundStyle]}
                      key = {purchase.name + index} 
                    >
                      <ListItem.Content style = {styles.purchasesRowElement}>
                        <Text> {purchase.date} </Text>
                        <Text> ${purchase.cost} </Text>
                      </ListItem.Content>
                    </ListItem>
                  ) : null;
              })
        }
    </ListItem.Accordion>
  );
}

const styles = StyleSheet.create({
  purchasesRowElement: {
    // display: 'flex',
    flexDirection: 'row',
    // width: '100%',
    justifyContent: 'space-between',
    // padding: 10,
    // alignItems: 'center',
  },
  submenuElement: {
    flexDirection: 'row',
  }
});

export default PurchaseListItem;