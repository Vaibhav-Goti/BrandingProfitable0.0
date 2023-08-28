import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Avatar,
  Text,
  Button,
  Image,
  ScrollView,
  TouchableHighlight,
  Modal,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather'
import Header from '../Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = ({ route }) => {


  const { userNotHaveFrame } = route.params || false


  const navigation = useNavigation()
  // get business or profile
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

  const [profileData, setProfileData] = useState(null);

  // setInterval(() => {
  //   retrieveProfileData()
  // }, 3000);

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

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };

  const reloadScreen = () => {
    // Your refresh logic goes here
    retrieveProfileData()
  };

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [navigation])

  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])
  const [userTeamDetails11, setUserTeamDetails11] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const [i, seti] = React.useState(0)
  const [loader, setLoader] = React.useState(true)

  const fetchDetails = async () => {
    if (i < 5) {

      try {
        if (profileData) {

          const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.mobileNumber}`);
          const result = response.data.data;
          console.log(response.data.statusCode)
          if (response.data.statusCode == 200) {
            setUserTeamDetails(result)
            setUserTeamDetails11('Purchase')
          } else {
            setUserTeamDetails(result)
          }

          seti(i + 1)


        }

        setTimeout(() => {
          setLoader(false)
        }, 3000);

      } catch (error) {
        setTimeout(() => {
          setLoader(false)
        }, 1000);
      }

    }
  }

  useEffect(() => {
    fetchDetails();
  })

  if (loader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>
      {/* main contianer */}
      <View style={{ justifyContent: 'space-between', flex: 1, }}>
        {/* 1 */}
        <View style={{ height: '45%', width: '100%', backgroundColor: '#2B353F', borderBottomRightRadius: 15, borderBottomLeftRadius: 15, justifyContent: 'space-between' }}>

          {/* 1 */}
          <View>

            {/* header */}
            <Header />

          </View>

          {/* 2 */}
          <View style={{ marginBottom: 20, height: '60%', width: '100%', alignItems: 'center', justifyContent: "center", }}>
            {/* {
                businessOrPersonal == 'business' ? (
                  <Image
                    style={{ height: 100, width: 100, borderRadius: 100 }}
                    rounded
                    source={profileData ? ({ uri: profileData.businessLogo }) : ({ uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' })}
                  />

                ) : (
                  <Image
                    style={{ height: 100, width: 100, borderRadius: 100 }}
                    rounded
                    source={
                      profileData && profileData?.profileImage
                        ? { uri: profileData.profileImage }
                        : { uri: 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }
                    }
                  />
                )
              }  */}

            <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage || 'https://pasrc.princeton.edu/sites/g/files/toruqf431/files/styles/freeform_750w/public/2021-03/blank-profile-picture-973460_1280.jpg?itok=QzRqRVu8' }} style={{ height: 100, width: 100, borderRadius: 100 }} />

            <Text h4 style={styles.username}>
              {profileData?.fullName || 'John Doe'}
              {/* <Button title='hello' onPress={()=>{navigation.navigate('CustomFrames')}} /> */}
            </Text>
            <Text h4 style={styles.bio}>
              +91 {profileData?.mobileNumber || 'John Doe'}
            </Text>
            <Text h4 style={[styles.bio, { fontSize: 14 }]}>
              {profileData?.email || 'John Doe'}
            </Text>

            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => { navigation.navigate('ViewProfile') }}>
              <Text style={{ height: 40, color: '#00D3FF', fontFamily: "Manrope-Regular", fontSize: 15 }}>
                View
              </Text>
            </TouchableOpacity>

          </View>

        </View>

        {/* 2 */}
        <View style={{ height: '50%', width: '100%', backgroundColor: '#2B353F', borderTopRightRadius: 15, borderTopLeftRadius: 15, overflow: 'hidden' }}>
          {/* 1 */}

          {userTeamDetails11 !== 'Purchase' ? (
            // not purchased by user
            <View style={{ height: 80, width: '100%', backgroundColor: '#414851', justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: '#E31E25' }}>
                  Purchase MLM Subscription!
                </Text>
              </View>
            </View>
          ) : (

            <View style={{ height: 80, width: '100%', backgroundColor: '#414851', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                <Text style={{ color: 'red', paddingHorizontal: 10, }}>
                  <FontAwesome6 name="sack-dollar" size={30} color="#E31E25" />
                </Text>
                <View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#E31E25' }}>
                    Red Wallet
                  </Text>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                    ₹ {userTeamDetails?.redWallet || 0}/-
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'red', paddingHorizontal: 10, flexDirection: 'row' }}>
                  <FontAwesome6 name="sack-dollar" size={30} color="#42FF00" />
                </Text>
                <View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: '#42FF00' }}>
                    Green Wallet
                  </Text>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 14, color: 'white' }}>
                    ₹ {userTeamDetails?.greenWallet || 0}/-
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 2 */}
          <ScrollView style={{ height: '100%', width: '100%' }}>
            <View style={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 35 }}>
              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center', display: userTeamDetails11 != 'Purchase' ? 'none' : 'flex' }} onPress={() => { navigation.navigate('WithdrawWallet') }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 100, height: 19, width: 19, justifyContent: 'center', alignItems: 'center' }}>
                      <Text >
                        <FontAwesome6 name="dollar-sign" size={13} color="#1E242D" />
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Withdrawal
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>
              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => { navigation.navigate('editprofile') }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <FontAwesome5 name="edit" size={16} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Edit profile
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                navigation.navigate('Frames')
              }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <Icon name="expand" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Frames
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text >
                      <MaterialIcons name="privacy-tip" size={16} color="white" />
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
              {/*  */}
              <TouchableOpacity style={{ justifyContent: 'space-between', marginTop: 20, width: '80%', flexDirection: 'row', alignItems: 'center' }} onPress={showAlert}>

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                  <View style={{ backgroundColor: '#1E242D', height: 35, width: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                    <Text>
                      <Icon name="sign-out" size={20} color="white" />
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Manrope-Bold', fontSize: 16, color: 'white', marginLeft: 10 }}>
                    Log out
                  </Text>
                </View>

                <Text>
                  <Icon name="angle-right" size={30} color="white" />
                </Text>

              </TouchableOpacity>

              {/* modal */}

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
                    height: "40%",
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
                      }}><Feather name="log-out" size={25} color="white" /></Text>
                    </TouchableOpacity>
                    {/* title */}
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'Manrope-Bold',
                      marginTop: 10,
                      color: 'red'
                    }}>Are You Sure?</Text>
                    {/* caption */}
                    <Text style={{
                      fontSize: 16,
                      fontFamily: 'Manrope-Bold',
                      marginTop: 5,
                      color: 'lightgray'
                    }}>You want to Log out your Account ?</Text>
                    {/* another */}
                    <View style={{ width: '80%', marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' }}>

                      <TouchableOpacity onPress={hideAlert} style={{
                        borderColor: 'lightgray',
                        width: 70,
                        paddingVertical: 5,
                        alignItems: 'center',
                        justifyContent: "center",
                        borderRadius: 8,
                        borderWidth: 1
                      }}>
                        <Text style={{
                          color: 'lightgray',
                          fontFamily: 'Manrope-Bold'
                        }}>No</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          hideAlert()
                          navigation.navigate('StackLogin');
                          await AsyncStorage.removeItem('isLoggedIn');
                          await AsyncStorage.removeItem('profileData');
                          await AsyncStorage.removeItem('businessOrPersonal');
                          await AsyncStorage.removeItem('userToken');
                        }}
                        style={{
                          backgroundColor: 'red',
                          width: 70,
                          paddingVertical: 5,
                          alignItems: 'center',
                          justifyContent: "center",
                          borderRadius: 8,
                        }}>
                        <Text style={{
                          color: 'white',
                          fontFamily: "Manrope-Bold"
                        }}>Yes</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    // backgroundColor: 'white',
  },
  username: {
    marginTop: 10,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    fontSize: 20
  },
  bio: {
    color: '#6B7285',
    fontFamily: 'Manrope-Bold',
    fontSize: 16
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 10,
  },
  editButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeModalButton: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;


{/* <TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity>
<TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity>
<TouchableOpacity style={{ justifyContent: 'space-between',marginTop:20, width: '80%', flexDirection:'row',alignItems:'center' }}>

<View style={{flexDirection:'row',alignItems:'center', paddingVertical:7}}>
  <Text>
    <FontAwesome6 name="sack-dollar" size={30} color="gold" />

  </Text>
  <Text style={{fontFamily:'Manrope-Bold',fontSize:16,color:'white',marginLeft:10}}>
    meet gohel
  </Text>
</View>

<Text>
  <Icon name="angle-right" size={30} color="white" />
</Text>

</TouchableOpacity> */}
