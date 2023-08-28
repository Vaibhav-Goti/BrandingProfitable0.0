import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView, TouchableHighlight } from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import Feather from 'react-native-vector-icons/Feather'

const API_ENDPOINT = 'https://b-p-k-2984aa492088.herokuapp.com/search/';

const { width, height } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const SearchScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([])
  const [videos, setVideos] = useState([])

  const fetchData = async () => {
    if (!text) {
      Alert.alert('Please enter the variable to send it.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/search/${text}`);
      const result = response.data; // Axios automatically parses JSON responses, no need for extra parsing here
      setData(result)
      const categories = result.filter((item) => item.isCategory == true)
      setCategories(categories)
      const items = result.filter((item) => item.isCategory == false && item.isVideo == false)
      const videos = result.filter((item) => item.isCategory == false && item.isVideo == true)
      setItems(items)
      setVideos(videos)
    } catch (error) {
      console.log('Error fetching data... search screen:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate('EditItemSearch', { categoryName: item.categoryName || item.trendingAndNews_CategoryName || item.cds_categoryName || item.ds_category || item.businessTypeName, isVideo: false })
      }}>
        <FastImage source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  const CustomItemV = ({ item, isPlaying, togglePlay }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('EditItemSearch', {
            categoryName:
              item.categoryName ||
              item.trendingAndNews_CategoryName ||
              item.cds_categoryName ||
              item.ds_category ||
              item.businessTypeName,

            isVideo: true
          });
        }}
      >
        <FastImage
          source={{ uri: item.image }}
          style={[styles.image, { display: !isPlaying ? 'flex' : 'none' }]}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.playPauseButton}>
          <Icon name={'play-circle'} size={30} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);

  const togglePlay = useCallback((index) => {
    setCurrentPlayingIndex(index === currentPlayingIndex ? -1 : index);
  }, [setCurrentPlayingIndex, currentPlayingIndex])

  const [isImages, setIsImages] = useState(true)

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>

      <ScrollView style={{ flex: 1, height: '100%', }}>


        <View style={styles.bannerHeader}>
          <View style={{ flexDirection: 'row', alignItems: "center" }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
              <Text style={{ width: 40, textAlign: 'center' }} >
                <Icon name="angle-left" size={32} color={"white"} />
              </Text>
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: 18, color: 'white', paddingVertical: 10, paddingHorizontal: 5, fontFamily: 'Manrope-Bold' }}>Back</Text>
            </View>
          </View>
          {/* <TouchableOpacity onPress={fetchData}>
            <Text style={styles.bannerHeaderText}>
              <Feather name="search" size={20} color={"white"} />
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>

          <View style={styles.searchContainer}>
            <Text style={[styles.searchText]}>
              <Feather name="search" size={32} />
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Search"
              onSubmitEditing={fetchData}
              style={[styles.searchText, { fontSize: 17, fontFamily: 'Inter-Med', width: '100%' }]}
              placeholderTextColor={'lightgray'}
            />
          </View>
        </View>
        <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'flex-start',flex:1,width:'92%', gap:10, marginBottom:10}}>
          {/* 1 */}
          <TouchableOpacity onPress={()=>{
            setIsImages(true)
          }} style={{height:30,width:80,backgroundColor:isImages?'red':'white',alignItems:'center',justifyContent:'center',borderRadius:20}}>
            <Text style={{color:isImages?'white':'gray',fontFamily:'Manrope-Regular'}}>
              Images
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            setIsImages(false)
          }} style={{height:30,width:80,backgroundColor:!isImages?'red':'white',alignItems:'center',justifyContent:'center',borderRadius:20}}>
            <Text style={{color:!isImages?'white':'gray',fontFamily:'Manrope-Regular'}}>
              Videos
            </Text>
          </TouchableOpacity>
          {/* 2 */}
        </View>

        {loading ? (
          // Show ActivityIndicator while loading data
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, height: height - 10 }} >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {/* <FastImage
                source={require('../assets/Branding.gif')}
                style={styles.gif}
                resizeMode={FastImage.resizeMode.contain}
              /> */}
              <ActivityIndicator />
            </View>
          </View>
        ) : null}

        {categories.length > 0 && !loading ? (
          <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingTop: 0 }}>
            <Text style={{ fontSize: 18, color: 'white', marginBottom: 10, paddingHorizontal: 5, fontFamily: 'Manrope-Bold' }}>Categories</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {categories.map((category) => (
                <CustomItem key={category._id} item={category} />
              ))}
            </View>
          </View>
        ) : null}

        {isImages?(
          items.length > 0 && !loading ? (
            <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingTop: 0 }}>
              <Text style={{ fontSize: 18, color: 'white', marginBottom: 10, paddingHorizontal: 5, fontFamily: 'Manrope-Bold' }}>Posts</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {items.map((post) => (
                  <CustomItem key={post._id} item={post} />
                ))}
              </View>
            </View>
          ) : null
        ):(
          videos.length > 0 && !loading ? (
            <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingTop: 0 }}>
              <Text style={{ fontSize: 18, color: 'white', marginBottom: 10, paddingHorizontal: 5, fontFamily: 'Manrope-Bold' }}>Videos</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {videos.map((post, index) => (
                  // <CustomItemV key={post._id} item={post} />
                  <CustomItemV
                    key={index}
                    item={post}
                    isPlaying={index === currentPlayingIndex}
                    togglePlay={() => togglePlay(index)}
                  />
                ))}
              </View>
            </View>
          ) : null
        )}

        {items.length === 0 && categories.length == 0 && !loading ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: 70, height: height - 80 }}>
            <FastImage style={{ width: 150, height: 150 }} source={require('../assets/search.png')} />
          </View>
          : null}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bannerHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  bannerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    margin: 15,
    fontFamily: 'Manrope-Bold'
  },
  image: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray'
  },
  gif: {
    height: 50,
    width: 50
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingHorizontal: 13,
    paddingVertical: 2,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '85%',
    elevation: 5,
    backgroundColor: 'white'
  },
  searchText: {
    marginRight: 3,
    color: 'black'
  },
  playPauseButton: {
    position: 'absolute',
    top: '40%',
    left: '40%'
  }
});

export default SearchScreen;
