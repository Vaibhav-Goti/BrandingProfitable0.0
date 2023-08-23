import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Button, ToastAndroid } from 'react-native';
// import imageData from '../apiData/200x200';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import ViewShot from "react-native-view-shot";
import Video from 'react-native-video';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const EditHome = ({ route, navigation }) => {

  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const { bannername } = route.params; i

  const { items, index } = route.params

  const videos = useMemo(() => items.filter((item) => item.isVideo === true));
  const images = useMemo(() => items.filter((item) => item.isVideo === false));

  const [i, seti] = useState(0);

  
  const [userToken, setUserToken] = useState()
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    retrieveProfileData()
  }, [retrieveProfileData])

  const retrieveProfileData = async () => {
    try {
      const dataString = await AsyncStorage.getItem('profileData');
      const userToken = await AsyncStorage.getItem('userToken');
      setUserToken(userToken)
      if (dataString) {
        const data = JSON.parse(dataString);
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error retrieving profile data:', error);
    }
  };

  useEffect(() => {
    if (i < 2) {
      if (items.length > 0) {
        setItem(items[index ? index : 0].myBusinessImageOrVideo)
        seti(i + 1)
      }
    } else {
      console.log("i is bigger")
    }
  }, [i, index, items])

  const [item, setItem] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(false)

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

  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    setSelectedVideo(item.uri);
  };

  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])
  const [isLoader, setIsLoader] = useState(true)

  console.log(userTeamDetails)

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.adhaar}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          setUserTeamDetails('Purchase')
        } else {
          console.log("user not data aavto nathi athava purchase request ma che ")
        }
      } else {
        console.log('details malti nathi!')
      }
    } catch (error) {
      console.log('Error fetching data...:', error);
    }finally{
      setTimeout(() => {
        setIsLoader(false)
      }, 1000);
    }
  }

  useEffect(() => {
    fetchDetails();
  })


  const captureAndShareImage = async () => {
    if (userTeamDetails === 'Purchase') {
      try {
        const uri = await viewShotRef.current.capture();

        const fileName = 'sharedImage.jpg';
        const destPath = `${RNFS.CachesDirectoryPath}/${fileName}`;

        await RNFS.copyFile(uri, destPath);

        const shareOptions = {
          type: 'image/jpeg',
          url: `file://${destPath}`,
        };

        await Share.open(shareOptions);
      } catch (error) {
        console.error('Error sharing image:', error);
      } finally {
        setTimeout(() => {
          setIsLoader(false)
        }, 1000);
      }
    } else {
      showToastWithGravity("Purchase MLM to share/download")
    }
  };

  const videoRef = useRef();
  const frameRef = useRef();

  const captureAndShareVideo = async () => {
    console.log("share video clicked")
  };

  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item.myBusinessImageOrVideo)}>
      <FastImage source={{ uri: item.myBusinessImageOrVideo }} style={styles.image} onLoadEnd={() => Image.prefetch(item.myBusinessImageOrVideo)} />
    </TouchableOpacity>
  ), []);

  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <Video
        source={{ uri: item.myBusinessImageOrVideo }}   // Can be a URL or a local file.
        style={styles.image}
        paused={false}               // Pauses playback entirely.
        resizeMode="cover"            // Fill the whole screen at aspect ratio.
        muted={true}
        repeat={true}
      />
    </TouchableOpacity>
  ), []);

  setTimeout(() => {
    setFlatlistIsLoad(false)
  }, 6000);


  const [videoPause, setVideoPause] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [j, setj] = useState(0)
  useEffect(() => {
    if (videos.length > 0 && j < 2) {
      setSelectedVideo(videos[0].myBusinessImageOrVideo);
      setj(j + 1);
    }
  }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 15 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={[styles.headerText,]} onPress={() => { navigation.navigate('HomeScreen') }}>
          {bannername}
        </Text>
        <TouchableOpacity style={{ padding: 4, backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: 100, marginLeft: 10 }} onPress={!displayImage ? captureAndShareImage : captureAndShareVideo}>
          <View style={{
            zIndex: 1,
            padding: 8,
            borderRadius: 100,
            elevation: 30,
            backgroundColor: 'red',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ height: 20, width: 20 }}>
              <Icon name="download" size={25} color={"white"} />
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          load ? (<View style={{
            height: 300, width: 300, marginVertical: 20, borderWidth: 0.5, borderColor: 'gray', borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (<ViewShot style={{ height: 300, width: 300, marginVertical: 20, elevation: 20, borderWidth: 1, borderColor: 'white', borderRadius: 10, overflow: 'hidden' }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
              <Swiper loop={false} index={currentFrame} showsPagination={false}>
                {customFrames.map((frame, index) => (
                  <TouchableOpacity key={index}>
                    <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                    <Image source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                  </TouchableOpacity>
                ))}
              </Swiper>
            </ViewShot>)

        ) : (
          <View style={{ height: 300, width: 300, marginVertical: 20, elevation: selectedVideo == null ? 1 : 20, borderColor: 'white', borderWidth: selectedVideo == null ? 1 : 0, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} >
            {videoPause ? (
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            )
              : (
                <Swiper loop={false} index={currentFrame} showsPagination={false}>
                  {customFrames.map((frame, index) => (
                    <View key={index}>
                      {selectedVideo == null ? (
                        <View style={{ position: 'absolute', top: width - (width / 1.7), left: width - (width / 1.4) }}>
                          <Text style={{ color: 'white' }}>
                            No Video Found
                          </Text>
                        </View>
                      ) : (
                        <Video
                          source={{ uri: selectedVideo }}
                          style={styles.mainImage}
                          resizeMode="cover"
                          onLoad={() => setVideoPause(false)}
                        />
                      )}
                      <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                    </View>
                  ))}
                </Swiper>
              )}
          </View>
        )}
        {/* <TouchableOpacity style={styles.ShareContainer} onPress={!displayImage ? captureAndShareImage : captureAndShareVideo}>
          <FastImage source={require('../assets/whatsapp2.png')} style={styles.whatsappImage} />
        </TouchableOpacity> */}



        {/* <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'flex-start',flex:1,width:'92%', gap:10, marginBottom:10}}>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(false)
          }}   >
            <Text style={{ color: !displayImage ? "white" : "gray", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20,  }}>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(true)
          }}>
            <Text style={{ color: !displayImage ? "gray" : "white", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20 }}>
              Video
            </Text>
          </TouchableOpacity>
        </View> */}



        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', flex: 1, width: '92%', gap: 10, marginBottom: 40 }}>
          {/* 1 */}
          <TouchableOpacity onPress={() => {
            setdisplayImage(false)
          }}
            style={{ height: 30, width: 80, backgroundColor: displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <Text style={{ color: displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
              Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setdisplayImage(true)
          }} style={{ height: 30, width: 80, backgroundColor: !displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
            <Text style={{ color: !displayImage ? 'gray' : 'white', fontFamily: 'Manrope-Regular' }}>
              Videos
            </Text>
          </TouchableOpacity>
          {/* 2 */}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {!displayImage ? (
            items.length > 0 ? (
              <FlatList
                data={items}
                numColumns={3} // Adjust the number of columns as needed
                // keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContainer}
                shouldComponentUpdate={() => false}
                removeClippedSubviews
                initialNumToRender={30}
                maxToRenderPerBatch={30}
                windowSize={10}
              />
            ) : (
              <FlatList
                data={items}
                numColumns={3} // Adjust the number of columns as needed
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContainer}
                shouldComponentUpdate={() => false}
                removeClippedSubviews
                initialNumToRender={30}
                maxToRenderPerBatch={30}
                windowSize={10}
              />
            )
          ) : (
            FlatlistisLoad ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
                <ActivityIndicator />
              </View>
            ) :
              videos.length > 0 ? (
                <FlatList
                  data={videos}
                  numColumns={3} // Adjust the number of columns as needed
                  // keyExtractor={(item) => item.id.toString()}
                  renderItem={renderItemV}
                  contentContainerStyle={styles.flatListContainer}
                  shouldComponentUpdate={() => false}
                  removeClippedSubviews
                  initialNumToRender={30}
                  maxToRenderPerBatch={30}
                  windowSize={10}
                />
              ) : (
                <View style={{ justifyContent: 'flex-start', flex: 1, marginTop: 30 }}>
                  <Text style={{ color: 'white' }}>No videos Found!</Text>
                </View>
              )
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    height: 300,
    width: 300,
    zIndex: 1,
    top: 0,
    borderRadius: 10
  },
  mainImage: {
    height: 300,
    width: 300,
    zIndex: -1
  },
  image: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'lightgray'
  },
  flatListContainer: {
  },
  ShareContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
    borderRadius: 10,
    elevation: 30,
  },
  whatsappImage: {
    height: 40,
    width: 40,
  },
  headerContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    fontFamily: 'Manrope-Bold'
  }
});

export default EditHome;