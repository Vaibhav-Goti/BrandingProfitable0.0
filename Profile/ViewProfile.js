import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, Alert, ToastAndroid, Dimensions, TouchableHighlight, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
// import { Button } from '@rneui/base';
// import StackHome from '../Home/StackNavigatorHome';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get(('window'))

const FullScreenProfile = ({ navigation }) => {
    const [profileData, setProfileData] = useState(null);
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    const [items, setItems] = useState([]);

    console.log(profileData)

    const [designation, setDesignation] = useState('');

    const [dob, setDob] = useState('');

    const index = [...index, ...Array.from({ length: 50 }, (_, i) => i + 1)];

    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        try {
            const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/business_type/get_business_type');
            const result = response.data.data;

            // Map the fetched data to the format expected by DropDownPicker
            const mappedItems = result.map(item => ({
                label: item.businessTypeName,
                value: item.businessTypeName
            }));

            setItems(mappedItems);
        } catch (error) {
            console.log('Error fetching data...:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
            setBusinessOrPersonal(businessOrPersonal);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const retrieveProfileData = async () => {
            try {
                const data = await AsyncStorage.getItem('profileData');
                if (data) {
                    const parsedData = JSON.parse(data);
                    setProfileData(parsedData);

                    // Set the designation state based on Designation or businessType
                    setDesignation(parsedData?.Designation || parsedData?.businessType);

                    setDob(parsedData?.businessStartDate || parsedData?.dob)
                }
            } catch (error) {
                console.log('Error retrieving profile data:', error);
            }
        };

        retrieveProfileData();
    }, []);

    const showToastWithGravity = (data) => {
        ToastAndroid.showWithGravityAndOffset(
            data,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    };

    const [isloader, setisloader] = useState(false)


    if (!profileData || isloader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'white'} />
            </View>
        );
    }

    const renderTextInput = (label, value, onChangeText) => (
        <View style={styles.infoContainer}>
            <View style={[styles.labelContainer, { marginTop: 20 }]}>
                <Text style={styles.label}>
                    {label}
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="none"
                    editable={false}
                />
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']}
            style={{ flex: 1, justifyContent: "space-between" }}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.navigate('ProfileScreen') }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
                    View Profile
                </Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>

                <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage || 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }} style={styles.profileImage} />

                <TextInput
                    style={styles.title}
                    value={profileData?.fullName}
                    onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
                    placeholder="  Full Name"
                    placeholderTextColor="#999"
                    editable={false}
                />
            </View>
            <ScrollView style={styles.container}>

                <View style={styles.profileContainer}>

                    <View style={[styles.labelContainer, { marginTop: 40 }]}>
                        <Text style={styles.label}>
                            {businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
                                value={designation}
                                editable={false}
                                placeholderTextColor={'gray'}
                            />
                        </View>
                    </View>


                    {renderTextInput('Email', profileData?.email, (text) => setProfileData({ ...profileData, email: text }))}
                    {renderTextInput('Aadhar', profileData?.adhaar.toString(), (text) => setProfileData({ ...profileData, adhaar: text }))}
                    {renderTextInput('Mobile Number', profileData?.mobileNumber.toString(), (text) => setProfileData({ ...profileData, mobileNumber: text }))}
                    {/* DOB */}
                    <View style={[styles.labelContainer, { marginTop: 20 }]}>
                        <Text style={styles.label}>
                            {businessOrPersonal === 'business' ? ('Buisness Start Date') : ('Date of Birth')}
                        </Text>
                    </View>
                    <View style={[styles.inputContainer, { marginBottom: 30 }]}>
                        <View>
                            <TextInput
                                style={styles.input}
                                placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
                                value={dob}
                                editable={false}
                                placeholderTextColor={'gray'}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 30,
        maxHeight: 500
    },
    profileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 80,
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
        alignItems: 'flex-start'
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

export default FullScreenProfile;
