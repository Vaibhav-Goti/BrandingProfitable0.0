import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const itemWidth = width / 2.3;

const showToastWithGravity = (data) => {
  ToastAndroid.showWithGravityAndOffset(
    data,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    0,
    50,
  );
};

const RequestFrame = ({ navigation }) => {
  const [requested, setRequested] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [profileData, setProfileData] = useState({});
  const [customFrames, setCustomFrames] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const retrieveProfileData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    retrieveProfileData();
  }, [retrieveProfileData]);

  const handleRequest = useCallback(async () => {
    setRequested(true);
    const apiUrl =
      'https://b-p-k-2984aa492088.herokuapp.com/framerequest/framerequest';

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const requestData = {
      userId: profileData?._id,
      userName: profileData?.fullName,
      userMobileNumber: profileData?.mobileNumber,
      isFrameCreated: false,
      frameRequestDate: formattedDate,
    };

    try {
      const response = await axios.post(apiUrl, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.statusCode === 200) {
        showToastWithGravity('Request Sent Successfully!');
      } else {
        showToastWithGravity('Troubleshooting to Send Request!');
      }
    } catch (error) {
      console.log(error);
      showToastWithGravity('Troubleshooting to Send Request!');
    }

    setTimeout(() => {
      setRequested(false);
    }, 2000);
  }, [profileData, userToken]);

  const gettingUserFrames = useCallback(async () => {
    if (profileData) {
      const userid = profileData._id;
      const apiUrl = `https://b-p-k-2984aa492088.herokuapp.com/saveframe/frameimage`;
      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        // {"data": [{"_id": "64f0515e3610f105bacefcf7", "image": "https://sparrowsofttech.in/cdn/images/64f0515e1cf90.png"}], "message": "Read All Frame", "statusCode": 200}
        // console.log(response.data.data)

        setCustomFrames(response.data.data);
      } catch (e) {
        console.log('Error getting user saved frames...', e);
      }
    }
  }, [profileData, userToken]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([retrieveProfileData(), gettingUserFrames()]);
      setLoader(false);
    };

    fetchData();
  }, [retrieveProfileData, gettingUserFrames]);

  //   LOG  {"__v": 0, "_id": "64edd7473a0b18f0166b92a4", "fullName_user": "Gohel Meet", "mobileNumber_user": 8490803632, "savedFrame_user": "https://sparrowsofttech.in/cdn/images/64edd746bc759.png", "userId": "64ea11ca706ccbfd1ecbe022"}

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => handleSelect(item)}
      >
        <View style={styles.imageInnerContainer}>
          <FastImage source={{ uri: item.image }} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleSelect = (item) => {
    navigation.navigate('CustomFrameFormProfile', { itemId: item._id, isRequest: 'yes' });
  };

  if (loader) {
    return (
      <View>
        <ActivityIndicator color={'white'} />
      </View>
    )
  }

  return (
    <LinearGradient
      colors={['#20AE5C', 'black']}
      style={styles.container}
      locations={[0.1, 1]}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, requested && styles.requestedButton]}
          onPress={handleRequest}
          disabled={requested} // Disable button when requested is true
        >
          <Feather name={requested ? 'check-circle' : 'git-pull-request'} size={20} color="white" />
          <Text style={styles.buttonText}>{requested ? 'Requested' : 'Request'}</Text>
        </TouchableOpacity>
      </View>
      {customFrames.length !== 0 && (
        <FlatList
          data={customFrames}
          numColumns={2}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContainer}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          windowSize={10}
          refreshing={refreshing}
          onRefresh={gettingUserFrames}
        />
      )}
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '40%',
    padding: 10,
    paddingTop: 20
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 0.2,
    borderRadius: 10,
  },
  requestedButton: {
    backgroundColor: '#20AE5C',
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Manrope-Regular',
    marginLeft: 5,
  },
  flatListContainer: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 80,
  },
  imageContainer: {
    alignItems: 'center',
    margin: 7,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  imageInnerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  image: {
    height: itemWidth,
    width: itemWidth,
  },
};

export default RequestFrame;
