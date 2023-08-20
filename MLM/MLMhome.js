import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Image, ActivityIndicator, Modal, Alert, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Header from '../Header';


const { width, height } = Dimensions.get('window')

const MLMhome = ({ navigation }) => {
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [userToken, setUserToken] = useState()

    // modal input 

    const [referId, setReferId] = useState('')
    const [treeId, setTreeId] = useState('')

    // left or right 

    const [side, setSide] = useState('left')

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

    // modal 

    const [isModalVisible, setModalVisible] = useState(false);
    const [isSecondModalVisible, setSecondModalVisible] = useState(false);

    const [errorModal, setErrorModal] = useState(false);


    // Toggle the first modal visibility
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // Toggle the second modal visibility
    const toggleSecondModal = () => {
        setSecondModalVisible(!isSecondModalVisible);
    };


    const transactionImage = fileUri;
    const currentDate = new Date();
    const transactionDate = currentDate.toLocaleDateString();
    const transactionTime = currentDate.toLocaleTimeString();

    const joinNowButton = async () => {
        if (!fileUri) {
            Alert.alert('Please add payment screenshot!');
        } else {

            setModalVisible(false);
            try {
                const response = await axios.post(
                    'https://b-p-k-2984aa492088.herokuapp.com/payment/payment',
                    {
                        transactionImage: fileUri,
                        transactionDate,
                        transactionTime,
                        fullName: profileData?.fullName,
                        mobileNumber: profileData?.mobileNumber,
                        email: profileData?.email,
                        adhaar: profileData?.adhaar
                    },
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${userToken}`,
                    //     },
                    // }
                );

                setSecondModalVisible(true);
            } catch (error) {
                console.error('Error sending payment data:', error);
            }
        }
    };


    const requestData = {
        ...profileData,
        side: side,
        treeId: treeId,
        referredBy: referId,
    }

    const submitRequestButton = async () => {
        setModalVisible(false)

        let url = 'https://b-p-k-2984aa492088.herokuapp.com/user/register';
        axios
            .post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log('Response status code:', res.data.statusCode); // Log the status code

                if (res.data.statusCode === 200) {
                    // Successful response
                    setSecondModalVisible(false)
                    Alert.alert('Request sent Successfully!');
                } else if (res.data.statusCode === 401) {
                    // Unauthorized response
                    console.log('Unauthorized Request!');
                } else if (res.data.statusCode === 402) {
                    // Other status codes...
                }
                // Add more condition checks for other status codes if needed
            })
            .catch((err) => {
                if (err.response) {
                    // Axios received an error response from the server
                    console.log('Error status code:', err.response.status); // Log the error status code

                    if (err.response.status === 401) {
                        Alert.alert('referal id not found!')
                    } else {
                        console.log('Other Error:', err.response.data.message);
                    }
                } else {
                    // Axios didn't receive a response from the server
                    console.log('Network Error:', err.message);
                }
            });

    }


    const [fileUri, setFileUri] = useState('');
    const [imageLoader, setImageLoader] = useState(false)

    const handleImagePicker = () => {
        ImageCropPicker.openPicker({
            width: 800,
            height: 1400,
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
                        console.log('Error uploading image:', err);
                    });
            })
            .catch((error) => {
                setImageLoader(false)
                console.log('ImagePicker Error:', error);
            });
        setImageLoader(false)

    };

    // console.log(dataSendToApi)

    // useEffect(()=>{
    //     setDataSendToApi({
    //         "profileImage": "C",
    //         "Designation": "Web Developer",
    //         "gender": "Male",
    //         "dob": "2023/07/18",
    //         "mobileNumber": "04212320321",
    //         "fullName": "C",
    //         "email": "B@gma711848L",
    //         "adress": "Nirmal Nagar",
    //         "password": "Shivam@123",
    //         "cPassword": "Shivam@123",
    //         "side": "right",
    //         "treeId": 26561  ,
    //         "referredBy": "1",
    //         "adhaar":"3"
    //     })
    // })



    return (
        <LinearGradient colors={['#b30c12', '#000']} locations={[0.2, 1]} style={{ flex: 1, marginBottom: 50 }}>

            {/* header */}

            <Header />


            <ScrollView style={{ flex: 1, }}>

                <View style={{ justifyContent: 'center', alignItems: "center", height: height - 100 }}>
                    <Image source={require('../assets/mlmScreenImg.png')} style={{ height: width - 170, width: width - 140, }} />
                    <View style={{ margin: 20, marginTop: 40 }}>
                        <Text style={{ color: 'white', fontSize: 20, fontFamily: 'Manrope-Bold' }}>
                            Need to Buy Package
                        </Text>
                    </View>
                    <View style={{ margin: 0 }}>
                        <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Manrope-Regular', width: width - 100, textAlign: 'center' }}>
                            lorem ipsum is simply dummy text the printing and cutting industry. lorem ipsum has been the text ever.
                        </Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 20, width: "55%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} >
                        <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                            Join Now
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal}>
                        <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Manrope-Bold', height: 30 }}>
                            Pay Here
                        </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => { navigation.navigate('MLMScreen2') }}>
                    <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Manrope-Bold', height: 30 }}>
                        Binary Tree View
                    </Text>
                </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={() => { navigation.navigate('WalletApp') }}>
                    <Text style={{ color: 'white', fontSize: 15, fontFamily: 'Manrope-Bold' }}>
                        Wallet Screen
                    </Text>
                </TouchableOpacity> */}

                </View>

            </ScrollView>

            {/* Define the modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            >
                <View style={styles.modalContent}>

                    <View style={{ marginTop: 30, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                        <>
                            <TouchableOpacity style={{ borderRadius: 10, height: '60%', borderWidth: 1, width: '90%', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', borderColor: 'gray' }} onPress={handleImagePicker}>
                                <View style={{ margin: 10, display: imageLoader ? 'none' : 'flex' }}>
                                    <Icon name="cloud-upload" size={27} color={'gray'} />
                                </View>
                                {fileUri ? (
                                    <Text style={{ width: '52%', textAlign: 'center' }}>
                                        screenshot selected!
                                    </Text>
                                ) : imageLoader ? (
                                    <View style={{ width: "100%", height: '10%', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator color={'gray'} />
                                    </View>
                                ) : (
                                    <Text style={{ width: '52%', textAlign: 'center' }}>
                                        Click to browse And Upload payment Screenshot
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>

                        <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={joinNowButton}>
                            <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                Upload
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity onPress={() => { setModalVisible(false) }} style={styles.modalCloseButton}>
                        <Text><Icon name="close" size={27} color={'gray'} /></Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* second modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isSecondModalVisible}
            >
                <ScrollView style={styles.modalContent} keyboardShouldPersistTaps={true}>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: height - 230 }}>

                        <View style={{ marginTop: 30, marginBottom: 30, height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                            <View style={[styles.labelContainer,]}>
                                <Text style={styles.label}>
                                    Enter Refer Id
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'gray'}
                                    placeholder="Referal Id"
                                    value={referId}
                                    onChangeText={setReferId}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={[styles.labelContainer,]}>
                                <Text style={styles.label}>
                                    Enter Tree Id
                                </Text>
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor={'gray'}
                                    placeholder="Tree Id"
                                    value={treeId}
                                    onChangeText={setTreeId}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={[styles.labelContainer,]}>
                                <Text style={styles.label}>
                                    Select Side
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "90%", marginTop: 15, marginBottom: 20 }}>
                                {/* 1 */}
                                <TouchableOpacity
                                    onPress={() => { setSide('left') }}
                                    style={{
                                        width: '45%',
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: side === 'right' ? 1 : 0,
                                        borderColor: 'lightgray',
                                        backgroundColor: side === 'left' ? 'red' : null,
                                        borderRadius: 10,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                        <View style={{ width: 30, height: 30, borderRadius: 20, alignItems: "center", justifyContent: 'center', backgroundColor: side === 'right' ? 'gray' : 'white', }}>
                                            <Text style={{ color: side !== 'right' ? 'red' : 'white', fontFamily: 'Manrope-Bold', fontSize: 19 }}>L</Text>
                                        </View>
                                        <Text style={{ color: side === 'right' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 16 }}>Left</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* 2 */}
                                <TouchableOpacity
                                    onPress={() => { setSide('right') }}
                                    style={{
                                        width: '45%',
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: side === 'left' ? 1 : 0,
                                        borderColor: 'lightgray',
                                        backgroundColor: side === 'right' ? 'red' : null,
                                        borderRadius: 10,
                                    }}
                                >
                                    <View style={{ flexDirection: "row", gap: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                                        <View style={{ width: 30, height: 30, borderRadius: 20, alignItems: "center", justifyContent: 'center', backgroundColor: side === 'left' ? 'red' : 'white', }}>
                                            <Text style={{ color: side !== 'left' ? 'red' : 'white', fontFamily: 'Manrope-Bold', fontSize: 19 }}>R</Text>
                                        </View>
                                        <Text style={{ color: side === 'left' ? 'gray' : 'white', fontFamily: 'Manrope-Bold', fontSize: 16 }}>right</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                            <TouchableOpacity style={{ backgroundColor: '#E31E25', borderRadius: 8, margin: 20, width: "90%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, }} onPress={submitRequestButton}>
                                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                                    Submit Request
                                </Text>
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity onPress={() => { setSecondModalVisible(false) }} style={styles.modalCloseButton}>
                            <Text><Icon name="close" size={27} color={'gray'} /></Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>

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

export default MLMhome;
