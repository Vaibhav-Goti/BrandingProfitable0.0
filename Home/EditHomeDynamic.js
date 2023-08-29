import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity, ActivityIndicator, Button, Modal, ToastAndroid } from 'react-native';
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
import Feather from 'react-native-vector-icons/Feather'
import DropDownPicker from 'react-native-dropdown-picker';
import SelectDropdown from 'react-native-select-dropdown';
// import CameraRoll from '@react-native-community/cameraroll';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5;

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

  useEffect(() => {
    if (i < 2) {
      if (items.length > 0) {
        setItem(items[index ? index : 0].imageUrl)
        seti(i)
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
      if (framesData.length !== 2 && framesData ) {
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
    setSelectedVideo(item.uri);
  };

  const [isLoader, setIsLoader] = useState(true)
  // fetch the user team details 
  const [userTeamDetails, setUserTeamDetails] = useState([])

  // {"data": {"greenWallet": 4000, "leftSideTodayJoining": 2, "leftSideTotalJoining": 2, "redWallet": -1000, "rightSideTodayJoining": 1, "rightSideTotalJoining": 1, "totalRewards": 3000, "totalTeam": 4}, "message": "Get Wallet History Successfully", "statusCode": 200}

  // all users details 

  const fetchDetails = async () => {
    try {
      if (profileData) {

        const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/wallet/wallet/${profileData?.mobileNumber}`);
        const result = response.data;

        if (response.data.statusCode == 200) {
          setUserTeamDetails('Purchase')
        } else {
          console.log("user not data aavto nathi athava purchase request ma che ");
        }
      } else {
        console.log('details malti nathi!')
      }
    } catch (error) {
      console.log('Error fetching data... edit home dynamic:', error);
    } finally {
      setTimeout(() => {
        setIsLoader(false)
      }, 1000);
    }
  }

  useEffect(() => {
    fetchDetails();
  })

  const [isModalVisible, setModalVisible] = useState(false);

  const showAlert = () => {
    setModalVisible(true);
  };

  const hideAlert = () => {
    setModalVisible(false);
  };

  console.log(userTeamDetails)

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

  const captureAndShareVideo = async () => {
    showToastWithGravity("Video Share is in Development!")
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

  const [FlatlistisLoad, setFlatlistIsLoad] = useState(true)

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item.imageUrl)}>
      <FastImage source={{ uri: item.imageUrl }} style={styles.image} onLoadEnd={() => Image.prefetch(item.imageUrl)} />
    </TouchableOpacity>
  ), []);

  const renderItemV = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePressV(item)}>
      <FastImage source={{ uri: item.imageUrl }} style={styles.image} onLoadEnd={() => Image.prefetch(item.imageUrl)} />
      <View style={{ position: 'absolute', top: 45, left: 45, zIndex: 1, }}>
        <Icon name="play-circle" size={30} color={"white"} />
      </View>
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
      setSelectedVideo(videos[0].imageUrl);
      setj(j + 1);
    }
  }, [videos, j]); // Add dependency array

  const [load, setisload] = useState(true)

  setTimeout(() => {
    setisload(false)
  }, 2000);

  const [selectedLanguage, setSelectedLanguage] = useState('');

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [open, setOpen] = useState(false);

  // fetch languages 

  const [languages, setLanguages] = useState([
    { languageName: 'English' },
    { languageName: 'ગુજરાતી' },
    { languageName: 'हिन्दी' }
  ])

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

  useEffect(()=>{
    if(apiRun){

      fetchData();
    }
  }, [fetchData])

  const [callLanguageFunc, setCallLanguageFunc] = useState(true)

  useEffect(() => {
    if (callLanguageFunc) {
      setCallLanguageFunc(false)
    }
  })

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

  const filteredItems = items.filter((item) => (item.languageName == selectedLanguage))

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
                    <FastImage source={{ uri: item }} style={[styles.mainImage, { borderRadius: 10 }]} />
                  </TouchableOpacity>
                ))}
              </Swiper>
            </ViewShot>)

        ) : (
          <View style={{ height: 300, width: 300, marginVertical: 20, elevation: selectedVideo == null ? 1 : 20, borderColor: 'white', borderWidth: selectedVideo == null ? 1 : 0, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} >
            {videoPause ? (
              <View style={{ justifyContent: 'flex-start', alignItems: "center", flex: 1 }}>
                <ActivityIndicator />
              </View>
            )
              : (
                <Swiper loop={false} index={currentFrame} showsPagination={false}>
                  {customFrames.map((frame, index) => (
                    <View key={index}>
                      {selectedVideo == null ? (
                        <View style={{ position: 'relative', top: width - 200, left: width - 240 }}>
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
              dropdownStyle={{borderRadius:10,marginTop:-32}}
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

          {!displayImage ? (
            items.length > 0 ? (
              <FlatList
                data={selectedLanguage == 'All' || selectedLanguage == [] ? items : filteredItems}
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
                <View style={{ justifyContent: 'flex-start', flex: 1, }}>
                  <Text style={{ color: 'white' }}>No videos Found!</Text>
                </View>
              )
          )}

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
    paddingBottom:40,
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
  },
});

export default EditHome;