import { View, Text, StyleSheet, Button, Image, Dimensions, TouchableHighlight, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LinearGradient from 'react-native-linear-gradient'
import { findFocusedRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';


const { width } = Dimensions.get('window')

const BuisnessOrPersonal = ({ navigation }) => {

    const handleBuisnessButton = async () => {
        try {
            AsyncStorage.setItem('BusinessOrPersonl', 'business')
        } catch (error) {
            console.log(error)
        }
        navigation.navigate('LoginScreen')
    }
    const handlePersonalButton = async () => {
        try {
            AsyncStorage.setItem('BusinessOrPersonl', 'personal')
        } catch (error) {
            console.log(error)
        }
        navigation.navigate('LoginScreen')
    }

    return (
        // <View style={styles.container}>
        //     <Text style={styles.title}>Choose Your Profession</Text>
        //     <View style={{ marginBottom: 16, }} >
        //         <Button title="Login as a Buisnessman" onPress={handleBuisnessButton} />
        //     </View>
        //     <Button title="Login For Personal USe" onPress={handlePersonalButton} />
        // </View>
        <LinearGradient
            colors={['#050505', '#1A2A3D']}
            style={styles.container}>
            <View>

            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.logoContainer}>
                    <FastImage source={require('../assets/B_Profitable_Logo.png')} style={styles.image} />
                </View>
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
                        Welcome To
                    </Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: '#FF0000' }]} >
                        Branding
                        <Text style={styles.text}>
                            {" Profitable"}
                        </Text>
                    </Text>
                </View>
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
                        Say hello to your new desining partner app
                    </Text>
                </View>
            </View>
            <View style={styles.mainContainer}>
                <TouchableHighlight onPress={handleBuisnessButton} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: 200, height: 40, alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
                    <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                        Use App for Personal
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight onPress={handlePersonalButton} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: 200, height: 40, alignItems: 'center', justifyContent: 'center', elevation: 5 }} >
                    <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                        Use App for Business
                    </Text>
                </TouchableHighlight>
            </View>
        </LinearGradient>
    )
}

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
        fontSize: 22
    },
    logoContainer: {
        height: 108,
        width: 108,
        backgroundColor: '#9FA2A6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 70,
        height: 78
    },
    textContainer: {
        paddingVertical: 10,
        paddingTop: 0
    },
    mainContainer: {
        height: 300,
        width: width,
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }

})

export default BuisnessOrPersonal