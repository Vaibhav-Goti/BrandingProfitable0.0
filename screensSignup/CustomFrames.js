import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import data from '../apiData/CustomFrames';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');
const itemWidth = width / 2.3; // Adjust the number of columns as needed

const SavedFrames = ({ navigation, route }) => {

    const requestData = route.params;

    const handleSelect = (item) => {
        navigation.navigate('CustomFrameForm', { 'imageData': item, 'requestData': requestData })
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => handleSelect(item)}
        >
            <View style={{ backgroundColor: 'white', borderRadius: 10, overflow: "hidden" }}>
                <FastImage source={item.imageUrl} style={styles.image} />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <LinearGradient
                colors={['#050505', '#1A2A3D']}
                style={styles.container}
            >
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={() => { navigation.goBack() }}>
                        <Icon name="angle-left" size={32} color={"white"} />
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText} >
                            Business Frames
                        </Text>
                    </View>
                    <View>

                    </View>
                </View>
                <FlatList
                    data={data}
                    numColumns={2} // Adjust the number of columns as needed
                    keyExtractor={(item) => item.id.toString()}
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
        fontFamily:'DMSans_18pt-Bold'
    }
});

export default SavedFrames;
