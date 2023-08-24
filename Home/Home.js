import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, BackHandler, Modal, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Badge } from '@rneui/themed';

import { useNavigation } from '@react-navigation/native';

import MainBanner from './MainBanner';
import AdBanner from './AdBanner';
import TrendingBanner from './Category/TrendingBanner';
import TodayBanner from './Category/Today';
import DynamicSection from './DynamicSection';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather'
import axios from 'axios';

const { height, width } = Dimensions.get('window')

const Home = ({ navigation }) => {

  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const fetchData = async () => {
    const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
    setBusinessOrPersonal(businessOrPersonal);
  };

  const [displayPopUp, setDisplayPopUp] = useState(true)

  useEffect(() => {
    fetchData();
  }, []);

  const reloadScreen = () => {
    // Your refresh logic goes here
    retrieveProfileData()
  };

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

  const handleImagePress = (item) => {
    navigation.navigate('EditHomeScreen', { item: item });
  };

  // getting data for name

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData();
  }, []);

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    } finally {
      setLoading(false); // Mark data retrieval as completed (whether successful or not)
    }
  };

  const [loading, setLoading] = useState(true);

  const renderProfileDetails = () => {
    if (loading) {
      // Show a loading indicator or return null while data is being retrieved
      return null;
    }

    if (profileData) {
      // Show the profile details if available
      return (
        <>
          <Text style={styles.buisnessTitle}>
            {profileData.fullName} <Icon name="angle-down" size={25} />
          </Text>
        </>
      );
    }

    // if custom frames not found then navigate to custom screen!

    // Show a default value or placeholder if profileData is null (data not available)
    return (
      <>
        <Text style={styles.buisnessTitle}>
          John Doe <Icon name="angle-down" size={25} />
        </Text>
      </>
    );
  };

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      if (framesData) {
        const frames = JSON.parse(framesData);
      } else {
        showAlert()
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  useEffect(() => {
    loadCustomFrames()
  }, [])

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };

  const [notificationCount, setNotificationCount] = useState(0)
  const [notifications, setNotifications] = useState([])

  const getNotificationCounts = async () => {
    try {
      const notificationsData = await AsyncStorage.getItem('notificationData');

      const parsedNotifications = JSON.parse(notificationsData || '[]'); // Parse the JSON data

      setNotifications(parsedNotifications?.notifications);
      setNotificationCount(parsedNotifications?.counts.unreadCount);
    } catch (error) {
      console.log('Error getting notification counts:', error);
    }
  }

  useEffect(() => {
    getNotificationCounts();
  }, []);

  // console.log(notificationCount, "noti counts!")

  // // notification count 

  // async function getNotificationCounts() {
  //   try {
  //     const unreadCount = await AsyncStorage.getItem('unreadCount')
  //     const readCount = await AsyncStorage.getItem('readCount');   
  //     const notifications = await AsyncStorage.getItem('notifications')

  //     console.log("aa notification che! - ", notifications)
  //     console.log(unreadCount, "unread message!")
  //     setNotificationCount(unreadCount)
  //   } catch (error) {
  //     console.error('Error getting notification counts:', error);
  //   }
  // }

  // setTimeout(() => {
  //   getNotificationCounts()
  //   console.log("noti count function call thyu!")
  // }, 5000);

  console.log(businessOrPersonal)
  const [popuUpImage, setPopUpImage] = useState('')

  const fetchPopUp = async () => {
    try {
      const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/popup_banner/popup_banner');
      setPopUpImage(response.data.popupBannerImage)
    } catch (e) {
      console.log("popuBanner Error: ", e)
    }
  }

  useEffect(() => {
    fetchPopUp()
  })

  return (
    <View
      style={styles.container}>
      <View style={[styles.modalContainer, { display: displayPopUp ? 'flex' : 'none' }]}>
        <View style={styles.modalBackground} />
        <View style={styles.modalContent}>
          <TouchableOpacity style={{ position: 'absolute', top: -10, right: -10, zIndex: 10, backgroundColor: 'white', borderRadius: 100, width: 25, height: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => { setDisplayPopUp(false) }}>
            <Icon name="close" size={18} />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://www.sparrowgroups.com/CDN/upload/259popup%20banner.jpg' }}
            style={styles.modalImage}
            onError={(error) => console.error('Error loading image:', error)}
          />
        </View>
      </View>

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
            }}>Let's Create Awesome Frames!</Text>
            {/* caption */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 5,
              color: 'lightgray',
              textAlign: 'center'
            }}>Now don't have any frames let's create!</Text>
            {/* another */}
            <View style={{ width: '80%', marginTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  hideAlert()
                  navigation.navigate('StackProfileScreen');
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
                }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* header */}
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View style={{ backgroundColor: 'red', borderRadius: 100, borderWidth: 1, borderColor: 'black', height: 45, width: 45, overflow: 'hidden' }}>
            <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage }} style={{ height: 45, width: 45 }} />
          </View>
          <TouchableOpacity>
            <Text style={styles.yourBuisness}>
              {businessOrPersonal == 'business' ? 'Business' : 'Profile'}
            </Text>
            {/* Render the profile details conditionally */}
            {renderProfileDetails()}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ position: 'relative' }}>
          <Icon name="bell" size={27} color={'#FF0000'} />
          {notificationCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -4,
              right: -4,
              padding: 3,
              borderRadius: 100,
              backgroundColor: 'red',
              borderColor: 'white',
              borderWidth: 0.2,
              elevation: 2,
              borderColor: 'white',
              borderWidth: 0.2
            }}>
              <Text style={{
                color: 'white',
                fontSize: 7,
                fontFamily: 'Manrope-Bold',
                textAlign: 'center',
                minWidth: 10,
              }}>
                {notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, height: '100%', width: '100%', marginBottom: 50, paddingTop: 10, }}>
          <TouchableOpacity style={styles.searchContainer} onPress={() => { navigation.navigate('SearchScreen') }}>
            <Text style={[styles.searchText]}>
              <Icon name="search" size={25} />
            </Text>
            <Text style={[styles.searchText, { fontSize: 16, fontFamily: 'Manrope-Regular' }]}>
              Search
            </Text>
          </TouchableOpacity>

          <MainBanner />

          <AdBanner />

          <TodayBanner />

          <TrendingBanner />

          <DynamicSection />
        </ScrollView>
      </LinearGradient>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
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
  image: {
    height: 160,
    width: 330,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  containerFlatList: {
    marginBottom: 15
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
    borderBottomRightRadius: 10
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  searchText: {
    marginRight: 10,
    color: 'lightgray'
  },
  modalContainer: {
    height,
    width,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalBackground: {
    position: 'absolute',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    height: height - 360,
    width: width - 100,
    borderRadius: 10
  },
});

export default Home;
