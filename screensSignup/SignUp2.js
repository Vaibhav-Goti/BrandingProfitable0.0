import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, Text, Alert, ScrollView, Dimensions, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window')
const SignUp2Screen = ({ navigation, route }) => {

  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [designation, setDesignation] = useState('');
  const [fileUri, setFileUri] = useState('');
  const [dob, setDob] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [loader, setloader] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [businessOrPersonal, setBusinessOrPersonal] = useState('')
  const { fullName, phone, password } = route.params;
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ]);
  const [imageLoader, setImageLoader] = useState(false)

  // business or personal 

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl')
      setBusinessOrPersonal(businessOrPersonal)
    }

    fetchData();
  })


  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateChange = (_, date) => {
    hideDatePicker();
    if (date) {
      setSelectedDate(date);
      setDob(date.toISOString().split('T')[0]);
    }
  };

  const handleSave = async () => {

    if (!fileUri) {
      Alert.alert("Please Add Image")
      return null;
    }

    setloader(true)
    if (email == "" && address == "" && designation == "" && fileUri == "" && dob == "") {
      Alert.alert('Please Enter All Details!')
    } else {


      const apiUrl = 'https://branding-profitable-de8df13d081b.herokuapp.com/user/user_register';

      const requestData = businessOrPersonal === 'personal'
        ? {
          profileImage: fileUri,
          Designation: designation,
          gender: gender,
          dob: dob,
          mobileNumber: phone,
          fullName: fullName,
          email: email,
          adress: address,
          password: password,
        }
        : {
          businessLogo: fileUri,
          businessType: designation,
          businessStartDate: dob,
          mobileNumber: phone,
          fullName: fullName,
          email: email,
          adress: address,
          password: password
        };

      try {
        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.statusCode === 200) {

          Alert.alert(
            'Signup Success!',
            "Let's Create Some Awesome Frames...",
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('CustomScreen', requestData),
              },
            ],
            { cancelable: false }
          );

        } else if (response.data.statusCode === 402) {
          Alert.alert("Mobile Number is Already used!")
          navigation.navigate('SignupScreen')
        } else if (response.data.statusCode === 401) {
          Alert.alert("Email Address is Already used!")
        } else {
          Alert.alert('Error! please try again...');
        }
      } catch (error) {
        Alert.alert("Sign Up Failed!")
        console.log(error)
      }
    }

    setloader(false)
  };

  const renderFileUri = () => {
    if (fileUri) {
      return <FastImage source={{ uri: fileUri }} style={{height:100,width:100}} />;
    } else {
      return (
        <View style={styles.logoContainer}>
          <Text style={{ color: "white", fontFamily: 'Poppins-Bold', fontSize: 13 }}>
            {imageLoader?(
              <ActivityIndicator color={"red"} />
            ):(businessOrPersonal == 'business' ? "LOGO" : "PROFILE")}
          </Text>
        </View>
      )
    }
  };

  // generate link for photo 

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      includeBase64: true, // Optional, set it to true if you want to get the image as base64-encoded string
    })
      .then((response) => {
        setImageLoader(true);
        const dataArray = new FormData();
        dataArray.append('b_video', {
          uri: response.path,
          type: response.mime,
          name: response.path.split('/').pop(),
        });

        let url = 'https://www.sparrowgroups.com/CDN/image_upload.php/';
        axios
          .post(url, dataArray, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            setImageLoader(false)
            const imagePath = res?.data?.iamge_path; // Correct the key to "iamge_path"
            console.log(imagePath)
            setFileUri(imagePath);
          })
          .catch((err) => {
            setImageLoader(false)
            setFileUri(response.path)
            console.log('Error uploading image:', err);
          });
      })
      .catch((error) => {
        setImageLoader(false)
        
        console.log('ImagePicker Error:', error);
      });
  };

  return (
    <>
      {loader ? (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      ) : (
        // <View style={styles.container}>
        //   <Text style={styles.title}>Add Details</Text>
        //   <View style={styles.body}>
        //     {!imageLoader ? (
        //       <View style={styles.ImageSections}>{renderFileUri()}</View>
        //     ) : (
        //       <View style={[styles.images, { justifyContent: 'center', alignItems: 'center' }]}>
        //         <ActivityIndicator color="white" />
        //       </View>
        //     )}
        //     <TouchableOpacity style={styles.btnParentSection} onPress={handleImagePicker}>
        //       <Text>Choose Photo</Text>
        //     </TouchableOpacity>
        //   </View>
        //   <View style={styles.inputContainer}>
        //     <TextInput
        //       style={styles.input}
        //       placeholder="Email"
        //       value={email}
        //       onChangeText={setEmail}
        //       autoCapitalize="none"
        //     />
        //     <TextInput
        //       style={styles.input}
        //       placeholder="Address"
        //       value={address}
        //       onChangeText={setAddress}
        //       autoCapitalize="sentences"
        //     />
        //     <TextInput
        //       style={styles.input}
        //       placeholder={businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
        //       value={designation}
        //       onChangeText={setDesignation}
        //       autoCapitalize="words"
        //     />
        //     <TouchableOpacity onPress={showDatePicker}>
        //       <TextInput
        //         style={styles.input}
        //         placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
        //         value={dob}
        //         editable={false}
        //       />
        //     </TouchableOpacity>
        //     {isDatePickerVisible && (
        //       <DateTimePicker
        //         value={selectedDate}
        //         mode="date"
        //         display="default"
        //         onChange={handleDateChange}
        //       />
        //     )}
        //     {businessOrPersonal == 'personal' ? (
        //       <View style={styles.dropdownContainer}>
        //         <DropDownPicker
        //           open={open}
        //           value={gender}
        //           items={items}
        //           setOpen={setOpen}
        //           setValue={setGender}
        //           style={{ borderColor: 'lightgray' }}
        //           textStyle={styles.dropdownText}
        //           placeholder="Select Gender"
        //           placeholderStyle={{ color: 'gray' }}
        //         />
        //       </View>
        //     ) : null}

        //   </View>
        //   <Text style={styles.signupText} onPress={() => navigation.goBack()}>
        //     I don't have an account
        //   </Text>
        //   <Button title="Next" buttonStyle={styles.loginButton} onPress={handleSave} />
        // </View>
        <LinearGradient
          colors={['#050505', '#1A2A3D']}
          style={styles.container}>
          <TouchableOpacity style={{ padding: 20, alignSelf: 'flex-start', paddingBottom: 0 }} onPress={() => { navigation.goBack() }}>
            <Text style={{ color: 'white' }}>
              <Icon name="angle-left" size={34} />
            </Text>
          </TouchableOpacity>

          <View style={{ alignItems: 'center' }}>
            <TouchableHighlight style={styles.logoContainer} onPress={handleImagePicker}>
              {renderFileUri()}
            </TouchableHighlight>
            {/* <View style={styles.textContainer}>
              <Text style={[styles.text, { color: '#FF0000' }]} >
                  Branding
                  <Text style={styles.text}>
                      {" Profitable"}
                  </Text>
              </Text>
          </View> */}
            <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
              <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
                Profile Photo - {businessOrPersonal == 'personal' ? "DP" : "LOGO"}
              </Text>
            </View>
          </View>
          <ScrollView style={styles.mainContainer}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {/* email */}
              <View style={[styles.labelContainer, { marginTop: 40 }]}>
                <Text style={styles.label}>
                  Enter Email
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>
              {/* address */}
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Enter Address
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  autoCapitalize="sentences"
                />
              </View>
              {/* designation */}
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Enter {businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={businessOrPersonal == 'business' ? ('Business Type') : ('Designation')}
                  value={designation}
                  onChangeText={setDesignation}
                  autoCapitalize="words"
                />
              </View>
              {/* DOB */}
              <View style={styles.labelContainer}>
                <Text style={styles.label}>
                  Enter {businessOrPersonal === 'business' ? ('Buisness Start Date') : ('Date of Birth')}
                </Text>
              </View>
              {isDatePickerVisible && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <View style={styles.inputContainer}>
                <TouchableOpacity onPress={showDatePicker}>
                  <TextInput
                    style={styles.input}
                    placeholder={businessOrPersonal == 'business' ? ('Business Start Date') : ("Date of Birth")}
                    value={dob}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
              <TouchableHighlight onPress={handleSave} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "70%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5 }} >
                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                  Sign Up
                </Text>
              </TouchableHighlight>
              <TouchableOpacity onPress={() => { navigation.navigate('LoginScreen') }} style={{ padding: 5, marginTop: 0, marginBottom: 40 }}>
                <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 14, textDecorationLine: 'underline' }}>
                  I have an Account
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </LinearGradient>
      )}

    </>
  );
};

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
    fontSize: 16
  },
  logoContainer: {
    height: 100,
    width: 100,
    backgroundColor: '#9FA2A6',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: "hidden"
  },
  image: {
    width: 60,
    height: 60
  },
  textContainer: {
    paddingVertical: 10
  },
  mainContainer: {
    maxHeight: 500,
    width: width,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 30,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
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
  labelContainer: {
    width: '70%',
    alignItems: 'flex-start'
  },
  label: {
    color: '#6B7285',
    fontFamily: 'Manrope-Regular',
    fontSize: 15
  }

});

export default SignUp2Screen;
