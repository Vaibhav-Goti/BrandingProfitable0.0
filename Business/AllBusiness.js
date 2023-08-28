import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width * 0.4;
const itemMargin = width * 0.03;

const AllBusiness = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://b-p-k-2984aa492088.herokuapp.com/business_type/business_type');
      const result = response.data.data;
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.log('Error fetching data...all business:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderImageItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item.businessTypeImage }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.businessTypeName}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleImagePress = (item) => {
    navigation.navigate('BusinessScreen', { 'businessFromAll': item.businessTypeName })
  };

  if (loading) {
    return (
      <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="red" />
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", height: 40, width: '100%', paddingHorizontal: 15, justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: 30, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              <Icon name="angle-left" size={35} color={"white"} />
            </Text>
          </TouchableOpacity>

          <TextInput
            style={{ color: 'white', fontSize: 18, fontFamily: 'Manrope-Bold', textAlign:'center' }}
            placeholder="Search Business     "
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              const filtered = data.filter((item) =>
                item.businessTypeName.toLowerCase().includes(text.toLowerCase())
              );
              setFilteredData(filtered);
            }}
            placeholderTextColor={'gray'}
          />

          <View style={{ width: 20 }}>
          </View>
        </View>



        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={renderImageItem}
          numColumns={Math.floor(width / (itemWidth + itemMargin * 2))}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  flatListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: itemMargin + 3,
    marginVertical: itemMargin,
    width: itemWidth,
    overflow: 'hidden',
    elevation: 3
  },
  image: {
    width: itemWidth,
    height: itemWidth - 10,
    borderRadius: 10,
  },
  textContainer: {
    margin: 5,
    paddingHorizontal: 10,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Manrope-Regular'
  },
});

export default AllBusiness;
