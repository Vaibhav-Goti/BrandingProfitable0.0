import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Video from 'react-native-video'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const CategoriesScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://branding-profitable-de8df13d081b.herokuapp.com/trending_section/trendingandnews_item';

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
                console.error('Error fetching data:', error)
                setLoading(false);
            });

    }, []);

    const [data, setData] = useState([])

    // render images
    // onPress={() => { navigation.navigate('EditHomeScreen', { 'bannername': item.categoryName }) }} 

    const renderItem = useCallback(({ item }) => (
        <View style={styles.BannerItem}>
            <View style={styles.bannerHeader}>
                <Text style={styles.bannerHeaderText}>
                    {item.categoryName}
                </Text>
                <Text style={styles.bannerHeaderText}>
                    <Icon name="angle-right" size={32} color={"black"} />
                </Text>
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
                                index: index
                            });
                        }}
                    >
                        {imageItem.isVideo ? (
                            <Video
                                source={{ uri: imageItem.todayAndTomorrowImageOrVideo }}
                                style={styles.image}
                                resizeMode="cover"
                                muted={true}
                                repeat={true}
                            />
                        ) : (
                            <FastImage
                                source={{ uri: imageItem.todayAndTomorrowImageOrVideo }}
                                style={[styles.image, { marginLeft: index == 0 ? 15 : 0 }]}
                                onLoadEnd={() => Image.prefetch(imageItem.todayAndTomorrowImageOrVideo)}
                            />
                        )}
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
        <>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => { navigation.navigate('HomeScreen') }}>
                    <Icon name="angle-left" size={30} color={"black"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.navigate('HomeScreen') }}>
                    All Sections
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
        </>
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
        backgroundColor: 'white'
    },
    headerText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 20
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: 'white',
        paddingTop: 10
    },
    image: {
        borderRadius: 10,
        margin: 7,
        width: 100,
        height: 100
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
        color: 'black',
        fontWeight: 'bold'
    },
    flatListContainer: {
        width: width,
        paddingBottom: 50
    }
})

export default CategoriesScreen