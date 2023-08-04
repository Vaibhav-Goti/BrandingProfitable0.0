import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';

const FullScreenProfile = () => {
  const [profileData, setProfileData] = useState(null);

  const [businessOrPersonal, setBusinessOrPersonal] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl')
      setBusinessOrPersonal(businessOrPersonal)
    }

    fetchData();
  })

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
      const intervalId = setInterval(retrieveProfileData, 2000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(intervalId);
    }, []); // The empty dependency array ensures the effect runs only once on mount


  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {businessOrPersonal === 'business' ? (
          <FastImage source={profileData && profileData?.businessLogo ? ({ uri: profileData.businessLogo }) : ({ uri: 'https://www.freepik.com/free-photos-vectors/user' })} style={styles.profileImage} />
        ) : (
          <FastImage source={profileData && profileData?.profileImage ? ({ uri: profileData.profileImage }) : ({ uri: 'https://www.freepik.com/free-photos-vectors/user' })} style={styles.profileImage} />
        )}
        <Text style={styles.title}>{profileData.fullName}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Designation:</Text>
          <Text style={styles.info}>
            {businessOrPersonal === 'business'
              ? profileData.businessType
              : profileData.Designation}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{profileData.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Mobile Number:</Text>
          <Text style={styles.info}>{profileData.mobileNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.info}>{profileData.adress}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>
            {businessOrPersonal === 'business' ? 'Business Start Date:' : 'Date of Birth:'}
          </Text>
          <Text style={styles.info}>
            {businessOrPersonal === 'business'
              ? profileData.businessStartDate
              : profileData.dob}
          </Text>
        </View>
        {businessOrPersonal === 'business' && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Business Type:</Text>
            <Text style={styles.info}>{profileData.businessType}</Text>
          </View>
        )}
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
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
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default FullScreenProfile;
