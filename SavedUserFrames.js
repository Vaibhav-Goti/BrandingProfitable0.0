import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useSavedFrames = () => {
  const [userToken, setUserToken] = useState('');
  const [profileData, setProfileData] = useState([]);
  const [customFrames, setCustomFrames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const retrieveProfileData = async () => {
    try {
      const [dataString, userToken] = await AsyncStorage.multiGet([
        'profileData',
        'userToken',
      ]);
      setUserToken(userToken[1]);
      if (dataString) {
        const data = JSON.parse(dataString[1]);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  const gettingUserFrames = async () => {
    if (profileData) {
      const userid = profileData._id;
      const apiUrl = `https://b-p-k-2984aa492088.herokuapp.com/saveframe/frame/save/64ea11ca706ccbfd1ecbe022`;
      try {
        const response = await axios.get(apiUrl);

        console.log(response.data.data);
        setCustomFrames(response.data.data);
        setIsLoading(false);
      } catch (e) {
        console.log('Error getting user saved frames...', e);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([retrieveProfileData(), gettingUserFrames()]);
    };

    fetchData();
  }, []); // Make sure this effect runs only once

  return { customFrames, isLoading };
};

export default useSavedFrames;
