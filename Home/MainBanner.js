import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, Image, TouchableHighlight, ScrollView, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window')

const BannerComponent = ({ bannerData }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.bannerContainer}>
            <Swiper loop={true} index={0} showsPagination={true} autoplay={true} dot={<View style={{ backgroundColor: 'white', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />} activeDot={<View style={{ backgroundColor: '#FF0000', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: -10, }} />}>
                {bannerData.map((item, index) => (
                    <TouchableHighlight
                        key={item._id}
                        onPress={() => { Alert.alert('Main Banner') }}
                        style={[
                            styles.bannerItem,
                            { marginLeft: 15 }, // Apply different margin to the first item
                        ]}
                    >
                        <FastImage
                            source={{ uri: item.bannerImage }}
                            style={styles.bannerImage}
                        />
                    </TouchableHighlight>
                ))}
            </Swiper>
        </View>
    );
};

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/mainbanner/mainbanner';

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
                console.error('Error fetching data...:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return (
        <View>
            <BannerComponent bannerData={data} />
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: 200
    },
    bannerItem: {
        width: width - 30,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight: 15,
        overflow: 'hidden'
    },
    bannerImage: {
        width: '100%',
        height: 160,
    },
    bannerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyComponent;
