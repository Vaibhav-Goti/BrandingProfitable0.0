import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
    const [businessOrPersonal, setBusinessOrPersonal] = useState('');
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchData = async () => {
        const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
        setBusinessOrPersonal(businessOrPersonal);
      };
  
      fetchData();
    }, []);
  
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
      }
    };
  
    const [notificationCount, setNotificationCount] = useState(0);
  
    const getNotificationCounts = async () => {
      try {
          const notificationsData = await AsyncStorage.getItem('notificationData');
          const parsedNotifications = JSON.parse(notificationsData || '[]');
  
          setNotificationCount(parsedNotifications?.counts.unreadCount);
        } catch (error) {
          console.log('Error getting notification counts:', error);
        }
      };
  
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
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View
            style={{
              backgroundColor: 'red',
              borderRadius: 100,
              borderWidth: 1,
              borderColor: 'black',
              height: 45,
              width: 45,
              overflow: 'hidden',
            }}>
            <FastImage
              source={{ uri: profileData?.businessLogo || profileData?.profileImage }}
              style={{ height: 45, width: 45 }}
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.yourBuisness}>
              {businessOrPersonal == 'business' ? 'Business' : 'Profile'}
            </Text>
            <Text style={styles.buisnessTitle}>
              {profileData !== null && profileData?.fullName || 'John Doe'}{' '}
              <Icon name="angle-down" size={25} />
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ position: 'relative' }}>
          <Icon name="bell" size={27} color={'#FF0000'} />
          {notificationCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                padding: 3,
                borderRadius: 100,
                backgroundColor: 'red',
                borderColor: 'white',
                borderWidth: 0.2,
                elevation: 2,
              }}>
              <Text
                style={{
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
    );
};

export default Header;

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
      elevation: 5,
    },
    headerText: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
    },
    buisnessTitle: {
      fontSize: 19,
      color: 'black',
      fontFamily: 'Manrope-Bold',
    },
    yourBuisness: {
      fontSize: 12,
      fontFamily: 'Manrope-Regular',
    },
});
