import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Banner from './Banner';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DynamicCustom from './DynamicCustom';

import Header from '../Header';

const Custom = ({ navigation }) => {
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

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', getNotificationCounts);

    // Clean up the listener when the component unmounts
    return () => unsubscribe()
  }, [navigation])

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>

      {/* header
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View style={{ backgroundColor: 'red', borderRadius: 100, borderWidth: 1, borderColor: 'black', height: 45, width: 45, overflow: 'hidden' }}>
            <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage }} style={{ height: 45, width: 45 }} />
          </View>
          <TouchableOpacity>
            <Text style={styles.yourBuisness}>
              {businessOrPersonal ? "Business" : 'Profile'}
            </Text>
            <Text style={styles.buisnessTitle}>
              {profileData !== null && profileData?.fullName || "John Doe"}
            </Text>
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
              elevation:2,
              borderColor:'white',
              borderWidth:0.2
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
      </View> */}


      <ScrollView style={{ flex: 1, }}>
        <Header />
        <View style={{ marginTop: 20 }}>
          <Banner />

          <DynamicCustom />
        </View>
      </ScrollView>

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

export default Custom;
