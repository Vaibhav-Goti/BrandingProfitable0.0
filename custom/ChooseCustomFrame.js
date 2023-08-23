import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Image, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';
import RNFS from 'react-native-fs';
import axios from 'axios';


const { width } = Dimensions.get('window')

const ChooseCustomFrame = ({ navigation, route }) => {
  const viewShotRef = useRef(null);

  const { capturedImage } = route.params;

  console.log(capturedImage, "capturedImage")

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };



  const [isOpenFrame, setIsOpenFrame] = useState(false)

  const handleFrame = () => {
    setIsOpenFrame(!isOpenFrame)
  }

  // custom frames & overlay image 

  const [customFrames, setCustomFrames] = useState([]);


  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      if (framesData) {
        const frames = JSON.parse(framesData);
        setCustomFrames(frames);
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  const [overLayImage, setOverlayImage] = useState('')

  
  const [isLoader, setIsLoader] = useState(true)
  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  console.log(userTeamDetails)

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const [profileData, setProfileData] = useState(null);

  // setInterval(() => {
  //   retrieveProfileData()
  // }, 3000);

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

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.adhaar}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          setUserTeamDetails('Purchase')
          console.log(response.data.statusCode)
        } else {
          console.log("user not data aavto nathi athava purchase request ma che ")
        }
      } else {
        console.log('details malti nathi!')
      }
    } catch (error) {
      console.log('Error fetching data...:', error);
    } finally {
      setTimeout(() => {
        setIsLoader(false)
      }, 1000);
    }
  }

  React.useEffect(() => {
    fetchDetails();
  })

    // capture viewshot 

    const captureAndShareImage = async () => {

      if (userTeamDetails === 'Purchase') {
        try {
          const uri = await viewShotRef.current.capture();
  
          const fileName = 'sharedImage.jpg';
          const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
  
          await RNFS.copyFile(uri, destPath);
  
          console.log('File copied to:', destPath); // Add this log to check the destination path
  
          const shareOptions = {
            type: 'image/jpeg',
            url: `file://${destPath}`,
          };
  
          await Share.open(shareOptions);
  
          navigation.navigate('EditCustomChoice');
        } catch (error) {
          console.error('Error sharing image:', error);
        }
  
      } else {
        showToastWithGravity("Purchase MLM to share/download")
      }
    };

  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'space-between' }}>

      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          Choose Frame
        </Text>
        <TouchableOpacity onPress={captureAndShareImage}>
          <Text style={{ height: 30, width: 30 }}>
            <MaterialCommunityIcons name="share-variant" size={30} color={"white"} />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ width: '100%', alignItems: 'center' }}>
        <ViewShot
          ref={viewShotRef}
          style={{
            width: 300,
            height: 300,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            overflow: 'hidden',
            elevation: 5,
            borderRadius: 10
          }}
        >

          <TouchableOpacity
            activeOpacity={1}
            style={{ height: '100%', width: '100%' }}
          >
            <FastImage source={{ uri: capturedImage }} style={styles.overlayImage} />
            <FastImage source={{ uri: overLayImage }} style={styles.overlayImage} />
          </TouchableOpacity>
        </ViewShot>
      </View>

      <View>


        {/* all frames */}
        {
          isOpenFrame &&
          <View style={{ height: 70, backgroundColor: 'white', width, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity activeOpacity={1} style={{ borderWidth: 1, borderRadius: 10, overflow: 'hidden', width: 50, height: 50, alignItems: 'center', justifyContent: 'center', marginLeft: 10 }}
              onPress={() => {
                setOverlayImage(null)
              }}
            >
              <Image source={require('../assets/NoneImage.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
            {/* Frames list */}
            <FlatList
              data={customFrames}
              horizontal
              keyExtractor={(item) => item.image}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    borderWidth: 1,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginRight: 5,
                  }}
                  onPress={() => {
                    setOverlayImage(item.image);
                  }}>
                  <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingHorizontal: 10,
                alignItems: 'center', // Center all children vertically
              }}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        }

        {/* bottom */}
        <View style={{ height: 90, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>

          <TouchableOpacity activeOpacity={1} style={{ height: 60, width: 50, backgroundColor: 'white', borderRadius: 10, elevation: 5, margin: 10, alignContent: 'center', justifyContent: 'center' }} onPress={handleFrame}>

            <View style={{ width: '100%' }}>
              <Text style={{ color: 'black', textAlign: 'center' }}><FontAwesome6 name="expand" size={32} color={"black"} /></Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text style={{ color: 'black', textAlign: 'center', fontFamily: 'Manrope-Regular', fontSize: 9, marginTop: 2 }}>Frame</Text>
            </View>

          </TouchableOpacity>

        </View>

      </View>


    </LinearGradient>
  )
}

export default ChooseCustomFrame


const styles = StyleSheet.create({
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontFamily: "Manrope-Bold",
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    height: 300,
    width: 300,
    top: 0,
    borderRadius: 10
  },
})