import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import ReactCurvedText from "react-curved-text";

const SplashScreen = () => {
    return (
        <LinearGradient
            colors={['#050505', '#1A2A3D']}
            style={styles.container}>
            <View>

            </View>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.logoContainer}>
                    <FastImage source={require('./assets/B_Profitable_Logo.png')} style={styles.image} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: '#FF0000' }]} >
                        Branding
                        <Text style={styles.text}>
                            {" Profitable"}
                        </Text>
                    </Text>
                </View>
            </View>
            <View style={styles.belowTextContainer}>
                <Text style={styles.belowText}>
                    From
                </Text>
                <View>
                    <Image style={{ height: 40, width: 100 }} source={require('./assets/kuberLOGO.png')} />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontFamily: 'Poppins-Bold',
        fontSize: 18
    },
    logoContainer: {
        height: 108,
        width: 108,
        backgroundColor: '#9FA2A6',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 70,
        height: 78
    },
    textContainer: {
        paddingVertical: 10
    },
    belowText: {
        color: 'white',
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        marginTop: 20
    },
    belowTextContainer: {
        justifySelf: 'flex-end',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }

})

export default SplashScreen;
