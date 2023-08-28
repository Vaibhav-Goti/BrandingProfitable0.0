import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import data from '../apiData/CustomFrames';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const itemWidth = width / 2.3; // Adjust the number of columns as needed

const SavedFrames = ({ navigation }) => {

    const handleSelect = (item) => {
        navigation.navigate('CustomFrameForm', { 'itemId': item._id })
    }

    const renderItem = ({ item }) => {
        console.log('Rendering item:', item.image);
        return (
            <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => handleSelect(item)}
            >

                <View style={{ backgroundColor: 'white', borderRadius: 10, overflow: 'hidden' }}>
                    <FastImage source={{ uri: item.image }} style={styles.image} />
                </View>
            </TouchableOpacity>
        );
    };


    // data 

    const [data, setData] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/frame/frameimage');
            const result = response.data;
            console.log(result);
            setData(result.data); // Assuming 'data' property contains the array of images
        } catch (error) {
            console.log('Error fetching data... custom frams:', error);
        }
    };


    return (
        <>
            <LinearGradient
                colors={['#20AE5C', 'black']}
                style={styles.container}
                locations={[0.1, 1]}
            >
                <FlatList
                    data={data}
                    numColumns={2} // Adjust the number of columns as needed
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    shouldComponentUpdate={() => false}
                    removeClippedSubviews
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                />
            </LinearGradient>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    flatListContainer: {
        marginTop: 10,
        paddingTop: 20
    },
    imageContainer: {
        alignItems: 'center',
        margin: 7,
        borderColor: "white",
        borderWidth: 0.5,
        borderRadius: 10
    },
    image: {
        height: itemWidth,
        width: itemWidth,
    },
    name: {
        marginTop: 5,
        textAlign: 'center',
        color: 'white',
        borderTopWidth: 1
    },
    mainImage: {
        height: 300,
        width: 300,
        borderRadius: 10,
    },
    mainImageContainer: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    headerContainer: {
        height: 60,
        width: width,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        color: "white"
    },
    iconText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'DMSans_18pt-Bold'
    }
});

export default SavedFrames;
