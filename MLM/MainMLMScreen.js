import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import MLMhome from './MLMhome';
import AfterSubscribe from './AfterSubscribe';
import axios from 'axios';

import MlmUserInReview from './MlmUserInReview';

const MainMLMScreen = () => {

    const [isSubscribed, setIsSubscribed] = React.useState('')
    console.log(isSubscribed)

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

    useEffect(() => {
        const subscriptionCheckInterval = setInterval(async () => {
          try {
            if (profileData) {
              console.log('Checking subscription status...');
      
              const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/premium/${profileData?.adhaar}`);
              const result = response.data.statusCode;
      
              setIsSubscribed(result);
            } else {
              console.log("No profile data available.");
            }
          } catch (error) {
            console.log('Error fetching subscription data:', error);
          } finally {
            setLoader(false); // Set loader to false after handling subscription status
          }
        }, 3000); // Run every 3 seconds
      
        // Clear the interval when the component unmounts
        return () => {
          clearInterval(subscriptionCheckInterval);
        };
      }, [profileData]);
      

    const [loader, setLoader] = React.useState(true)


    if (loader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={'black'} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {isSubscribed == 200 ? (
                <AfterSubscribe />
            ) : isSubscribed == 202 ? (
                <MlmUserInReview />
            ) : (
                <MLMhome />
            )}
        </View>
    )
}

export default MainMLMScreen