import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
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
import DropDownPicker from 'react-native-dropdown-picker';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const EditItem = ({ route, navigation }) => {
  const { categoryName, isVideo } = route.params

  console.log(isVideo, "isvideo")

  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState([])

  const videos = useMemo(() => data.filter((item) => item.isVideo === true));
  const images = useMemo(() => data.filter((item) => item.isVideo === false));
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/category/${categoryName}`);
      const result = response.data;
      setdata(result)
    } catch (error) {
      console.log('Error fetching data...:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchData()
    }
  }, [categoryName]);

  // custom frame 
  const [currentFrame, setCurrentFrame] = useState(0);
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(isVideo ? true : false)

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

  //item 
  const [item, setItem] = useState([]);
  const [i, seti] = useState(0);

  // handle image or video press
  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    setSelectedVideo(item.image);
  };


  useEffect(() => {
    if (i < 2) {
      if (data.length > 0) {
        setItem(data[0].image)
        seti(i + 1)
      }
    } else {
      console.log("i is bigger")
    }
  }, [i, data])

  // share image 
  const captureAndShareImage = async () => {
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
    }
  };

  // capture video
  const captureAndShareVideo = async () => {
    Alert.alert("share video clicked")
    // try {
    //   const videoURL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';

    //   // Download the video to a temporary directory
    //   const response = await RNFetchBlob.config({
    //     fileCache: true,
    //     path: `${RNFetchBlob.fs.dirs.CacheDir}/sharedVideo.mp4`,
    //   }).fetch('GET', videoURL);

    //   const tempPath = response.path();

    //   const shareOptions = {
    //     title: 'Share Video',
    //     url: `file://${tempPath}`,
    //     social: Share.Social.WHATSAPP, // Change to other social media if needed
    //     failOnCancel: false,
    //   };

    //   // Share the video
    //   Share.open(shareOptions)
    //     .then((res) => console.log('Shared successfully'))
    //     .catch((err) => console.log('Error sharing:', err));
    // } catch (error) {
    //   console.log('Error during video sharing:', error);
    // }
  };

  // loader 
  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  // render items, image and video
  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item.image)}>
      <FastImage source={{ uri: item.image }} style={styles.image}
        onLoadEnd={() => Image.prefetch(item.image)}
      />
    </TouchableOpacity>
  ), []);


  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <Video
        source={{ uri: item.image }}   // Can be a URL or a local file.
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

  // for video 

  const [videoPause, setVideoPause] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const [j, setj] = useState(0)
  useEffect(() => {
    if (videos.length > 0 && j < 2) {
      setSelectedVideo(videos[0].image);
      setj(j + 1);
    }
  }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  // language

  const [userToken, setUserToken] = useState()
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([
    { languageName: 'English' },
    { languageName: 'ગુજરાતી' },
    { languageName: 'हिंदी' }
  ])

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

  const fetchDataL = async () => {
    try {
      const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/language/languages',
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response.data.data;

      setLanguages(result);
    } catch (error) {
      console.log('Error fetching data...:', error);
    }
  };

  const [callLanguageFunc, setCallLanguageFunc] = useState(true)
  const [isLoader, setIsLoader] = useState(true)

  useEffect(() => {
    setInterval(() => {
      if (callLanguageFunc) {
        fetchDataL()
        const all = {}
        setIsLoader(false)
        setCallLanguageFunc(false)
      }
    }, 1000);
  })
  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {categoryName}
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
            height: 300, width: 300, marginVertical: 20, borderWidth: 0.5, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (<ViewShot style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
              <Swiper loop={false} index={currentFrame} showsPagination={false}>
                {customFrames.map((frame, index) => (
                  <View key={index}>
                    <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                    <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                  </View>
                ))}
              </Swiper>
            </ViewShot>)

        ) : (
          <View style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} >
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
                        <View style={{ top: 90, left: 90 }}>
                          <Text>
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


        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'flex-start', flex: 1, width: '92%', gap: 10, marginTop: 10, marginBottom: 40 }}>
          {/* 1 */}
          <TouchableOpacity onPress={() => {
            setdisplayImage(false)
          }}
            style={{ height: 30, width: 80, backgroundColor: displayImage ? 'white' : 'red', alignItems: 'center', justifyContent: 'center', borderRadius: 20, }}>
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

        <View>

          {!displayImage ? (
            data.length > 0 ? (
              <FlatList
                data={images}
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
              <View style={{ height: '40%', alignItems: 'center', justifyContent: 'center' }}>
                <Text>No Images Found</Text>
              </View>
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
                <View style={{ justifyContent: 'flex-start', height: 200 }}>
                  <Text style={{ color: 'white' }}>No videos Found!</Text>
                </View>
              )
          )}
        </View>
      </View>
    </LinearGradient>
  )
}

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
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 19,
    color: 'white',
    fontFamily: 'Manrope-Bold',
    marginLeft: 20
  }
});

export default EditItem