import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, BackHandler, Alert, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import MainBanner from './MainBanner';
import AdBanner from './AdBanner';
import TrendingBanner from './Category/TrendingBanner';
import TodayBanner from './Category/Today';
import DynamicSection from './DynamicSection';
import FastImage from 'react-native-fast-image';

const Home = ({ navigation }) => {

  const [businessOrPersonal, setBusinessOrPersonal] = useState('');
  const fetchData = async () => {
    const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
    setBusinessOrPersonal(businessOrPersonal);
  };

  useEffect(() => {

    fetchData();
  }, []);

  const reloadScreen = () => {
    // Your refresh logic goes here
    retrieveProfileData()
  };

  useEffect(() => {
    // Add a listener to the focus event to reload the screen
    const unsubscribe = navigation.addListener('focus', reloadScreen);

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

  const handleImagePress = (item) => {
    navigation.navigate('EditHomeScreen', { item: item });
  };

  // getting data for name

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
    } finally {
      setLoading(false); // Mark data retrieval as completed (whether successful or not)
    }
  };

  const [loading, setLoading] = useState(true);

  const renderProfileDetails = () => {
    if (loading) {
      // Show a loading indicator or return null while data is being retrieved
      return null;
    }

    if (profileData) {
      // Show the profile details if available
      return (
        <>
          <Text style={styles.buisnessTitle}>
            {profileData.fullName} <Icon name="angle-down" size={25} />
          </Text>
        </>
      );
    }

    // Show a default value or placeholder if profileData is null (data not available)
    return (
      <>
        <Text style={styles.buisnessTitle}>
          John Doe <Icon name="angle-down" size={25} />
        </Text>
      </>
    );
  };

  return (
    <View
      style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <View style={{ backgroundColor: 'red', borderRadius: 100, borderWidth: 1, borderColor: 'black', height: 45, width: 45, overflow: 'hidden' }}>
            <FastImage source={{ uri: profileData?.businessLogo || profileData?.profileImage }} style={{ height: 45, width: 45 }} />
          </View>
          <TouchableOpacity>
          <Text style={styles.yourBuisness}>
            {businessOrPersonal ? 'Business' : 'Profile'}
          </Text>
          {/* Render the profile details conditionally */}
          {renderProfileDetails()}
        </TouchableOpacity>
        </View>
        <View>
          <Text onPress={()=>{navigation.navigate('Notifications')}}>
            <Icon name="bell" size={27} color={'#FF0000'} />
          </Text>
        </View>
      </View>

      <LinearGradient
        colors={['#050505', '#1A2A3D']} style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, height: '100%', width: '100%', marginBottom: 50, paddingTop: 10, }}>
          <TouchableOpacity style={styles.searchContainer} onPress={() => { navigation.navigate('SearchScreen') }}>
            <Text style={[styles.searchText]}>
              <Icon name="search" size={25} />
            </Text>
            <Text style={[styles.searchText, { fontSize: 16, fontFamily: 'Manrope-Regular' }]}>
              Search
            </Text>
          </TouchableOpacity>

          <MainBanner />

          <AdBanner />

          <TodayBanner />

          <TrendingBanner />

          <DynamicSection />
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  buisnessTitle: {
    fontSize: 19,
    color: 'black',
    fontFamily: 'Manrope-Bold'
  },
  yourBuisness: {
    fontSize: 12,
    fontFamily: 'Manrope-Regular'
  },
  image: {
    height: 160,
    width: 330,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15
  },
  containerFlatList: {
    marginBottom: 15
  },
  headerContainer: {
    height: 65,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  headerText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 20
  },
  searchText: {
    marginRight: 10
  }
});

export default Home;
