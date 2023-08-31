import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import MLMhome from './MLMhome';
import AfterSubscribe from './AfterSubscribe';
import axios from 'axios';

import MlmUserInReview from './MlmUserInReview';

const MainMLMScreen = () => {

  const [isSubscribed, setIsSubscribed] = React.useState('')

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

  const [i, seti] = React.useState(0)
  const [loader, setLoader] = React.useState(true)

  useEffect(()=>{
    
  })



  useEffect(() => {
    const subscriptionCheckInterval = setInterval(async () => {
      if (i < 5) {
        seti(i + 1)
        try {
          if (profileData) {
            console.log('Checking subscription status...');

            const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/premium/${profileData?.mobileNumber}`);
            const result = response.data.statusCode;
            // console.log(result, "status code of mlm registers")
            setLoader(false); // Set loader to false after handling subscription status
            setIsSubscribed(result);
          } else {
            console.log("No profile data available.");
          }
        } catch (error) {
          console.log('Error fetching subscription data:', error);
        } finally {
          setLoader(false); // Set loader to false after handling subscription status
        }
        try {
          if (profileData) {
            console.log('Checking subscription status...');

            const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/paircount/${profileData?.mobileNumber}`);
            console.log(response.data)
            // console.log(result, "status code of mlm registers")
          } else {
            console.log("No profile data available.");
          }
        } catch (error) {
          console.log('Error fetching subscription data:', error);
        } finally {
          setLoader(false); // Set loader to false after handling subscription status
        }

      }

    }, 5000); // Run every 3 seconds

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(subscriptionCheckInterval);
    };
    setLoader(false); // Set loader to false after handling subscription status

  }, [profileData]);




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