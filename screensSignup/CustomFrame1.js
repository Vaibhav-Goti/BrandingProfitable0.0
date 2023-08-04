import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, StyleSheet, Text, Image, ScrollView, TextInput, TouchableHighlight, TouchableOpacity, Dimensions, } from 'react-native';
// import { Input, Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ViewShot from 'react-native-view-shot';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window')

const CustomFrameForm = ({ navigation, route }) => {

  // {"adress": "Cgdtf", "businessLogo": "https://www.sparrowgroups.com/CDN/upload/188126670b8-ef3b-4337-8b03-d948abf9545c.jpg", "businessStartDate": "2023-07-09", "businessType": "Hfzufzx", "email": "mjcyufufuf", "fullName": "Bxfs", "mobileNumber": "3235353535", "password": "mj"}

  //  {"imageData": {"TopValueImage": 10, "id": 1, "imageUrl": 1, "leftValueCompany": 7, "leftValueNumber": 204, "leftValueimage": 10, "title": "Frame 1", "topValueCompany": 243, "topValueNumber": 3}, "requestData": {"adress": "Jhiihx", "businessLogo": "https://www.sparrowgroups.com/CDN/upload/833cd9a5d57-d497-4937-9e0c-0971d0d9685a.jpg", "businessStartDate": "2023-07-16", "businessType": "Xigxig", "email": "nvihcihc", "fullName": "Fte", "mobileNumber": "8490803632", "password": "ll"}}

  // fetch data using route

  const datafromRoute = route.params.requestData;

  const imageData = route.params

  const [imgPosition, setimgPosition] = useState({
    "top": imageData.imageData.TopValueImage,
    "left": imageData.imageData.leftValueimage
  })

  const imageUrl = imageData.imageData.imageUrl

  const phonePosition = {
    top: imageData.imageData.topValueNumber,
    left: imageData.imageData.leftValueNumber
  }

  const namePosition = {
    top: imageData.imageData.topValueCompany,
    left: imageData.imageData.leftValueCompany
  }

  // -----------------------------------------------------------------

  useEffect(() => {
    // Function to be executed after 0.5 seconds
    const delayedFunction = () => {
      setCompanyName(datafromRoute.fullName);
      setPhoneNumber(datafromRoute.mobileNumber);
      setFileUri(datafromRoute.businessLogo);
    };

    // Delay execution of the function
    const timeoutId = setTimeout(delayedFunction, 500);

    // Clean up the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []); // Empty array as the second argument to run the effect only once


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
  const [fileUri, setFileUri] = useState(null);

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
    Alert.alert("Your frame saved!")
    navigation.navigate('LoginScreen');
  };

  return (
    <ScrollView>
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'space-between', minHeight: height }}>
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
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, }}>
          <View style={{ borderWidth: 1, borderColor: 'white', borderRadius: 10, overflow: 'hidden', backgroundColor: 'white', }}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
              <FastImage source={imageUrl} />
              <FastImage source={{ uri: fileUri }} style={{
                height: 60,
                width: 60,
                position: 'absolute',
                top: imgPosition.top,
                left: imgPosition.left,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: 'black'
              }} />
              <View style={{ width: 153, position: 'absolute', top: namePosition.top, left: namePosition.left, height: 23, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[styles.companyName, { fontSize: 17, color: 'white' }]}>{companyName}</Text>
              </View>
              <View style={{ width: 100, position: 'absolute', top: phonePosition.top, left: phonePosition.left, height: 20, alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={[styles.companyName, { fontSize: 14 }]}>{phoneNumber}</Text>
              </View>
            </ViewShot>
          </View>
        </View>
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, gap: 20 }}>
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
        <Button title="Save" type="outline" onPress={handleSaveToLocal} />
      </View> */}
        <View style={styles.mainContainer}>
          <ScrollView style={{ width: '100%', maxHeight: 350 }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={[styles.inputContainer, { justifyContent: 'space-between', flexDirection: 'row', marginBottom: 10, marginTop: 50 }]}>
                <View>
                  {renderFileUri()}
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View>
                    <TouchableOpacity onPress={() => {
                      setimgPosition({
                        ...imgPosition,
                        top: imgPosition.top - 3
                      });
                    }} style={{ padding: 2, paddingHorizontal: 8 }}>
                      <Icon name="angle-up" size={22} color={"black"} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', width: 100, justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => {
                      setimgPosition({
                        ...imgPosition,
                        left: imgPosition.left - 3
                      });
                    }} style={{ padding: 2, paddingHorizontal: 8 }}>
                      <Icon name="angle-left" size={22} color={"black"} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                      setimgPosition({
                        ...imgPosition,
                        left: imgPosition.left + 3
                      });
                    }} style={{ padding: 2, paddingHorizontal: 8 }}>
                      <Icon name="angle-right" size={22} color={"black"} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => {
                      setimgPosition({
                        ...imgPosition,
                        top: imgPosition.top + 3
                      });
                    }} style={{ padding: 2, paddingHorizontal: 8 }}>
                      <Icon name="angle-down" size={22} color={"black"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label={businessOrPersonal === 'personal' ? 'Name' : 'Company Name'}
                  placeholder={businessOrPersonal === 'personal' ? 'Enter your name' : 'Enter your company name'}
                  style={styles.input}
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
              <TouchableHighlight onPress={handleSaveToLocal} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "70%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5, marginBottom: 50 }} >
                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                  Sign Up
                </Text>
              </TouchableHighlight>
            </View>

          </ScrollView>
        </View>
      </ LinearGradient >
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
    width: 90,
    height: 90,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnParentSection: {
    gap: 10,
  },
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
  },
  mainContainer: {
    height: 350,
    width: width,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333',
    fontFamily: 'Manrope-Regular',
  },
  inputContainer: {
    width: '70%',
    marginTop: 20,
  },
});

export default CustomFrameForm;
