import React, { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashActivity = ({ navigation }) => {
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      const userLoggedIn = !!username; // Check if username exists

        if (userLoggedIn) {
          navigation.replace('Main'); // Replace 'HomeScreen' with your actual home screen name
        } else {
          navigation.replace('Details'); // Replace 'LoginScreen' with your actual login screen name
        }
    } catch (error) {
      console.log('Error retrieving username from AsyncStorage:', error);
    }
  };

  return <View />;
};

export default SplashActivity;
