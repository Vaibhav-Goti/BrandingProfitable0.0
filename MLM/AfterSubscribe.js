// change the fontawesome 5 to fontawesome 6

import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator, Modal, ScrollView, ToastAndroid } from 'react-native';
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import Header from '../Header';
const { height, width } = Dimensions.get('window')

const AfterSubscribe = () => {
    const navigation = useNavigation();

    const [profileData, setProfileData] = useState(null);
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };

    const handleCopyToClipboard = () => {
        const textToCopy = profileData?.adhaar; // Text you want to copy
        const stringText = JSON.stringify(textToCopy)
        Clipboard.setString(stringText);
        showToastWithGravity("Referal is Copied to ClipBoard")
    };

    useEffect(() => {
        const fetchData = async () => {
            const businessOrPersonal = await AsyncStorage.getItem(
                'BusinessOrPersonl',
            );
            setBusinessOrPersonal(businessOrPersonal);
        };

        fetchData();
    });

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

    const [userTeamDetails, setUserTeamDetails] = useState([])

    // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

    // all users details 

    const fetchDetails = async () => {
        try {
            if (profileData) {
                console.log('Checking subscription status...');

                const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.adhaar}`);
                const result = response.data;

                setUserTeamDetails(result)
            } else {
                console.log('details malti nathi!')
            }
        } catch (error) {
            console.log('Error fetching data...:', error);
        }
    }

    useEffect(() => {
        fetchDetails();
    })

    if (userTeamDetails.length == 0) {
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'black'} />
            </View>
        )
    }

    

    return (
        <LinearGradient colors={['#20AE5C', '#000']} locations={[0.2, 1]} style={{ flex: 1, marginBottom: 50 }}>
            <ScrollView style={{ flex: 1, minHeight: height }}>
                {/* 1 */}
                <View style={{ height: 220, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderBottomRightRadius: 20, borderBottomLeftRadius: 20, justifyContent: 'space-between', overflow: "hidden" }}>

                    {/* header */}
                   <Header />

                    <View style={{ justifyContent: 'center', alignItems: 'center', gap: 10 }}>

                        <View>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                {userTeamDetails?.data?.totalRewards}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, textDecorationLine: 'underline', }}>
                                Total Earnings
                            </Text>
                        </View>

                    </View>

                    {/* main content */}

                    <View style={{ height: '25%', backgroundColor: 'rgba(255, 255, 255, 0.5)', justifyContent: 'space-around', paddingHorizontal: 20, }}>

                        {/* 1 */}
                        <View style={{ height: 80, width: '100', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                                <Text style={{ color: 'red', paddingHorizontal: 10, }}>
                                    <FontAwesome6 name="sack-dollar" size={30} color="#E31E25" />
                                </Text>
                                <View>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#E31E25' }}>
                                        Pending Earnings
                                    </Text>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                        ₹ {userTeamDetails?.data?.redWallet}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                                    <FontAwesome6 name="sack-dollar" size={30} color="#42FF00" />
                                </Text>
                                <View>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#42FF00' }}>
                                        Current Earnings
                                    </Text>
                                    <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                        ₹ {userTeamDetails?.data?.greenWallet}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>

                </View>

                {/* 2 */}

                <View style={{ height: 100, justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: 'rgba(0, 0, 0, 0.4)', marginTop: 30, borderRadius: 10 }}>
                    <View>

                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                            {userTeamDetails?.data?.totalTeam}
                        </Text>

                    </View>
                    <TouchableOpacity onPress={() => { navigation.navigate('MLMScreen2', {'aadhar':profileData?.adhaar}) }}>
                        <Text style={{ color: '#00D3FF', fontFamily: 'Manrope-Bold', fontSize: 15, textDecorationLine: 'underline', }}>
                            Total Team
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 3 */}

                <View style={{ height: 180, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 30, borderRadius: 10 }}>
                    <View style={{ borderRadius: 10, height: '100%', width: '45%', backgroundColor: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between' }}>

                        <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                Right Side
                            </Text>
                        </View>

                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '87%', gap: 10 }}>
                                {/* 1 */}
                                <View style={{ gap: 5, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, }}>
                                        Total Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails?.data?.rightSideTotalJoining}
                                        </Text>
                                    </View>
                                </View>
                                {/* 2 */}
                                <View style={{ gap: 5, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, }}>
                                        Today Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails?.data?.rightSideTodayJoining}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                    {/* 2 */}
                    <View style={{ borderRadius: 10, height: '100%', width: '45%', backgroundColor: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', alignItems: 'center', justifyContent: 'space-between' }}>

                        <View style={{ height: 40, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                Left Side
                            </Text>
                        </View>

                        <View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '87%', gap: 10 }}>
                                {/* 1 */}
                                <View style={{ gap: 5, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, }}>
                                        Total Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails?.data?.leftSideTotalJoining}
                                        </Text>
                                    </View>
                                </View>
                                {/* 2 */}
                                <View style={{ gap: 5, alignItems: 'center', justifyContent: 'center' }}>

                                    <Text style={{ color: 'lightgray', fontFamily: 'Manrope-Bold', fontSize: 15, }}>
                                        Today Joinings
                                    </Text>
                                    <View>
                                        <Text style={{ color: 'white', fontFamily: 'Manrope-Bold', fontSize: 20 }}>
                                            {userTeamDetails?.data?.leftSideTodayJoining}
                                        </Text>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                </View>

                {/* 4 */}

                <View style={{ height: 60, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.5)', marginTop: 30, borderRadius: 20, overflow: "hidden", borderWidth:1,borderColor:'white' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '60%' }}>
                        <Text style={{ fontFamily: 'Manrope-Bold', color: 'white', fontSize: 18 }}>
                            {profileData?.adhaar}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={{ backgroundColor: "white", height: '100%', width: '40%', alignItems: "center", justifyContent: 'center' }}
                        onPress={handleCopyToClipboard} // Call the function on button press
                    >
                        <Text style={{ color: 'black', fontFamily: "Manrope-Bold", fontSize: 18 }}>
                            Share Link
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 5 */}

                <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: 30, borderRadius: 10, marginBottom: 50 }}>

                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text >
                                    <MaterialIcons name="headset-mic" size={16} color="white" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                                Privacy Policy
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="white" />
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text >
                                    <MaterialIcons name="privacy-tip" size={16} color="#E31E25" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: '#E31E25', marginLeft: 10 }}>
                                Help
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="#E31E25" />
                        </Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 10, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('WalletApp') }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                                <Text >
                                    <MaterialIcons name="wallet" size={16} color="white" />
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                                Wallet
                            </Text>
                        </View>

                        <Text>
                            <Icon name="angle-right" size={30} color="white" />
                        </Text>

                    </TouchableOpacity>

                </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default AfterSubscribe

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

})