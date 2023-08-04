import { View, Text, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef, useState, useEffect } from 'react';
import ViewShot from 'react-native-view-shot';
import FastImage from 'react-native-fast-image';

const CustomFrame2 = ({ route, navigation }) => {
    const { userData } = route.params;
    const imageData = route.params

    const imageUrl = imageData.userData.imageData.imageData.imageUrl;

    const imgPosition = {
        "top": imageData.userData.imageData.imageData.TopValueImage,
        "left": imageData.userData.imageData.imageData.leftValueimage
    }

    const { companyName, phoneNumber, fileUri } = userData;
    const viewShotRef = useRef(null);

    const [customFrames, setCustomFrames] = useState([]);

    useEffect(() => {
        loadCustomFrames();
    }, []);

    const loadCustomFrames = async () => {
        try {
            const framesData = await AsyncStorage.getItem('customFrames');
            if (framesData) {
                const frames = JSON.parse(framesData);
                setCustomFrames(frames);
            }
        } catch (error) {
            console.error('Error loading custom frames:', error);
        }
    };

    const saveCustomFrame = async (uri) => {
        try {
            const framesData = await AsyncStorage.getItem('customFrames');
            let frames = framesData ? JSON.parse(framesData) : [];
            const frame = { name: `frame${frames.length + 1}`, image: uri };
            frames.push(frame);
            await AsyncStorage.setItem('customFrames', JSON.stringify(frames));
            setCustomFrames(frames);
            Alert.alert('Saved!');
        } catch (error) {
            console.error('Error saving custom frame:', error);
        }
    };

    const handleSaveToLocal = async () => {
        try {
            const uri = await viewShotRef.current.capture();
            await saveCustomFrame(uri);
        } catch (error) {
            console.error('Error saving image to local storage:', error);
        }
        navigation.navigate('SavedFrameScreen');
    };

    const [topValueCompany, setTopValueCompany] = useState(imageData.userData.imageData.imageData.topValueCompany)
    const [leftValueCompany, setLeftValueCompany] = useState(imageData.userData.imageData.imageData.leftValueCompany)
    const [fontSizeCompany, setfontSizeCompany] = useState(15)

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{borderWidth:1}}>

            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                <FastImage source={imageUrl} />
                <FastImage source={{ uri: fileUri }} style={{
                    height: 60,
                    width: 60,
                    position: 'absolute',
                    top: imgPosition.top,
                    left: imgPosition.left,
                    borderRadius: 50,
                }} />
                <View style={{ width: 153, position: 'absolute', top: topValueCompany, left: leftValueCompany, height: 23, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[styles.companyName, { fontSize: fontSizeCompany }]}>{companyName}</Text>
                </View>
                <View style={{ width: 100, position: 'absolute', top: topValueNumber, left: leftValueNumber, fontSize: fontSizeNumber, height: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text style={[styles.companyName, { fontSize: fontSizeNumber }]}>{phoneNumber}</Text>
                </View>
            </ViewShot>
            </View>
            <Button
                title="Save Frame"
                buttonStyle={styles.editButton}
                titleStyle={styles.editButtonText}
                onPress={handleSaveToLocal}
            />
        </View>
    );
};


const styles = {
    companyName: {
        fontWeight: 'bold',
        color: 'black',
    },
    phoneNumber: {
        color: 'black',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        margin: 10,
        marginBottom: 0
    },
    listText: {
        fontSize: 16,
        marginRight: 10
    },
    icon: {
        fontSize: 20,
    },
};



export default CustomFrame2;
