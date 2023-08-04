
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const TodayBanner = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
        return formattedDate;
    };

    const BannerComponent = ({ bannerData }) => {
        const navigation = useNavigation();
        return (
            <View style={styles.bannerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {bannerData.map((item, index) => (
                        <TouchableOpacity
                            key={item._id}
                            onPress={() => { navigation.navigate('category') }}
                            style={[
                                styles.bannerItem,
                                { marginLeft: index === 0 ? 15 : 0 }, // Apply different margin to the first item
                            ]}
                        >
                            <FastImage
                                source={{ uri: item.image }}
                                style={styles.bannerImage}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#1E1E1E', paddingHorizontal: 10, bottom: 7, borderRadius: 30, alignItems: 'center', paddingVertical: 3 }}>
                                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Regular' }}>
                                    {formatDate(item.imageDate)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };
    useEffect(() => {
        // Define the URL for the GET request
        const apiUrl = 'https://branding-profitable-de8df13d081b.herokuapp.com/today/today_category';

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
                console.error('Error fetching data:', error);
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
        data &&
        <View>
            <View style={styles.bannerHeader}>
                <Text style={styles.bannerHeaderText}>
                    Today & Tommorrow
                </Text>
                <Text style={styles.bannerHeaderText} onPress={() => { navigation.navigate('category', { categories: data }) }}>
                    <Icon name="angle-right" size={32} color={"white"} />
                </Text>
            </View>
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
        width: 120,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 13,
        alignItems: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: 120,
    },
    bannerName: {
        fontSize: 11,
        fontWeight: 'bold',
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
        fontSize: 17,
        color: 'white',
        fontFamily: 'Manrope-Bold',
        marginBottom: 10,
        marginTop: 5
    }
});

export default TodayBanner;
