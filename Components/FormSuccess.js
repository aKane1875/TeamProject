import React from 'react';
import { Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';
const FormSuccess = (props) => {
    return (
        props.successMessage ?
            <Overlay overlayStyle={styles.Overlay} isVisible={true} onBackdropPress={() => props.close('')}>
                <Text style={styles.successMessage}>
                    {props.successMessage}
                </Text>
            </Overlay>
            :
            <Overlay overlayStyle={styles.Overlay} isVisible={true}>
                <ActivityIndicator size={"large"} color={"#2FBBF0"} />
            </Overlay>


    )
}

export default FormSuccess;
const styles = StyleSheet.create({
    Overlay: {
        width: '90%',
        height: 320,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorIcon: {
        width: 72,
        height: 72,
    },
    successMessage: {
        color: "#000",
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center'
    },
})