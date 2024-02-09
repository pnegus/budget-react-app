import React, { useState } from 'react';
import { Button, Overlay, Icon, ListItem } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

function SettingsOverlay({title, icon, content, action}): React.JSX.Element {
const [visible, setVisible] = useState(false);

const toggleOverlay = () => {
  setVisible(!visible);
};

return (
    <ListItem
        onPress = {toggleOverlay}
        >
        {icon}
        <ListItem.Content>
            <ListItem.Title> {title} </ListItem.Title>
        </ListItem.Content>

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            {content}
            <Button
                icon={
                <Icon
                    name="wrench"
                    type="font-awesome"
                    color="white"
                    iconStyle={{ marginRight: 10 }}
                />
                }
                title="Confirm"
                onPress={
                    () => {
                        try {
                            action();
                            toggleOverlay();
                        }
                        catch (e) {
                            Toast.show({
                                type: 'error',
                                text1: e,
                            });
                        }
                    }
                }
            />
        </Overlay>
    <ListItem.Chevron />
    </ListItem>
);
};

const styles = StyleSheet.create({
button: {
  margin: 10,
},
textPrimary: {
  marginVertical: 20,
  textAlign: 'center',
  fontSize: 20,
},
textSecondary: {
  marginBottom: 10,
  textAlign: 'center',
  fontSize: 17,
},
});

export default SettingsOverlay;