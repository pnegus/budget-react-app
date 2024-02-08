import React from 'react';
import { Icon, FAB, ListItem } from '@rneui/themed';
import { queryUserData } from './AppQueries';
import {Text, StyleSheet} from 'react-native';

function PurchaseListItem({indexKey, title, iconName}): React.JSX.Element {
  const [expanded, setExpanded] = React.useState(false);
  const {data: userData, isPending: isUserDataPending, error: userDataError} = queryUserData();

  return (
    <ListItem.Accordion
      key = {indexKey}
      content={
        <React.Fragment>
          <Icon name= {iconName} type="material-community" color="grey" />
          <ListItem.Content>
            <ListItem.Title> {title} </ListItem.Title>
            <ListItem.Title> Total: ${
              userData.purchases.reduce((acc, curr) => {
                return curr.name === title ? acc + curr.cost : acc;
              }, 0)
            } </ListItem.Title>
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
                      key = {index} 
                      style = {styles.purchasesRowElement}>
                      <ListItem.Content>
                        <ListItem.Title> {purchase.date} </ListItem.Title>
                        <ListItem.Title> Cost: ${purchase.cost} </ListItem.Title>
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
    justifyContent: 'space-between',
    padding: 10,
  },
});

export default PurchaseListItem;