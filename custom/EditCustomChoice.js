import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5;

const EditHome = ({ route, navigation }) => {
  const { bannername, items, index } = route.params;

  const [item, setItem] = useState(items[index] || items[0]);

  console.log(item.cds_id)

  const handleImagePress = (item) => {
    setItem(item);
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <FastImage source={{ uri: item.imageUrl }} style={styles.image} />
    </TouchableOpacity>
  ), []);

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={{ width: 15 }} onPress={() => { navigation.goBack() }}>
          <Icon name="angle-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText} onPress={() => { navigation.goBack() }}>
          {bannername}
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.mainImage} />
        <TouchableOpacity
        onPress={()=>{navigation.navigate('EditTempFromCustom', {'imageId':item.cds_id})}} 
        style={{width:'100%',justifyContent:'center',alignItems:'center',backgroundColor:'white',height:30,borderTopWidth:0.3}}>
          <Text style={{color:'black',fontFamily:'Manrope-Regular'}}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        numColumns={3}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        windowSize={10}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1A2A3D',
  },
  imageContainer: {
    height: width-10 ,
    width: width - 40,
    marginTop: 20,
    marginBottom: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius:10,
    overflow: 'hidden',
  },
  mainImage: {
    height: width - 40,
    width: width - 40,
  },
  image: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  flatListContainer: {
    paddingTop: 10,
  },
  headerContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    fontFamily: 'Manrope-Bold',
  },
});

export default EditHome;
