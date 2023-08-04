import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

const API_ENDPOINT = 'https://branding-profitable-de8df13d081b.herokuapp.com/search/';

const { width, height } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const SearchScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([])

  const fetchData = async () => {
    if (!text) {
      Alert.alert('Please enter the variable to send it.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://branding-profitable-de8df13d081b.herokuapp.com/search/${text}`);
      const result = response.data; // Axios automatically parses JSON responses, no need for extra parsing here
      setData(result)
      const categories = result.filter((item) => item.isCategory == true)
      setCategories(categories)
      const items = result.filter((item) => item.isCategory == false && item.isVideo == false)
      setItems(items)
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate('EditItemSearch', {categoryName:  item.categoryName || item.trendingAndNews_CategoryName || item.cds_categoryName || item.ds_category || item.businessTypeName})
      }}>
        <FastImage source={{ uri: item.image }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <>

      <ScrollView style={{ backgroundColor: 'white', flex: 1, height: '100%' }}>
        <View style={styles.bannerHeader}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
              <Text style={styles.bannerHeaderText} >
                <Icon name="angle-left" size={32} color={"black"} />
              </Text>
            </TouchableOpacity>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Search"
              style={{ fontSize: 18, width: '75%' }}
              onSubmitEditing={fetchData}
            />
          </View>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.bannerHeaderText}>
              <Icon name="search" size={20} color={"black"} />
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          // Show ActivityIndicator while loading data
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white', height: height - 10 }} >
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
            <Text style={{ fontSize: 18, color: 'black', marginBottom: 10, paddingHorizontal: 5 }}>Categories</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {categories.map((category) => (
                <CustomItem key={category._id} item={category} />
              ))}
            </View>
          </View>
        ) : null}

        {items.length > 0 && !loading ? (
          <View style={{ paddingHorizontal: 10, paddingVertical: 20, paddingTop: 0 }}>
            <Text style={{ fontSize: 18, color: 'black', marginBottom: 10, paddingHorizontal: 5 }}>Posts</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {items.map((post) => (
                <CustomItem key={post._id} item={post} />
              ))}
            </View>
          </View>
        ) : null}
        {items.length === 0 && categories.length == 0 && !loading ?
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: 70, height: height - 80 }}>
            <FastImage style={{ width: 150, height: 150 }} source={require('../assets/search.png')} />
          </View>
          : null}
      </ScrollView>
    </>
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
    color: 'black',
    fontWeight: 'bold',
    margin: 15
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
  }
});

export default SearchScreen;
