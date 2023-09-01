import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Modal, ToastAndroid, ProgressBarAndroid } from 'react-native';
import imageData from '../apiData/200x200';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
import ViewShot from "react-native-view-shot";
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image'
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import { RNFFmpeg } from 'react-native-ffmpeg';

import DropDownPicker from 'react-native-dropdown-picker';

import SelectDropdown from 'react-native-select-dropdown'

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

  const { bannername } = route.params;

  const { items, index } = route.params
  // console.log(items)

  const videos = useMemo(() => items.filter((item) => item.isVideo === true), []);
  const images = useMemo(() => items.filter((item) => item.isVideo === false), []);

  const [i, seti] = useState(0);

  useEffect(() => {
    if (i < 2) {
      if (images.length != 0) {
        setItem(images[index ? index - 1 : 0]?.todayAndTomorrowImageOrVideo)
        seti(i)
      } else {
        setItem(images[index ? index - 1 : 0]?.imageUrl)
        seti(i)
      }
    } else {
      console.log("i is bigger")
    }
  }, [i, index, items])

  const [item, setItem] = useState();
  const [currentFrame, setCurrentFrame] = useState(0);

  console.log(currentFrame, "this is my current frame!")
  const [customFrames, setCustomFrames] = useState([]);
  const viewShotRef = useRef(null);

  const [displayImage, setdisplayImage] = useState(false)

  useEffect(() => {
    loadCustomFrames();
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      if (framesData.length !== 2 && framesData) {
        const frames = JSON.parse(framesData);
        setCustomFrames(frames);
      } else {
        showAlert()
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  const handleImagePress = (item) => {
    setItem(item);
  };

  const handleImagePressV = (item) => {
    setSelectedVideo(item?.todayAndTomorrowImageOrVideo);
  };


  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const fetchDetails = async () => {
    if (i < 5) {

      try {
        if (profileData) {

          const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.mobileNumber}`);
          const result = response.data;

          if (response.data.statusCode == 200) {
            setUserTeamDetails('Purchase');
          } else {
            console.log("user no data aavto nathi athava purchase request ma che ");
          }
        } else {
          console.log('details malti nathi!')
        }
      } catch (error) {
        console.log('Error fetching data... edit home:', error);
      } finally {
        setTimeout(() => {
          setIsLoader(false)
        }, 1000);
      }
    }

  }

  useEffect(() => {
    fetchDetails();
  })
  const [isLoader, setIsLoader] = useState(true)

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
      }
    } else {
      showToastWithGravity("Purchase MLM to share/download")
    }
  };

  const videoRef = useRef();
  const frameRef = useRef();

  // -----------------------------------------------------------------------------------------------------

  const convertFileToBase64 = async (fileUri) => {
    const response = await RNFetchBlob.fs.readFile(fileUri, 'base64');
    return response;
  };

  // now cahnge the code

  const [isProcessing, setIsProcessing] = useState(false);

  const captureAndShareVideoWithOverlay = async (imageSource) => {

    if (videos.length != 0) {
      
    const videoURL = selectedVideo;
    console.log("select karelo video: ", selectedVideo);
  
    console.log("This is my image of frame", imageSource);
  
    setIsProcessing(true);
    try {
      // Clear previous temporary files (if any)
      await clearCache();
  
      // Generate unique file names for the video, image, and output
      const videoFileName = `video_${Date.now()}.mp4`;
      const imageFileName = `image_${Date.now()}.png`;
      const outputFileName = `output_${Date.now()}.mp4`;
  
      // Download the video to a temporary directory with a unique name
      const videoResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${videoFileName}`,
      }).fetch('GET', videoURL);
  
      const videoPath = videoResponse.path();
  
      // Download the image to a temporary directory with a unique name
      const imageResponse = await RNFetchBlob.config({
        fileCache: true,
        path: `${RNFetchBlob.fs.dirs.CacheDir}/${imageFileName}`,
      }).fetch('GET', imageSource);
  
      const imagePath = imageResponse.path();
  
      // Increase video resolution and bitrate
      const resizedVideoPath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedVideo.mp4`;
      const resizeVideoCommand = `-i ${videoPath} -vf "scale=720:720" -b:v 2M -c:a copy ${resizedVideoPath}`;
      await RNFFmpeg.execute(resizeVideoCommand);
  
      // Increase image resolution
      const resizedImagePath = `${RNFetchBlob.fs.dirs.CacheDir}/resizedImage.png`;
      const resizeImageCommand = `-i ${imagePath} -vf "scale=720:720" ${resizedImagePath}`;
      await RNFFmpeg.execute(resizeImageCommand);
  
      // Combine resized video and image using FFmpeg
      const outputPath = `${RNFetchBlob.fs.dirs.CacheDir}/${outputFileName}`;
      const ffmpegCommand = `-i ${resizedVideoPath} -i ${resizedImagePath} -filter_complex "[0:v][1:v]overlay=0:0" -b:v 2M -c:a copy ${outputPath}`;
      await RNFFmpeg.execute(ffmpegCommand);
  
      setIsProcessing(false);
  
      // Share the video
      const shareOptions = {
        title: 'Share Video with Branding Profitable!',
        url: `file://${outputPath}`,
        type: 'video/mp4',
        failOnCancel: false,
      };
  
      await Share.open(shareOptions);
      setIsProcessing(false);
    } catch (error) {
      console.log('Error during video sharing:', error);
      showToastWithGravity("Troubleshooting, Please try again later")
      setIsProcessing(false);
    }
  
    setIsProcessing(false);

  }
else{
  showToastWithGravity('video not found!')
}
  };
  

  const clearCache = async () => {
    try {
      const cacheDir = RNFetchBlob.fs.dirs.CacheDir;
      const files = await RNFetchBlob.fs.ls(cacheDir);

      // Delete all files in the cache directory
      for (const file of files) {
        await RNFetchBlob.fs.unlink(`${cacheDir}/${file}`);
      }

      console.log('Cache cleared');
    } catch (error) {
      console.log('Error clearing cache:', error);
    }
  };


  // -----------------------------------------------------------------------------------------------------

  const [isLoad, setIsLoad] = useState(true)
  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item?.todayAndTomorrowImageOrVideo ? item?.todayAndTomorrowImageOrVideo : item.imageUrl)}>
      <FastImage source={item?.todayAndTomorrowImageOrVideo ? { uri: item?.todayAndTomorrowImageOrVideo } : { uri: item.imageUrl }} style={styles.image} onLoadEnd={() => Image.prefetch(item?.todayAndTomorrowImageOrVideo ? item?.todayAndTomorrowImageOrVideo : item.imageUrl)} />
    </TouchableOpacity>
  ), []);

  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
        <Icon name="play-circle" size={30} color={"white"} />
      </View>
      <FastImage source={item?.todayAndTomorrowImageOrVideo ? { uri: item?.todayAndTomorrowImageOrVideo } : { uri: item.imageUrl }} style={styles.image} onLoadEnd={() => Image.prefetch(item?.todayAndTomorrowImageOrVideo ? item?.todayAndTomorrowImageOrVideo : item.imageUrl)} />
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
      setSelectedVideo(videos[0]?.todayAndTomorrowImageOrVideo)
      setj(j + 1)
    }
  })

  // languages
  const [userToken, setUserToken] = useState()
  const [profileData, setProfileData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([
    { languageName: 'English' },
    { languageName: 'ગુજરાતી' },
    { languageName: 'हिन्दी' }
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

  const [k, setk] = useState(0)
  const [l, setl] = useState(0)

  let [apiRun, setApiRun] = useState(true)
  const fetchData = async () => {
    try {
      const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/language/languages',
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      const result = response.data.data;
      setApiRun(false)

      setLanguages(result);
    } catch (error) {
      console.log('Error fetching data... edit home:', error);
    }

  };

  useEffect(() => {
    if (apiRun) {

      fetchData();
    }
  }, [fetchData])

  const [callLanguageFunc, setCallLanguageFunc] = useState(true)

  useEffect(() => {
    setInterval(() => {
      if (k > 5) {
        setk(k + 1)
        if (callLanguageFunc) {
          setCallLanguageFunc(false)
        }
      }
    }, 10000);
  })

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };

  // filter of languages 

  const filteredItems = items.filter((item) => (item.languageName == selectedLanguage))

  if (isProcessing) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ height: 200, width: 200 }} source={require('../assets/output-onlinegiftools(1).gif')} />
      </LinearGradient >
    )
  }
  if (isLoader) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'white'} />
      </LinearGradient >
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
      <Modal
        animationType="fade" // You can use "fade" or "none" for animation type
        visible={isModalVisible}
        transparent={true}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',

        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 8,
            height: "40%",
            height: 230,
            width: 300,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* icon */}
            <TouchableOpacity onPress={hideAlert} style={{
              backgroundColor: 'red',
              padding: 8,
              borderRadius: 8,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold',
              }}><Feather name="log-out" size={25} color="white" /></Text>
            </TouchableOpacity>
            {/* title */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 10,
              color: 'red'
            }}>Let's Create Awesome Frames!</Text>
            {/* caption */}
            <Text style={{
              fontSize: 16,
              fontFamily: 'Manrope-Bold',
              marginTop: 5,
              color: 'lightgray',
              textAlign: 'center'
            }}>Now don't have any frames let's create!</Text>
            {/* another */}
            <View style={{ width: '80%', marginTop: 30, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  hideAlert()
                  navigation.navigate('StackProfileScreen');
                }}
                style={{
                  backgroundColor: 'red',
                  width: 70,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: "center",
                  borderRadius: 8,
                }}>
                <Text style={{
                  color: 'white',
                  fontFamily: "Manrope-Bold"
                }}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 30 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"white"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {bannername}
        </Text>
        <TouchableOpacity style={{ padding: 4, backgroundColor: 'rgba(255, 0, 0, 0.5)', borderRadius: 100, marginLeft: 10 }} onPress={!displayImage ? captureAndShareImage : () => { captureAndShareVideoWithOverlay(customFrames[currentFrame].image) }}>
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
          <ViewShot style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
            <Swiper loop={false} index={currentFrame} showsPagination={false}>
              {customFrames.map((frame, index) => (
                <TouchableOpacity key={index}>
                  <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                  <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                </TouchableOpacity>
              ))}
            </Swiper>
          </ViewShot>
        ) : (
          <View style={{ height: 300, width: 300, marginVertical: 20, elevation: 20 }} >
            {videoPause ? (
              <View style={{ justifyContent: 'center', alignItems: "center" }}>
                <ActivityIndicator />
              </View>
            )
              : (
                <View style={{ flex: 1 }}>
                  {/* Video component */}
                  {selectedVideo == null ? (
                    <View style={{ position: 'absolute', top: 100, left: 100, zIndex: 1 }}>
                      <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
                        No Video Found!
                      </Text>
                    </View>
                  ) : (
                    <Video
                      source={{ uri: selectedVideo }}
                      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                      resizeMode="cover"
                      onLoad={() => setVideoPause(false)}
                    />
                  )}

                  {/* Swiper component for overlay images */}
                  <Swiper loop={false} index={currentFrame} showsPagination={false} onIndexChanged={(index) => setCurrentFrame(index)}>
                    {customFrames.map((frame, index) => (
                      <View key={index}>
                        <FastImage source={{ uri: frame.image }} style={styles.overlayImage} />
                      </View>
                    ))}
                  </Swiper>

                </View>

              )}
          </View>
        )}

        <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', flex: 1, width: '92%', gap: 10, marginBottom: 65, height: 60 }}>
          {/* 2 */}

          <View style={{ width: 120, zIndex: 1, alignSelf: 'flex-end', height: '100%' }}>
            <SelectDropdown
              data={languages.map((language) => language.languageName)} // Use the language names
              onSelect={(selectedItem, index) => {
                setSelectedLanguage(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
              buttonStyle={{ backgroundColor: 'red', height: 30, borderRadius: 100, width: 130, }}
              rowTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 13, color: "black" }}
              buttonTextStyle={{ fontFamily: "Manrope-Regular", fontSize: 13, color: "white" }}
              defaultButtonText='Select Language'
              dropdownStyle={{ borderRadius: 10, marginTop: -32 }}
            />
          </View>


          <View style={{ flexDirection: 'row', gap: 10 }}>
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
          </View>


        </View>
        <View>
          {!displayImage ? (
            images.length > 0 ? (
              <FlatList
                data={selectedLanguage == 'All' || selectedLanguage == [] ? items : filteredItems}
                numColumns={3} // Adjust the number of columns as needed
                keyExtractor={(item) => item._id.toString()}
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
                data={selectedLanguage == 'All' || selectedLanguage == [] ? items : filteredItems}
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
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>No videos Found!</Text>
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
    paddingBottom: 70,
    paddingTop: 20
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
    fontFamily: 'Manrope-Bold',
    marginLeft: 20
  }
});

export default EditHome;