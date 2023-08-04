import React, { useState, useEffect } from 'react';
import ViewShot from 'react-native-view-shot';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import data from '../apiData/CustomFrames';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const SavedFrames = ({ navigation, route }) => {

    const [item, setItem] = useState(data.length > 0 ? data[0].imageUrl : null);

    const [selectedImageData, setSelectedImageData] = useState([data.length > 0 ? data[0] : null])

    const handleSelect = () => {
        navigation.navigate('CustomFrameScreen', { "imageData": selectedImageData, })
    }

    const handleImagePress = (item) => {
        setItem(item.imageUrl);
        setSelectedImageData(item)
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => handleImagePress(item)}
        >
            <FastImage source={item.imageUrl} style={styles.image} />
            <Text style={styles.name}>{item.title}</Text>
        </TouchableOpacity>
    );

    // custome frame 2 
    

    return (

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.navigate('ProfileScreen') }}>
                        <Icon name="angle-left" size={32} color={"black"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSelect} style={styles.iconContainer}>
                        <Text style={styles.iconText} >
                            Select
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainImageContainer}>
                    {item && <FastImage source={item} style={styles.mainImage} />}
                </View>
                <FlatList
                    data={data}
                    numColumns={3} // Adjust the number of columns as needed
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    shouldComponentUpdate={() => false}
                    removeClippedSubviews
                    initialNumToRender={30}
                    maxToRenderPerBatch={30}
                    windowSize={10}
                />
            </View>
            


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContainer: {
        marginTop: 30,
    },
    imageContainer: {
        alignItems: 'center',
        margin: 5,
    },
    image: {
        height: itemWidth,
        width: itemWidth,
        borderRadius: 10,
    },
    name: {
        marginTop: 5,
        textAlign: 'center',
    },
    mainImage: {
        height: 300,
        width: 300,
        borderRadius: 10,
    },
    mainImageContainer: {
        borderWidth: 1,
        borderColor: 'black',
    },
    headerContainer: {
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 20
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    iconText: {
        color: 'black',
        fontSize: 18
    }
});

export default SavedFrames;
