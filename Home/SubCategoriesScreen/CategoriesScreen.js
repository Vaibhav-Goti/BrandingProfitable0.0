import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Video from 'react-native-video'
import React, { useCallback, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const CategoriesScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/todayandtomorrow/today_tomorrow';

        // Make the GET request using Axios
        axios
            .get(apiUrl)
            .then(response => {
                // Handle the successful response
                setData(response.data.data); // Use response.data.data instead of response.data
                setLoading(false);
            })
            .catch(error => {
                // Handle errors
                console.error('Error fetching data...:', error)
                setLoading(false);
            });

    }, []);

    const [data, setData] = useState([])
  const [displayImage, setdisplayImage] = useState(false)

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
  const captureAndShareVideo = async () => {
    console.log("share video clicked")
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

    // render images
    // onPress={() => { navigation.navigate('EditHomeScreen', { 'bannername': item.categoryName }) }} 

    const renderItem = useCallback(({ item }) => (
        <View style={styles.BannerItem}>
            <View style={styles.bannerHeader}>
                <Text style={styles.bannerHeaderText}>
                    {item.categoryName}
                </Text>
                {/* <Text style={styles.bannerHeaderText}>
                    <Icon name="angle-right" size={32} color={"white"} />
                </Text> */}
                
            </View>
            <FlatList
                data={item.items}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item: imageItem, index }) => (
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('EditHomeScreen', {
                                items: item.items,
                                bannername: item.categoryName,
                                index:index
                            });
                        }}
                    >
                        <FastImage
                            source={{ uri: imageItem.todayAndTomorrowImageOrVideo }}
                            style={[styles.image, { marginLeft: index == 0 ? 15 : 0 }]}
                            onLoadEnd={() => Image.prefetch(imageItem.todayAndTomorrowImageOrVideo)}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    ), [navigation]);

    // if (loading) {
    //     return (
    //         <View style={styles.container}>
    //             <ActivityIndicator />
    //         </View>
    //     )
    // }

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate('HomeScreen') }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.navigate('HomeScreen') }}>
                    Today & Tommorrow
                </Text>
                
            </View>
            {/* container */}
            {loading && <View style={styles.container}>
                <ActivityIndicator />
            </View>}
            <View style={styles.container}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.categoryName}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    shouldComponentUpdate={() => false}
                    removeClippedSubviews
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                />
            </View>
            </LinearGradient>
    )
}

// [{"__v": 0, "_id": "64be599da5ba4bf6a044d760", "categoryName": "Mohram", "image": "https://www.sparrowgroups.com/CDN/upload/580mohram.jpg", "imageDate": "2023-07-24", "imageName": "Mohram", "todayAndTomorrowCategoryId": "06", "todayAndTomorrowCategorySwitch": true}, {"__v": 0, "_id": "64be5986a5ba4bf6a044d75a", "categoryName": "FreindShip", "image": "https://www.sparrowgroups.com/CDN/upload/660Happy-Friendship-Day-Images.jpg", "imageDate": "2023-07-24", "imageName": "FriendShip Day", "todayAndTomorrowCategoryId": "05", "todayAndTomorrowCategorySwitch": true}, {"__v": 0, "_id": "64be5963a5ba4bf6a044d754", "categoryName": "Shravan", "image": "https://www.sparrowgroups.com/CDN/upload/7811657822174_happy-shravan-maas-card-images-with-name-edit.jpg", "imageDate": "2023-07-24", "imageName": "Shravan Maas", "todayAndTomorrowCategoryId": "04", "todayAndTomorrowCategorySwitch": true}, {"__v": 0, "_id": "64be594ba5ba4bf6a044d74e", "categoryName": "attitude Quotes", "image": "https://www.sparrowgroups.com/CDN/upload/421attitude.jpg", "imageDate": "2023-07-24", "imageName": "attitude Quotes", "todayAndTomorrowCategoryId": "03", "todayAndTomorrowCategorySwitch": true}, {"__v": 0, "_id": "64be58bea5ba4bf6a044d740", "categoryName": "sport", "image": "https://www.sparrowgroups.com/CDN/upload/448cricket-g3aaf329d8_640.jpg", "imageDate": "2023-07-24", "imageName": "sport", "todayAndTomorrowCategoryId": "02", "todayAndTomorrowCategorySwitch": true}, {"__v": 0, "_id": "64b8b60311e8c4d7cbf9ac36", "categoryName": "abc", "image": "https://www.sparrowgroups.com/CDN/upload/903Frame 228_0.webp", "imageDate": "2023-07-21", "imageName": "efef", "todayAndTomorrowCategoryId": "01", "todayAndTomorrowCategorySwitch": true}]

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginLeft: 20
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        paddingTop: 10
    },
    image: {
        borderRadius: 10,
        margin: 7,
        width: 125,
        height: 125
    },
    BannerItem: {
        marginBottom: 10,
        width: '100%'
    },
    bannerHeader: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20
    },
    bannerHeaderText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Manrope-Bold',
    },
    flatListContainer: {
        width: width,
        paddingBottom: 50
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
})

export default CategoriesScreen