import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import Video from 'react-native-video'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5;

const CategoriesScreen = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);   

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/trending_section/trendingandnews_item';

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
                console.error('Error fetching data... trending screen:', error)
                setLoading(false);
            });

    }, []);

    const [data, setData] = useState([])

    // render images
    // onPress={() => { navigation.navigate('EditHomeScreen', { 'bannername': item.categoryName }) }} 

    // imageItem.isVideo

    const renderItem = useCallback(({ item }) => {

        return(
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
                data={item.items.slice(0,10)}
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
                        <View style={{position:'absolute',top:45,left:index == 0 ? 55 : 40,zIndex:1, display:imageItem.isVideo?'flex':'none'}}>
                            <Icon name="play-circle" size={30} color={"white"} />
                        </View>
                        <FastImage
                            source={{ uri: imageItem.todayAndTomorrowImageOrVideo }}
                            style={[styles.image, { marginLeft: index == 0 ? 15 : 0 }]}
                            onLoadEnd={() => Image.prefetch(imageItem.todayAndTomorrowImageOrVideo)}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    )}, [navigation]);

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ width: 40, alignItems: 'center' }} onPress={() => { navigation.navigate('HomeScreen') }}>
                    <Icon name="angle-left" size={30} color={"white"} />
                </TouchableOpacity>
                <Text style={styles.headerText} onPress={() => { navigation.navigate('HomeScreen') }}>
                    Trending
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

const styles = StyleSheet.create({
    headerContainer: {
        height: 50,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginLeft: 10
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
        color: 'white',
        fontFamily: 'Manrope-Bold'
    },
    flatListContainer: {
        width: width,
        paddingBottom: 50
    }
})

export default CategoriesScreen