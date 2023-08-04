import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, Text, Alert, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get(('window'))

const LoginScreen = ({ navigation }) => {

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [Cpassword, setCPassword] = useState('')

    // business or personal

    const [businessOrPersonal, setBusinessOrPersonal] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl')
            setBusinessOrPersonal(businessOrPersonal)
        }

        fetchData();
    })

    // profile data

    const profileData = {
        fullName,
        phone,
        password
    }

    // navigate to signup

    const handleLogin = () => {
        if (fullName == '' && phone == "", password == '') {
            Alert.alert("PLease Enter All details")
        } else {
            if (password == Cpassword) {
                navigation.navigate('SignUp2Screen', profileData)
            } else {
                Alert.alert("Please Enter Same Password")
            }
        }
    };

    return (
        // <View style={styles.container}>
        //     <Text style={styles.title}>
        //         Sign Up
        //     </Text>
        //     <View style={styles.inputContainer}>
        //         <TextInput
        //             style={styles.input}
        //             placeholder="Full Name"
        //             value={fullName}
        //             onChangeText={setFullName}
        //             autoCapitalize="words"
        //         />
        //         <TextInput
        //             style={styles.input}
        //             placeholder="Phone"
        //             value={phone}
        //             onChangeText={setPhone}
        //             autoCapitalize="none"
        //             maxLength={10}
        //             keyboardType='numeric'
        //         />
        //         <TextInput
        //             style={styles.input}
        //             placeholder="Password"
        //             value={password}
        //             onChangeText={setPassword}
        //             secureTextEntry
        //         />
        //         {(password != Cpassword) &&
        //             <Text style={styles.RedColorText}> password not match</Text>
        //         }
        //         <TextInput
        //             style={styles.input}
        //             placeholder="Confirm Password"
        //             value={Cpassword}
        //             onChangeText={setCPassword}
        //             secureTextEntry
        //         />
        //     </View>
        //     <Text style={styles.signupText} onPress={() => { navigation.goBack() }}>I Already have an account</Text>
        //     <Button
        //         title="Next"
        //         buttonStyle={styles.loginButton}
        //         onPress={handleLogin}
        //     />
        // </View>
        // 
        <LinearGradient
            colors={['#050505', '#1A2A3D']}
            style={styles.container}>
            <TouchableOpacity style={{ padding: 20, alignSelf: 'flex-start', paddingBottom: 0 }} onPress={() => { navigation.goBack() }}>
                <Text style={{ color: 'white' }}>
                    <Icon name="angle-left" size={34} />
                </Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
                <View style={styles.logoContainer}>
                    <FastImage source={require('../assets/B_Profitable_Logo.png')} style={styles.image} />
                </View>
                {/* <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: '#FF0000' }]} >
                        Branding
                        <Text style={styles.text}>
                            {" Profitable"}
                        </Text>
                    </Text>
                </View> */}
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={[styles.text, { fontFamily: 'Poppins-Bold', fontSize: 20, textAlign: 'center' }]}>
                        Sign Up
                    </Text>
                </View>
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center' }]}>
                        Say hello to your new desining partner app
                    </Text>
                </View>
            </View>
            <ScrollView style={styles.mainContainer}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={[styles.labelContainer,{marginTop:40}]}>
                        <Text style={styles.label}>
                            Enter Name
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Enter Mobile
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            autoCapitalize="none"
                            maxLength={10}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Enter Password
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>
                            Enter Password
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={Cpassword}
                            onChangeText={setCPassword}
                            secureTextEntry
                        />
                    </View>
                    <TouchableHighlight onPress={handleLogin} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "70%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5 }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Next
                        </Text>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }} style={{ padding: 5, marginTop: 0, marginBottom:40 }}>
                        <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 14, textDecorationLine: 'underline' }}>
                            I have an Account
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 16
    },
    logoContainer: {
        height: 80,
        width: 80,
        backgroundColor: '#9FA2A6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 60
    },
    textContainer: {
        paddingVertical: 10
    },
    mainContainer: {
        maxHeight: 500,
        width: width,
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 30,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#333',
        fontFamily: 'Manrope-Regular',

    },
    inputContainer: {
        width: '70%',
        marginTop: 20,
    },
    labelContainer: {
        width: '70%',
        alignItems: 'flex-start'
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15
    }

});

export default LoginScreen;
