import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, Text, Alert, ActivityIndicator, Dimensions, TouchableHighlight, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
// import data from '../apiData/imagesBanner';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';


const { width, height } = Dimensions.get('window')

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  const [businessOrPersonal, setBusinessOrPersonal] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
      setBusinessOrPersonal(businessOrPersonal);
    };

    fetchData();
  }, []); // Add [] as a second argument to execute this effect only once


  const handleLogin = async () => {
    setIsLoader(true);

    if (phone === "" || password === "") {
      Alert.alert("Please enter all details");
      setIsLoader(false);
    } else {
      const apiUrl = 'https://b-p-k-2984aa492088.herokuapp.com/user/user_login';

      const requestData = {
        mobileNumber: phone,
        password: password,
      };

      try {
        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.data.statusCode === 200) {
          Alert.alert("Login Successfully...");
          navigation.navigate('StackMain');
          const dataAfterDecode = jwtDecode(response.data.token)
          const saveProfiledatatoLocal = JSON.stringify(dataAfterDecode);


          if (saveProfiledatatoLocal.Designation) {
            await AsyncStorage.setItem('BusinessOrPersonl', 'personal')
          } else {
            await AsyncStorage.setItem('BusinessOrPersonl', 'business')
          }
          try {
            await AsyncStorage.setItem("isLoggedIn", "true");
            await AsyncStorage.setItem("profileData", saveProfiledatatoLocal);
            await AsyncStorage.setItem("userToken", response.data.token);
          } catch (error) {
            console.log('Error saving profile data:', error);
          }
        } else {
          Alert.alert("User Not Exist!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoader(false);
      }
      setPhone('')
      setPassword('')
    }
  };

  if (isLoader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  // firebase otp

  return (
    <ScrollView style={{}} keyboardShouldPersistTaps={'always'} >

      <LinearGradient
        colors={['#050505', '#1A2A3D']}>
        <TouchableOpacity style={{ padding: 20, alignSelf: 'flex-start', paddingBottom: height / 14 }} onPress={() => { navigation.goBack() }}>
          {/* <Text style={{ color: 'white' }}>
              <Icon name="angle-left" size={34} />
            </Text> */}
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <FastImage source={require('../assets/B_Profitable_Logo.png')} style={styles.image} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.text, { color: '#FF0000' }]} >
              Branding
              <Text style={styles.text}>
                {" Profitable"}
              </Text>
            </Text>
          </View>
          <View style={{ width: 250, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <Text style={[styles.text, { fontFamily: 'Poppins-Regular', fontSize: 15, textAlign: 'center' }]}>
              Say hello to your new desining partner app
            </Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <ScrollView style={{ height: '100%', width: '100%' }} keyboardShouldPersistTaps={'always'}>
            <View style={{ alignItems: 'center', marginTop: 70, }}>

              <View style={{ width: '70%', alignItems: 'flex-start' }}>
                <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 15 }}>
                  Enter Mobile
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'gray'}
                  placeholder="e.g: 8460833632"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ width: '70%', alignItems: 'flex-start' }}>
                <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 15 }}>
                  Enter Password
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'gray'}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <TouchableHighlight onPress={handleLogin} style={{ backgroundColor: '#FF0000', borderRadius: 8, margin: 15, width: "70%", height: 50, alignItems: 'center', justifyContent: 'center', elevation: 5 }} >
                <Text style={{ color: 'white', fontFamily: 'DMSans_18pt-Bold', fontSize: 15, }}>
                  Login
                </Text>
              </TouchableHighlight>
              <TouchableOpacity onPress={() => { navigation.push('SignUpStack') }} style={{ padding: 5, marginTop: 0 }}>
                <Text style={{ color: '#6B7285', fontFamily: 'Manrope-Regular', fontSize: 14, textDecorationLine: 'underline' }}>
                  Create an Account
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </LinearGradient>


    </ScrollView>
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
  mainContainer: {
    height: 450,
    width: width,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center'
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

});

export default LoginScreen;
