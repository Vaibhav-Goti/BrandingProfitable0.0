import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import React, {useState} from 'react'
import LinearGradient from 'react-native-linear-gradient'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window')

const Wallet = ({ navigation }) => {
    
    const [userTeamDetails, setUserTeamDetails] = useState([])

    console.log(userTeamDetails)
    

    // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

    // all users details 

        const [profileData, setProfileData] = React.useState(null);
    React.useEffect(() => {
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

    const fetchDetails = async () => {
        try {
            if (profileData) {
                console.log('Checking subscription status...wallet');

                const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/abc/${profileData?.mobileNumber}`);
                const result = response.data;

                setUserTeamDetails(result)
            } else {
                console.log('details malti nathi!')
            }   
        } catch (error) {
            console.log('Error fetching data... wallet:', error);
        }
    }

    React.useEffect(() => {
        fetchDetails();
    })
    
    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom:50 }}>

            
            <View style={{
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 height: 60,
                 paddingHorizontal: 20
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                    <TouchableOpacity style={[styles.iconContainer,{width:30}]} onPress={() => { navigation.goBack() }}>
                        <FontAwesome name="angle-left" size={35} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{
                     color: 'white',
                     fontSize: 20,
                     fontFamily: 'Manrope-Bold'
                }}>Wallet</Text>
                <View style={{ width: 5 }}></View>
            </View>
            <View style={{ height: 180, backgroundColor: '#2E3133', width, borderRadius: 20, justifyContent: 'space-between', overflow: 'hidden', marginTop: 20 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: '70%', gap: 10 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', color: 'white', fontSize: 19 }}>
                        ₹ {userTeamDetails?.totalRewards || 0}/-
                    </Text>
                    <Text style={{ fontFamily: 'Manrope-Regular', color: 'gray', fontSize: 15 }}>
                        Total Earnings
                    </Text>
                </View>
                <View style={{ backgroundColor: 'gray', height: '30%', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', paddingHorizontal: 30 }}>
                    <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                                <FontAwesome5 name="wallet" size={30} color="#E31E25" />
                            </Text>
                            <View>
                                <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#E31E25' }}>
                                    Red Wallet
                                </Text>
                                <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                    ₹ {userTeamDetails?.redWallet}/-
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "center" }}>
                            <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                                <FontAwesome5 name="wallet" size={30} color="#42FF00" />
                            </Text>
                            <View>
                                <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#42FF00' }}>
                                    Green Wallet
                                </Text>
                                <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                                    ₹ {userTeamDetails?.greenWallet}/-
                                </Text>
                            </View>
                        </View>

                    </View>

                </View>
            </View>
            <ScrollView style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                marginTop:30,
                paddingVertical:20,
            }}>
            {/* 2 */}
            <View style={{marginBottom:40}}>
                {/* Content for the second part */}
                <TouchableOpacity style={[styles.frame, { marginTop: 8 }]} onPress={()=>{navigation.navigate('WithdrawWallet')}}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <MaterialCommunityIcons
                                name="view-dashboard"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Withdrawal</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>

                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <MaterialCommunityIcons
                                name="wallet"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>History</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <Entypo
                                name="wallet"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Today Earning</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <AntDesign
                                name="team"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Binary Income</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <MaterialIcons
                                name="person"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Spencer Income</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <MaterialCommunityIcons
                                name="trophy-award"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Reward/Award</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <FontAwesome5 name="award"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Royality</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <MaterialIcons
                                name="support-agent"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Global Royality</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.frame, { marginTop: 15 }]}>
                    <View style={styles.iconContainer}>
                        <View style={styles.circleAvatar}>
                            <Fontisto
                                name="player-settings"
                                size={30}
                                color="white"
                            />
                        </View>
                    </View>
                    <Text style={styles.frameText}>Bonanaza</Text>
                    <View style={styles.arrowIcon}>
                        <MaterialCommunityIcons name="chevron-right" size={30} color="white" />
                    </View>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </LinearGradient>
    )
}

export default Wallet


const styles = StyleSheet.create({
    secondPart: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginTop:30,
        paddingVertical:20
    },
    frame: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Adjusted to start from left
        alignItems: 'center',
        paddingHorizontal: 20,
        color: 'white',
    },
    frameText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 20,
    },
    frameText1: {
        fontSize: 18,
        color: 'red',
        marginLeft: 20,
    },
    arrowIcon: {
        marginLeft: 'auto',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#FFFFFF33', // Green color for avatar background
        justifyContent: 'center',
        alignItems: 'center',
    },
});
