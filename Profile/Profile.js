import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Avatar, Text, Button, Image } from 'react-native';
// import { Avatar, Text, Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image';

const ProfileScreen = ({ navigation }) => {
  // get business or profile 
  const [businessOrPersonal, setBusinessOrPersonal] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl')
      setBusinessOrPersonal(businessOrPersonal)
    }

    fetchData();
  })

  if (businessOrPersonal === 'personal') {

    const [profileData, setProfileData] = useState(null);


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

    useEffect(() => {
      // Call the retrieveProfileData function initially when the component mounts
      retrieveProfileData();

      // Set up an interval to call retrieveProfileData every 3 seconds
      const intervalId = setInterval(retrieveProfileData, 3000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, []); // The empty dependency array ensures the effect runs only once on mount


    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Profile
          </Text>
          <Text style={styles.headerText} onPress={() => { navigation.navigate('editprofile') }}>
            <Icon name="user-edit" size={20} />
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => { navigation.navigate('fullScreenProfile') }}>
            <Avatar
              size="xlarge"
              rounded
              source={profileData && profileData?.profileImage ? ({ uri: profileData.profileImage }) : ({ uri: 'https://www.freepik.com/free-photos-vectors/user' })}
            />
          </TouchableOpacity>
          <Text h4 style={styles.username}>
            {profileData?.fullName || 'John Doe'}
          </Text>
          <Text style={styles.bio}>
            {profileData?.Designation || 'Designation'}
          </Text>
          <Button
            title="Custom Frame"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={() => {
              navigation.navigate('CustomFrames');
            }}
          />
          <Button
            title="Saved Frame"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={() => {
              navigation.navigate('SavedFrameScreen');
            }}
          />
          <Button
            title="Logout"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={async () => {
              navigation.navigate('StackLogin');
              await AsyncStorage.removeItem('isLoggedIn');
            }}
          />
        </View>
      </>

    );
  } else {

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

      <>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Profile
          </Text>
          <Text style={styles.headerText} onPress={() => { navigation.navigate('editprofile') }}>
            <Icon name="user-edit" size={20} />
          </Text>
        </View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => { navigation.navigate('fullScreenProfile') }}>
            <FastImage
              style={{ height: 130, width: 130, borderRadius: 100 }}
              rounded
              source={profileData && profileData?.businessLogo ? ({ uri: profileData.businessLogo }) : ({ uri: 'https://www.freepik.com/free-photos-vectors/user' })}
            />
          </TouchableOpacity>
          <Text h4 style={styles.username}>
            {profileData?.fullName || 'John Doe'}
          </Text>
          <Text style={styles.bio}>
            {profileData?.businessType || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan consequat leo, eu sollicitudin eros molestie et.'}
          </Text>
          <Button
            title="Custom Frame"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={() => {
              navigation.navigate('CustomFrames');
            }}
          />
          <Button
            title="Saved Frame"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={() => {
              navigation.navigate('SavedFrameScreen');
            }}
          />
          <Button
            title="Logout"
            buttonStyle={styles.editButton}
            titleStyle={styles.editButtonText}
            onPress={async () => {
              navigation.navigate('StackLogin');
              await AsyncStorage.removeItem('isLoggedIn');
            }}
          />
        </View>
      </>
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white'
  },
  username: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  bio: {
    textAlign: 'center',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 10
  },
  editButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  }
});

export default ProfileScreen;
