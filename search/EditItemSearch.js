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

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const EditItem = ({ route, navigation }) => {
  const { categoryName } = route.params

  const [loading, setLoading] = useState(true)
  const [data, setdata] = useState([])

  const videos = useMemo(() => data.filter((item) => item.isVideo === true));
  const images = useMemo(() => data.filter((item) => item.isVideo === false));
  console.log(images)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://branding-profitable-de8df13d081b.herokuapp.com/category/${categoryName}`);
      const result = response.data;
      setdata(result)
      console.log(result,'result')
    } catch (error) {
      console.log('Error fetching data:', error);
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

  //item 
  const [item, setItem] = useState([]);
  const [i, seti] = useState(0);

  console.log(item, 'item')

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

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color={"black"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {categoryName}
        </Text>
      </View>
      <View style={styles.container}>
        {/* main image */}
        {!displayImage ? (
          load ? (<View style={{
            height: 250, width: 250, marginVertical: 20, borderWidth: 0.5, borderColor: 'black', borderRadius: 10, justifyContent: 'center', alignItems: 'center'
          }}>
            <ActivityIndicator />
          </View>) :

            (<ViewShot style={{ height: 250, width: 250, marginVertical: 20, elevation: 20 }} ref={viewShotRef} options={{ format: 'jpg', quality: 1 }}>
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
          <View style={{ height: 250, width: 250, marginVertical: 20, elevation: 20 }} >
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
        <TouchableOpacity style={styles.ShareContainer} onPress={!displayImage ? captureAndShareImage : captureAndShareVideo}>
          <FastImage source={require('../assets/whatsapp2.png')} style={styles.whatsappImage} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(false)
          }}>
            <Text style={{ color: !displayImage ? "black" : "gray", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20 }}>
              Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 10, }} onPress={() => {
            setdisplayImage(true)
          }}>
            <Text style={{ color: !displayImage ? "gray" : "black", fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20 }}>
              Video
            </Text>
          </TouchableOpacity>
        </View>
        {!displayImage ? (
          data.length > 0 ? (
            <FlatList
              data={data}
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
              data={data}
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
            <View>
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
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text>No videos Found!</Text>
              </View>
            )
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  overlayImage: {
    position: 'absolute',
    opacity: 1,
    height: 250,
    width: 250,
    zIndex: 1,
    top: 0,
    borderRadius: 10
  },
  mainImage: {
    height: 250,
    width: 250,
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20
  }
});

export default EditItem