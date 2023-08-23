import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../Header';

const { width } = Dimensions.get('window');

const MlmUserInReview = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        retrieveProfileData();
    }, []);

    const retrieveProfileData = async () => {
        try {
            const dataString = await AsyncStorage.getItem('profileData');
            if (dataString) {
                const data = JSON.parse(dataString);
                setProfileData(data);
            }
        } catch (error) {
            console.error('Error retrieving profile data:', error);
        }
    };

    return (
        <LinearGradient colors={['black', '#000']} locations={[0.2, 1]} style={styles.container}>
            {/* Header */}
            <Header />

            <View style={styles.contentContainer}>
                <Image source={require('../assets/bubble-loader.gif')} style={styles.loaderImage} />
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>
                        Your Payment Request Is Under Review
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderImage: {
        height: width - 170,
        width: width - 140,
    },
    textContainer: {
        margin: 20,
        marginTop: -40,
        paddingHorizontal: 30,
    },
    titleText: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Manrope-Bold',
        textAlign: 'center',
    },
});

export default MlmUserInReview;
