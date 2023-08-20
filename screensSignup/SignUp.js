import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, Text, Alert, FlatList, Dimensions, TouchableHighlight, TouchableOpacity, Modal, ActivityIndicator, PermissionsAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from 'react-native-vector-icons/Feather'
import DropDownPicker from 'react-native-dropdown-picker';

const { width } = Dimensions.get(('window'))

const LoginScreen = ({ navigation }) => {

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [Cpassword, setCPassword] = useState('')
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [adhaar, setAadhar] = useState('');
    const [designation, setDesignation] = useState('');
    const [fileUri, setFileUri] = useState('');
    const [dob, setDob] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [loader, setloader] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    //   const [businessOrPersonal, setBusinessOrPersonal] = useState('')
    const [imageLoader, setImageLoader] = useState(false)
    const [gender, setGender] = useState(null);

    const [loading, setLoading] = useState(false)

    const index = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33]


    const [items, setItems] = useState([]);
    const [open, setOpen] = useState(false);

    // business or personal

    const [businessOrPersonal, setBusinessOrPersonal] = useState('personal')

    // profile data

    const profileData = {
        fullName,
        phone,
        password
    }

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
            console.log('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    const requestData = businessOrPersonal === 'personal'
        ? {
            profileImage: fileUri || localimage,
            Designation: designation,
            gender: gender,
            dob: dob,
            mobileNumber: phone,
            fullName: fullName,
            email: email,
            adress: address,
            password: password,
            adhaar: adhaar
        }
        : {
            businessLogo: fileUri || localimage,
            businessType: designation,
            businessStartDate: dob,
            mobileNumber: phone,
            fullName: fullName,
            email: email,
            adress: address,
            password: password,
            adhaar: adhaar
        };

    const handleSave = async () => {

        if (password == Cpassword) {

            if (!localimage) {
                showAlert4()
                return null;
            }

            setloader(true)
            if (email == "" || address == "" || designation == "" || localimage == "" || dob == "") {
                showAlert5()
            } else {
                setloader(true)
                const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/user/user_register';

                const requestData = businessOrPersonal === 'personal'
                    ? {
                        profileImage: fileUri || localimage,
                        Designation: designation,
                        gender: gender,
                        dob: dob,
                        mobileNumber: phone,
                        fullName: fullName,
                        email: email,
                        adress: address,
                        password: password,
                        adhaar: adhaar
                    }
                    : {
                        businessLogo: fileUri || localimage,
                        businessType: designation,
                        businessStartDate: dob,
                        mobileNumber: phone,
                        fullName: fullName,
                        email: email,
                        adress: address,
                        password: password,
                        adhaar: adhaar
                    };

                    console.log(requestData)

                try {
                    const response = await axios.post(apiUrl, requestData, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    console.log(response.data.statusCode)

                    if (response.data.statusCode === 200) {

                        showAlert3()

                    } else if (response.data.statusCode === 402) {
                        showAlert2()
                    } else if (response.data.statusCode === 401) {
                        showAlert2()
                    } else if (response.data.statusCode === 403) {
                        showAlert2()
                    } else if (response.data.statusCode === 500) {
                    } else {
                        Alert.alert('Error! please try again...');
                    }
                } catch (error) {
                    Alert.alert("Sign Up Failed!")
                    console.log(error)
                }
                setloader(false)
            }

            setloader(false)
        } else {
            showAlert()
        }
    }

    const saveandnavigate = async () => {
        // try {
        //     await AsyncStorage.setItem('BusinessOrPersonl', businessOrPersonal)
        // } catch (error) {
        //     console.error('Error saving businessOrPersonal:', error);
        // }
        navigation.navigate('LoginScreen')
    }

    const renderFileUri = () => {
        if (localimage) {
            return <FastImage source={{ uri: localimage }} style={{ height: 100, width: 100, borderRadius: 100 }} />;
        } else {
            return (
                <View style={styles.logoContainer}>
                    <Text style={{ color: "white", fontFamily: 'Poppins-Bold', fontSize: 13 }}>
                        {imageLoader ? (
                            <ActivityIndicator color={"red"} />
                        ) : (businessOrPersonal == 'business' ? "LOGO" : "PROFILE")}
                    </Text>
                </View>
            )
        }
    };

    // generate link for photo 

    const [localimage, setlocalImage] = useState('')

    const handleImagePicker = () => {
        ImageCropPicker.openPicker({
            width: 1000,
            height: 1000,
            cropping: true,
            includeBase64: true, // Optional, set it to true if you want to get the image as base64-encoded string
        })
            .then((response) => {
                setImageLoader(true);
                const dataArray = new FormData();
                dataArray.append('b_video', {
                    uri: response.path,
                    type: response.mime,
                    name: response.path.split('/').pop(),
                });
                setlocalImage(response.path)
                let url = 'https://www.sparrowgroups.com/CDN/image_upload.php/';
                axios
                    .post(url, dataArray, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                    .then((res) => {
                        setImageLoader(false)
                        const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
                        setFileUri(imagePath);
                    })
                    .catch((err) => {
                        setImageLoader(false)
                        setFileUri(response.path)
                        console.log('Error uploading image:', err);
                    });
            })
            .catch((error) => {
                setImageLoader(false)

                console.log('ImagePicker Error:', error);
            });
    };

    const [isModalVisible, setModalVisible] = useState(false);

    const showAlert = () => {
        setModalVisible(true);
    };

    const hideAlert = () => {
        setModalVisible(false);
    };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleDateChange = (_, date) => {
        hideDatePicker();
        if (date) {
            setSelectedDate(date);
            setDob(date.toISOString().split('T')[0]);
        }
    };

    // modal 2 == email or phone alert

    const [isModalVisible2, setModalVisible2] = useState(false);

    const showAlert2 = () => {
        setModalVisible2(true);
    };

    const hideAlert2 = () => {
        setModalVisible2(false);
    };

    // model 3 == signup success 

    const [isModalVisible3, setModalVisible3] = useState(false);

    const showAlert3 = () => {
        setModalVisible3(true);
    };

    const hideAlert3 = () => {
        setModalVisible3(false);
        saveandnavigate();
    };

    // model 4 == enter image

    const [isModalVisible4, setModalVisible4] = useState(false);

    const showAlert4 = () => {
        setModalVisible4(true);
    };

    const hideAlert4 = () => {
        setModalVisible4(false);
    };

    // model 5 == enter all details

    const [isModalVisible5, setModalVisible5] = useState(false);

    const showAlert5 = () => {
        setModalVisible5(true);
    };

    const hideAlert5 = () => {
        setModalVisible5(false);
    };


    if (loader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        )
    }


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
                <TouchableHighlight style={styles.logoContainer} onPress={handleImagePicker}>
                    {renderFileUri()}
                </TouchableHighlight>
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
                <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 14, textAlign: 'center' }]}>
                        Say hello to your new desining partner app
                    </Text>
                </View>
            </View>
            <FlatList
                style={styles.mainContainer}
                keyboardShouldPersistTaps="handled"
                data={[{ key: 'content' }]} // Dummy data to satisfy FlatList's requirement
                renderItem={() => (
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={[styles.labelContainer, { marginTop: 40 }]}>
                            <Text style={styles.label}>
                                Register As
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "80%", marginTop: 15, marginBottom: 20 }}>
                            {/* 1 */}
                            <TouchableOpacity
                                onPress={() => { setBusinessOrPersonal('personal') }}
                                style={{
                                    width: '45%',
                                    height: 60,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: businessOrPersonal === 'business' ? 1 : 0,
                                    borderColor: 'lightgray',
                                    backgroundColor: businessOrPersonal === 'personal' ? 'red' : null,
                                    borderRadius: 10,
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                    <FontAwesome6 name="circle-user" size={30} color={businessOrPersonal === 'business' ? 'gray' : 'white'} />
                                    <Text style={{ color: businessOrPersonal === 'business' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 17 }}>Person</Text>
                                </View>
                            </TouchableOpacity>

                            {/* 2 */}
                            <TouchableOpacity
                                onPress={() => { setBusinessOrPersonal('business') }}
                                style={{
                                    width: '45%',
                                    height: 60,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: businessOrPersonal === 'personal' ? 1 : 0,
                                    borderColor: 'lightgray',
                                    backgroundColor: businessOrPersonal === 'business' ? 'red' : null,
                                    borderRadius: 10,
                                }}
                            >
                                <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                    <FontAwesome5 name="store" size={26} color={businessOrPersonal === 'personal' ? 'gray' : 'white'} />
                                    <Text style={{ color: businessOrPersonal === 'personal' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 16 }}>Business</Text>
                                </View>
                            </TouchableOpacity>


                        </View>

                        <View style={[styles.labelContainer]}>
                            <Text style={styles.label}>
                                Enter Name
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
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
                                placeholderTextColor={'gray'}
                                placeholder="Phone"
                                value={phone}
                                onChangeText={setPhone}
                                autoCapitalize="none"
                                maxLength={10}
                                keyboardType='numeric'
                            />
                        </View>
                        <View style={[styles.labelContainer,]}>
                            <Text style={styles.label}>
                                Enter Email
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* address */}
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Enter Address
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
                                placeholder="Address"
                                value={address}
                                onChangeText={setAddress}
                                autoCapitalize="sentences"
                            />
                        </View>

                        {/* address */}
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Enter Aadhar
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
                                placeholder="Aadhar Number"
                                value={adhaar}
                                maxLength={12}
                                onChangeText={setAadhar}
                                autoCapitalize="sentences"
                            />
                        </View>

                        {/* dropdown */}
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Enter {businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
                            </Text>
                        </View>
                        {businessOrPersonal === 'personal' && (
                            <View style={styles.inputContainer}>
                                <DropDownPicker
                                    key={index} // Add a unique key
                                    open={open}
                                    value={designation}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setDesignation}
                                    style={styles.input}
                                    textStyle={styles.dropdownText}
                                    placeholder="Your Designation"
                                    placeholderStyle={{ color: 'gray', fontFamily: 'Manrope-Regular' }}
                                />
                            </View>
                        )}
                        {businessOrPersonal === 'business' && (
                            <View style={styles.inputContainer}>
                                <DropDownPicker
                                    key={index} // Add a unique key
                                    open={open}
                                    value={designation}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setDesignation}
                                    style={styles.input}
                                    textStyle={styles.dropdownText}
                                    placeholder="Select Business Type"
                                    placeholderStyle={{ color: 'gray', fontFamily: 'Manrope-Regular' }}
                                />
                            </View>
                        )}

                        {/* DOB */}
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Enter {businessOrPersonal === 'business' ? ('Buisness Start Date') : ('Date of Birth')}
                            </Text>
                        </View>
                        {isDatePickerVisible && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                        <View style={styles.inputContainer}>
                            <TouchableOpacity onPress={showDatePicker}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
                                    value={dob}
                                    editable={false}
                                    placeholderTextColor={'gray'}
                                />
                            </TouchableOpacity>
                        </View>

                        {/*  */}
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Enter Password
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        <View style={styles.labelContainer}>
                            <Text style={styles.label}>
                                Confirm Password
                            </Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'gray'}
                                placeholder="Confirm Password"
                                value={Cpassword}
                                onChangeText={setCPassword}
                                secureTextEntry
                            />
                        </View>
                        <TouchableHighlight onPress={handleSave} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "80%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5 }} >
                            <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                Sign Up
                            </Text>
                        </TouchableHighlight>
                        <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }} style={{ padding: 5, marginTop: 0, marginBottom: 40 }}>
                            <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 14, textDecorationLine: 'underline' }}>
                                I have an Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {/* modal 1 */}

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible}
                transparent={true}
                onRequestClose={hideAlert}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: 230,
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert} style={{
                            backgroundColor: 'red',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><MaterialIcons name="security" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'red'
                        }}>Password Not Match</Text>
                        {/* caption */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 5,
                            color: 'lightgray'
                        }}>Please enter same password</Text>
                        {/* another */}
                        <TouchableOpacity onPress={hideAlert} style={{
                            width: 70,
                            paddingVertical: 5,
                            alignItems: 'center',
                            justifyContent: "center",
                            borderRadius: 8,
                            marginTop: 30,
                            backgroundColor: 'red'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Manrope-Bold'
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* modal 2 */}

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible2}
                transparent={true}
                onRequestClose={hideAlert2}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: "40%",
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert2} style={{
                            backgroundColor: 'red',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><Feather name="alert-triangle" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'red',
                            textAlign: 'center'
                        }}>Email or Mobile or Aadhar is Already Used!</Text>
                        {/* caption */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 5,
                            color: 'lightgray',
                            textAlign: 'center'
                        }}>Mobile Or Email Already Used... please Log In with Mobile or Email</Text>
                        {/* another */}

                        <TouchableOpacity onPress={hideAlert2} style={{
                            width: 70,
                            paddingVertical: 5,
                            alignItems: 'center',
                            justifyContent: "center",
                            borderRadius: 8,
                            marginTop: 30,
                            backgroundColor: 'red'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Manrope-Bold'
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* modal 3 */}

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible3}
                transparent={true}
                onRequestClose={hideAlert3}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: "40%",
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert3} style={{
                            backgroundColor: 'darkgreen',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><MaterialIcons name="check" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'darkgreen'
                        }}>Sign Up Success</Text>
                        {/* caption */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 5,
                            color: 'lightgray',
                            textAlign:'center'
                        }}>Account is Created, Please Login Now!</Text>
                        {/* another */}

                        <TouchableOpacity onPress={hideAlert3} style={{
                            width: 70,
                            paddingVertical: 5,
                            alignItems: 'center',
                            justifyContent: "center",
                            borderRadius: 8,
                            marginTop: 30,
                            backgroundColor: 'darkgreen'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Manrope-Bold'
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* modal 4 */}

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible4}
                transparent={true}
                onRequestClose={hideAlert4}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: "40%",
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert4} style={{
                            backgroundColor: 'red',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><Feather name="alert-triangle" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'red'
                        }}>Logo or Profile Not Found!</Text>
                        {/* caption */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 5,
                            color: 'lightgray'
                        }}>Please enter Profile Photo or Logo... </Text>
                        {/* another */}

                        <TouchableOpacity onPress={hideAlert4} style={{
                            width: 70,
                            paddingVertical: 5,
                            alignItems: 'center',
                            justifyContent: "center",
                            borderRadius: 8,
                            marginTop: 30,
                            backgroundColor: 'red'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Manrope-Bold'
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* modal 5 */}

            <Modal
                animationType="fade" // You can use "fade" or "none" for animation type
                visible={isModalVisible5}
                transparent={true}
                onRequestClose={hideAlert5}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',

                }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 8,
                        height: "40%",
                        width: 300,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* icon */}
                        <TouchableOpacity onPress={hideAlert5} style={{
                            backgroundColor: 'red',
                            padding: 8,
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                color: 'white',
                                fontWeight: 'bold',
                            }}><Feather name="alert-triangle" size={25} color="white" /></Text>
                        </TouchableOpacity>
                        {/* title */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 10,
                            color: 'red'
                        }}>Enter All Details!</Text>
                        {/* caption */}
                        <Text style={{
                            fontSize: 16,
                            fontFamily: 'Manrope-Bold',
                            marginTop: 5,
                            color: 'lightgray'
                        }}>Please enter All Details... </Text>
                        {/* another */}

                        <TouchableOpacity onPress={hideAlert5} style={{
                            width: 70,
                            paddingVertical: 5,
                            alignItems: 'center',
                            justifyContent: "center",
                            borderRadius: 8,
                            marginTop: 30,
                            backgroundColor: 'red'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'Manrope-Bold'
                            }}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        width: '80%',
        marginTop: 20,
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
    dropdownText: {
        fontFamily: 'Manrope-Regular'
    }

});

export default LoginScreen;
