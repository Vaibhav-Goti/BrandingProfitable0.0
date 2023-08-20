import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image, ActivityIndicator, Modal, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Header';


const { width, height } = Dimensions.get('window')

const MlmUserInReview = () => {

    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        retrieveProfileData()
    }, [retrieveProfileData])

    const retrieveProfileData = async () => {
        try {
            const dataString = await AsyncStorage.getItem('profileData');
            if (dataString) {
                const data = JSON.parse(dataString);
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error retrieving profile data:', error);
        }
    };

    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const businessOrPersonal = await AsyncStorage.getItem(
                'BusinessOrPersonl',
            );
            setBusinessOrPersonal(businessOrPersonal);
        };

        fetchData();
    });

    return (
        <LinearGradient colors={['black', '#000']} locations={[0.2, 1]} style={{ flex: 1, marginBottom: 50 }}>

            {/* header */}
            <Header />

            <View style={{ justifyContent: 'center', alignItems: "center", flex: 1 }}>
                <Image source={require('../assets/bubble-loader.gif')} style={{ height: width - 170, width: width - 140, }} />
                <View style={{ margin: 20, marginTop: -140, paddingHorizontal: 30 }}>
                    <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Manrope-Bold', textAlign: 'center' }}>
                        Your Payment Request Under Review Now!
                    </Text>
                </View>
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        height: 65,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 5
    },
    headerText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    buisnessTitle: {
        fontSize: 19,
        color: 'black',
        fontFamily: 'Manrope-Bold'
    },
    yourBuisness: {
        fontSize: 12,
        fontFamily: 'Manrope-Regular'
    },
    //modal
    // Style for the modal content
    modalContent: {
        height: "60%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        width,
        borderRadius: 20
    },

    // Style for the button inside the modal to close it
    modalCloseButton: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 0,
        right: 0
    },

    //imput 
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
        width: '90%',
        marginTop: 20,
    },
    labelContainer: {
        width: '90%',
        alignItems: 'flex-start'
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15
    },
})

export default MlmUserInReview;
