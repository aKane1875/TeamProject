import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { auth } from '../Firebase/firebase';
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
    const [email, setEmail] = useState("");

    const resetPassword = () => {
        sendPasswordResetEmail(auth, email)
    };

    return (
        <View style={styles.container}>
            <View style={styles.BottomView}>
            <Text style={styles.Heading}>Password Reset</Text>
                <View style={styles.ResetView}>
                    <TextInput
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                        placeholder={"Email address*"}
                        placeholderTextColor={"#fff"}
                        style={styles.TextInput}
                    />
                    <TouchableOpacity style={styles.Button}
                    onPress={() => resetPassword()}
                    >
                        <Text style={styles.ButtonText}>Reset my password</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    BottomView: {
        width: "100%",
        height: "100%",
        backgroundColor: "tomato",
    },
    Heading: {
        color: "#fff",
        fontSize: 40,
        fontWeight: "bold",
        marginLeft: 30,
        marginTop: 60,
      },
    ResetView: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 30,
    },
    TextInput: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#fff",
        height: 52,
        borderRadius: 10,
        paddingLeft: 5,
        marginTop: 20,
        color: "#fff",
    },
    Button: {
        width: "90%",
        color: "#000",
        height: 52,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginTop: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    ButtonText: {
        fontWeight: "bold",
        fontSize: 18,
    },
});
