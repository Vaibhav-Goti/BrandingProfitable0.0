import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Dimensions, Image, TouchableOpacity, ScrollView, StyleSheet, Linking     } from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window')

const BannerComponent = ({ bannerData }) => {
    return (
        <View style={styles.bannerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bannerData.map(item => (
                    <TouchableOpacity
                        key={item._id}
                        onPress={() => {
                            // Open the link in the browser when the image is clicked
                            Linking.openURL(item.advertiseLink);
                          }}
                        style={styles.bannerItem}>
                        <FastImage
                            source={{ uri: item.advertiseImage }}
                            style={styles.bannerImage}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/advertise_banner/advertise_banner';

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
                console.error('Error fetching data... ad banner:', error);
                setLoading(false);
            });
    }, []);

    // if (loading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }

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
    },
    bannerItem: {
        width: width-30,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight:15,
        marginLeft:15,
        overflow:'hidden'
    },
    bannerImage: {
        width: '100%',
        height: 150
    },
    bannerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyComponent;
