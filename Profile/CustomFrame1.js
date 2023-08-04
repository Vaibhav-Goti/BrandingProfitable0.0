import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, StyleSheet, Text, Image, ScrollView, TextInput, Button } from 'react-native';
import ViewShot from 'react-native-view-shot';
// import { Input, Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';

const CustomFrameForm = ({ navigation, route }) => {
  const [businessOrPersonal, setBusinessOrPersonal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
      setBusinessOrPersonal(businessOrPersonal);
    };

    fetchData();
  }, []);

  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fileUri, setFileUri] = useState('');

  const renderFileUri = () => {
    if (fileUri) {
      return <FastImage source={{ uri: fileUri }} style={styles.images} />;
    } else {
      if (businessOrPersonal === 'personal') {
        return (
          <FastImage
            source={require('../assets/BlankProfile.jpg')}
            style={styles.images}
          />
        );
      } else {
        return (
          <FastImage
            source={require('../assets/BlankLogo.png')}
            style={styles.images}
          />
        );
      }
    }
  };
  const renderFileUriInCanvas = () => {
    if (fileUri) {
      return <FastImage source={{ uri: fileUri }} style={{ height: 60, width: 60, borderRadius: 100, borderColor: 'black', borderWidth: 0.5 }} />;
    } else {
      if (businessOrPersonal === 'personal') {
        return (
          <FastImage
            source={require('../assets/BlankProfile.jpg')}
            style={{ height: 60, width: 60, borderRadius: 100, borderColor: 'black', borderWidth: 0.5 }}
          />
        );
      } else {
        return (
          <FastImage
            source={require('../assets/BlankLogo.png')}
            style={{ height: 60, width: 60, borderRadius: 100, borderColor: 'black', borderWidth: 0.5 }}
          />
        );
      }
    }
  };

  const handleAlertFilePicker = () => {
    ImageCropPicker.openPicker({
      width: 800,
      height: 800,
      cropping: true,
      mediaType: 'photo',
    })
      .then(response => {
        if (!response.cancelled) {
          setFileUri(response.path);
        }
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const data = {
    companyName,
    phoneNumber,
    fileUri,
    imageData: route.params,
  };

  const handleSave = () => {
    if (companyName === '' || phoneNumber === '' || fileUri === null) {
      Alert.alert('Please Fill all Details');
    } else {
      navigation.navigate('CustomFrameScreen2', { userData: data });
    }
  };

  // fetch profile data

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Function to be executed after 0.5 seconds
    const delayedFunction = async () => {
      try {
        const dataString = await AsyncStorage.getItem('profileData');
        if (dataString) {
          const data = JSON.parse(dataString);
          setProfileData(data);
          if (businessOrPersonal === 'business') {
            setFileUri(data.businessLogo);
          } else {
            setFileUri(data.profileImage);
          }
          setCompanyName(data.fullName);

          setPhoneNumber(data.mobileNumber.toString());
        }
      } catch (error) {
        console.error('Error retrieving profile data:', error);
      }
    };

    const timeoutId = setTimeout(delayedFunction, 500);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty array as the second argument to run the effect only once

  // custom frame 2

  const imageUrl = data.imageData.imageData.imageUrl;

  const companyTextColor = data.imageData.imageData.companyTextColor;

  const imgPosition = {
    "top": data.imageData.imageData.TopValueImage,
    "left": data.imageData.imageData.leftValueimage
  }

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

  const [topValueCompany, setTopValueCompany] = useState(data.imageData.imageData.topValueCompany)
  const [topValueNumber, setTopValueNumber] = useState(data.imageData.imageData.topValueNumber)
  const [leftValueCompany, setLeftValueCompany] = useState(data.imageData.imageData.leftValueCompany)
  const [leftValueNumber, setLeftValueNumber] = useState(data.imageData.imageData.leftValueNumber)
  const [fontSizeCompany, setfontSizeCompany] = useState(17)
  const [fontSizeNumber, setfontSizeNumber] = useState(14)

  return (
    <ScrollView>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
        <View style={{ borderWidth: 1 }}>

          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
            <Image source={imageUrl} />

            <View style={{
              height: 60,
              width: 60,
              position: 'absolute',
              top: imgPosition.top,
              left: imgPosition.left,
              borderRadius: 50,
            }}>
              {renderFileUriInCanvas()}
            </View>
            <View style={{ width: 153, position: 'absolute', top: topValueCompany, left: leftValueCompany, height: 23, alignItems: 'center', justifyContent: 'center', }}>
              <Text style={[styles.companyName, { fontSize: fontSizeCompany, color: companyTextColor ? 'white' : 'black' }]}>{companyName}</Text>
            </View>
            <View style={{ width: 100, position: 'absolute', top: topValueNumber, left: leftValueNumber, fontSize: fontSizeNumber, height: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={[styles.companyName, { fontSize: fontSizeNumber }]}>{phoneNumber}</Text>
            </View>
          </ViewShot>
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10, gap: 20 }}>
        <View style={styles.body}>
          <View style={styles.ImageSections}>
            <View>{renderFileUri()}</View>
          </View>

          <View style={styles.btnParentSection}>
            <Button title="Select Image" type="outline" onPress={handleAlertFilePicker} />
          </View>
        </View>
        <View style={{ width: '100%' }}>
          <TextInput
            label={businessOrPersonal === 'personal' ? 'Name' : 'Company Name'}
            placeholder={businessOrPersonal === 'personal' ? 'Enter your name' : 'Enter your company name'}
            value={companyName}
            onChangeText={setCompanyName}
          />
          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
        <Button title="Save Frame" type="outline" onPress={handleSaveToLocal} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '93%',
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  images: {
    width: 100,
    height: 100,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnParentSection: {
    gap: 10,
  },
});

export default CustomFrameForm;
