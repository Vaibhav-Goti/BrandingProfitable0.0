import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, ToastAndroid, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { ScrollView, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window')

// divider
const DividerWithText = ({ value }) => {
    return (
        <View style={styles.containerDivider}>
            <View style={styles.divider} />
            <Text style={[styles.label, { marginHorizontal: 10 }]}>{value}</Text>
            <View style={styles.divider} />
        </View>
    );
};

const WithdrawWallet = ({ navigation }) => {
    const [withdrawalAmount, setWithdrawalAmount] = useState('')
    const [UpiId, setUpiId] = useState('')
    const [bankName, setBankName] = useState('')
    const [acNumber, setAcHolder] = useState('')
    const [acName, setAcName] = useState('')
    const [ifsc, setIfsc] = useState('')
    const [businessOrPersonal, setBusinessOrPersonal] = useState('upi')

    // get user token 

    const [userToken, setUserToken] = useState()
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        retrieveProfileData()
    }, [retrieveProfileData])

    const retrieveProfileData = async () => {
        try {
            const dataString = await AsyncStorage.getItem('profileData');
            const userToken = await AsyncStorage.getItem('userToken');
            setUserToken(userToken)
            if (dataString) {
                const data = JSON.parse(dataString);
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error retrieving profile data:', error);
        }
    };

    // handle submit

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };
    const [isLoader, setIsLoader] = useState(false);

    const handleSubmit = async () => {
        setIsLoader(true);
        const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/withdrawal/withdrawal';

        const requestData = businessOrPersonal === 'upi'
            ? {
                UpiId,
                withdrawalAmount,
                acName,
            }
            : {
                withdrawalAmount,
                bankName,
                acNumber,
                acName,
                ifsc,
            };

        console.log(requestData, "data to send for withdraw!")

        try {
            const response = await axios.post(apiUrl, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },

            });

            console.log(response.data)

            if (response.data.statusCode === 200) {
                showToastWithGravity("Request Sent Successfully!")
                navigation.goBack();
            } else {
                showToastWithGravity("Troubleshooting to Send Request!")
            }
        } catch (error) {
            showToastWithGravity("Troubleshooting to Send Request!")
        } finally {
            setIsLoader(false);
        }
    }

    // send data to api 

    // https://b-p-k-2984aa492088.herokuapp.com/withdrawal/withdrawal
    //   UpiId: { type: String },
    //   withdrawalAmount: { type: Number },
    //   bankName: { type: String },
    //   acNumber: { type: Number },
    //   acName: { type: String },
    //   ifsc: { type: String },

    if (isLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: "space-between" }}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
                    WithDraw
                </Text>
            </View>

            <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={styles.profileContainer}>
                    {/* Payment Amount Input */}
                    <View style={styles.labelContainer}>
                        <Text style={styles.label}>Enter Withdraw Amount</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Amount"
                            value={withdrawalAmount}
                            onChangeText={(value) => setWithdrawalAmount(value)}
                            autoCapitalize="none"
                            keyboardType='number-pad'
                        />
                    </View>

                    {/* divider */}
                    <View style={[styles.labelContainer, { marginVertical: 5, marginTop: 10 }]}>
                        <DividerWithText value={"Account Details"} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "80%", marginTop: 15, marginBottom: 20 }}>
                        {/* 1 */}
                        <TouchableOpacity
                            onPress={() => { setBusinessOrPersonal('upi') }}
                            style={{
                                width: '45%',
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: businessOrPersonal === 'bank' ? 1 : 0,
                                borderColor: 'lightgray',
                                backgroundColor: businessOrPersonal === 'upi' ? 'red' : null,
                                borderRadius: 10,
                            }}
                        >
                            <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                <FontAwesome6 name="money-bill-trend-up" size={20} color={businessOrPersonal === 'bank' ? 'gray' : 'white'} />
                                <Text style={{ color: businessOrPersonal === 'bank' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 17 }}>UPI</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 2 */}
                        <TouchableOpacity
                            onPress={() => { setBusinessOrPersonal('bank') }}
                            style={{
                                width: '45%',
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: businessOrPersonal === 'upi' ? 1 : 0,
                                borderColor: 'lightgray',
                                backgroundColor: businessOrPersonal === 'bank' ? 'red' : null,
                                borderRadius: 10,
                            }}
                        >
                            <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                <Icon name="bank" size={20} color={businessOrPersonal === 'upi' ? 'gray' : 'white'} />
                                <Text style={{ color: businessOrPersonal === 'upi' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 16 }}>Bank Ac.</Text>
                            </View>
                        </TouchableOpacity>


                    </View>

                    {businessOrPersonal == 'upi' ? (
                        <>
                            {/* UPI Id Input */}
                            <View style={[styles.labelContainer, { marginTop: 10 }]}>
                                <Text style={styles.label}>UPI Id</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your UPI Id"
                                    value={UpiId}
                                    onChangeText={(value) => setUpiId(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                            {/* Bank Name Input */}
                            <View style={[styles.labelContainer]}>
                                <Text style={styles.label}>Name of UPI Account Holder</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Name"
                                    value={acName}
                                    onChangeText={(value) => setAcName(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                        </>
                    ) : (

                        <>
                            {/* Bank Name Input */}
                            <View style={[styles.labelContainer, { marginTop: 10 }]}>
                                <Text style={styles.label}>Bank Name</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Bank Name"
                                    value={bankName}
                                    onChangeText={(value) => setBankName(value)}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Account Holder Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Account Number</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Account Number"
                                    value={acNumber}
                                    onChangeText={(value) => setAcHolder(value)}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Account Name Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Account Name</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Account Name"
                                    value={acName}
                                    onChangeText={(value) => setAcName(value)}
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* IFSC Input */}
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>IFSC Code</Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter IFSC Code"
                                    value={ifsc}
                                    onChangeText={(value) => setIfsc(value)}
                                    autoCapitalize="none"
                                />
                            </View>
                        </>
                    )}

                    <TouchableHighlight onPress={handleSubmit} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginTop: 30 }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Send Request
                        </Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 30,
        maxHeight: height
    },
    containerDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    infoContainer: {
        alignItems: 'center',
        width: '100%'
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginRight: 8,
        width: 120,
    },
    info: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    loadingText: {
        fontSize: 16,
        color: '#333',
    },
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: "Manrope-Bold",
        marginLeft: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#333',
        fontFamily: 'Manrope-Regular',

    },
    inputContainer: {
        width: '80%',
        marginTop: 18,
    },
    labelContainer: {
        width: '80%',
        alignItems: 'flex-start',
        marginTop: 20
    },
    label: {
        color: '#6B7285',
        fontFamily: 'Manrope-Regular',
        fontSize: 15
    },
    imageContainer: {
        position: 'relative', // Required for positioning the button absolutely
    },
    profileImage: {
        // Your existing styles for the image
        height: 130,
        width: 130,
        borderRadius: 100,
        marginLeft: 15,
        marginRight: 15,
    },
    pickImageButton: {
        position: 'absolute', // Position the button absolutely within the container
        bottom: 0, // Adjust this value to position the button as desired from the bottom
        right: 10, // Adjust this value to position the button as desired from the right
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjust the background color and opacity as needed
        padding: 10,
        borderRadius: 50,
    },
});

export default WithdrawWallet