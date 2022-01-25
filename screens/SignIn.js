import React, { useState } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity } from "react-native";
import FormError from '../Components/FormError';
import { firebase } from '../Firebase/firebase';
import FormSuccess from '../Components/FormSuccess';
const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [displayFormErr, setDisplayFormErr] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function navigate() {
        navigation.navigate('signUp');
    }

    const validateInput = () => {
        var form_inputs = [email, password];

        if (form_inputs.includes('') || form_inputs.includes(undefined)) {
            setErrorMessage("Please fill in all fields");
            return setDisplayFormErr(true);
        }

        setIsLoading(true);
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                setIsLoading(false);
            })
            .catch(err => {
                setErrorMessage(err.message);
                setIsLoading(false);
                return setDisplayFormErr(true);
            })

    }

    return (
        <View style={styles.container}>

            <View style={styles.BottomView}>
                <Text style={styles.Heading}>
                    Welcome
                </Text>
                <View style={styles.FormView}>
                    <TextInput value={email} onChangeText={(val) => setEmail(val)} placeholder={"Email address*"} placeholderTextColor={"#fff"} style={styles.TextInput} />
                    <TextInput value={password} onChangeText={(val) => setPassword(val)} secureTextEntry={true} placeholder={"Password*"} secureTextEntry={true} placeholderTextColor={"#fff"} style={styles.TextInput} />
                    <TouchableOpacity style={styles.Button} onPress={validateInput}>
                        <Text style={styles.ButtonText}>Sign in</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.TextButton} onPress={navigate}>
                    <Text style={styles.SignUpText}>Sign up</Text>
                </TouchableOpacity>
            </View>
            {displayFormErr == true ?
                <FormError hideErrOverlay={setDisplayFormErr} err={errorMessage} />
                :
                null
            }

            {isLoading == true ?
                <FormSuccess />
                :
                null
            }
        </View>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    BottomView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'tomato',
    },
    Heading: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
        marginLeft: 30,
        marginTop: 60
    },
    FormView: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 30
    },
    TextInput: {
        width: '90%',
        borderWidth: 1,
        borderColor: '#fff',
        height: 52,
        borderRadius: 10,
        paddingLeft: 5,
        marginTop: 20,
        color: '#fff'
    },
    Button: {
        width: '90%',
        color: '#000',
        height: 52,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ButtonText: {
        fontWeight: 'bold',
        fontSize: 18
    },
    SignUpText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    TextButton: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 20
    }
})