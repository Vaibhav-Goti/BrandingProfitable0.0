import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TextInput, Text, TouchableOpacity, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
// import { Button } from '@rneui/base';
// import StackHome from '../Home/StackNavigatorHome';

const FullScreenProfile = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [businessOrPersonal, setBusinessOrPersonal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
      setBusinessOrPersonal(businessOrPersonal);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const retrieveProfileData = async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          setProfileData(JSON.parse(data));
        }
      } catch (error) {
        console.log('Error retrieving profile data:', error);
      }
    };

    retrieveProfileData();
  }, []);

  if (!profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderTextInput = (label, value, onChangeText) => (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.info}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#999"
      />
    </View>
  );

  const onUpdate = async () => {
    try {
      const response = await axios.put(`https://branding-profitable-de8df13d081b.herokuapp.com/user/user_register/${profileData._id}`, profileData);
      const stringData = JSON.stringify(profileData)
      AsyncStorage.setItem('profileData', stringData)
      Alert.alert('Your Profile Updated!')
      navigation.navigate('ProfileScreen')
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Something went Wrong!',
        'Please try again Later...',
        [
          { 'text': 'ok' }
        ],
        { cancelable: false }
      )
    }

  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => { navigation.navigate('ProfileScreen') }}>
          <Icon name="angle-left" size={30} color={"black"} />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.navigate('ProfileScreen') }}>
          Edit Profile
        </Text>
      </View>
      <View style={styles.profileContainer}>
        {businessOrPersonal === 'business' ? (
          <FastImage
            source={
              profileData && profileData?.businessLogo
                ? { uri: profileData.businessLogo }
                : { uri: 'https://www.freepik.com/free-photos-vectors/user' }
            }
            style={styles.profileImage}
          />
        ) : (
          <FastImage
            source={
              profileData && profileData?.profileImage
                ? { uri: profileData.profileImage }
                : { uri: 'https://www.freepik.com/free-photos-vectors/user' }
            }
            style={styles.profileImage}
          />
        )}
        <TextInput
          style={styles.title}
          value={profileData.fullName}
          onChangeText={(text) => setProfileData({ ...profileData, fullName: text })}
          placeholder="Enter Full Name"
          placeholderTextColor="#999"
        />
        {renderTextInput(
          'Designation',
          businessOrPersonal === 'business' ? profileData.businessType : profileData.Designation,
          (text) =>
            setProfileData({
              ...profileData,
              ...(businessOrPersonal === 'business'
                ? { businessType: text }
                : { Designation: text }),
            })
        )}
        {renderTextInput('Email', profileData.email, (text) => setProfileData({ ...profileData, email: text }))}
        {renderTextInput('Mobile Number', profileData.mobileNumber.toString(), (text) =>
          setProfileData({ ...profileData, mobileNumber: text })
        )}
        {renderTextInput('Address', profileData.adress, (text) => setProfileData({ ...profileData, adress: text }))}
        {renderTextInput(
          businessOrPersonal === 'business' ? 'Business Start Date' : 'Date of Birth',
          businessOrPersonal === 'business' ? profileData.businessStartDate : profileData.dob,
          (text) =>
            setProfileData({
              ...profileData,
              ...(businessOrPersonal === 'business'
                ? { businessStartDate: text }
                : { dob: text }),
            })
        )}
        {businessOrPersonal === 'business' && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Business Type:</Text>
            <TextInput
              style={styles.info}
              value={profileData.businessType}
              onChangeText={(text) => setProfileData({ ...profileData, businessType: text })}
              placeholder="Enter Business Type"
              placeholderTextColor="#999"
            />
          </View>
        )}
        <View style={{ marginTop: 30 }}>
          <Button title='Update Profile' type='outline' onPress={onUpdate} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white'
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginRight: 8,
    width: 120,
  },
  info: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 20
  }
});

export default FullScreenProfile;
