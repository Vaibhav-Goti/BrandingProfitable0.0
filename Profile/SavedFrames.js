import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, Alert, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const SavedFrames = ({ navigation }) => {
  const [customFrames, setCustomFrames] = useState([]);
  const [item, setItem] = useState(customFrames.length > 0 ? customFrames[0].image : null);

  useEffect(() => {
    loadCustomFrames(); // Initial load
    const interval = setInterval(() => {
      loadCustomFrames();
    }, 3000); // Call loadCustomFrames() every 3 seconds

    return () => clearInterval(interval); // Cleanup function to clear the interval when the component unmounts
  }, []);

  const loadCustomFrames = async () => {
    try {
      const framesData = await AsyncStorage.getItem('customFrames');
      if (framesData) {
        const frames = JSON.parse(framesData);
        console.log(frames)
        setCustomFrames(frames);
      }
    } catch (error) {
      console.error('Error loading custom frames:', error);
    }
  };

  const handleImagePress = (image) => {
    setItem(image);
  };

  useEffect(() => {
    const saveCustomFrames = async () => {
      try {
        await AsyncStorage.setItem('customFrames', JSON.stringify(customFrames));
      } catch (error) {
        console.error('Error saving custom frames:', error);
      }
    };

    saveCustomFrames();
  }, [customFrames]);

  const [i, seti] = useState(true)

  if (customFrames && i) {
    setTimeout(() => {
      setLoader(false)
      setItem(customFrames[0]?.image);
      seti(false)
    }, 1000);
  }

  const handleImageLongPress = (item) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteImage(item) },
      ],
      { cancelable: true }
    );
  };

  const deleteImage = (item) => {
    const updatedFrames = customFrames.filter((frame) => frame.name !== item.name);
    setCustomFrames(updatedFrames);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => handleImagePress(item.image)}
      onLongPress={() => handleImageLongPress(item)}
    >
      <FastImage source={{ uri: item.image }} style={styles.image} />
    </TouchableOpacity>
  );

  const [loader, setLoader] = useState(true)

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={'black'} />
      </View>
    )
  }

  return (
    <>
      {customFrames.length == 0 ? (
        <View style={styles.container}>
          <Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
            No frames Found
          </Text>
        </View>
      ) : (
        <LinearGradient
          colors={['#20AE5C', 'black']}
          style={styles.container}
          locations={[0.1, 1]}
        >

          <View style={styles.mainImageContainer}>
            {item && <FastImage source={{ uri: item }} style={styles.mainImage} />}
          </View>
          <FlatList
            data={customFrames}
            numColumns={3} // Adjust the number of columns as needed
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContainer}
            shouldComponentUpdate={() => false}
            removeClippedSubviews
            initialNumToRender={30}
            maxToRenderPerBatch={30}
            windowSize={10}
          />
        </LinearGradient>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 20,
    backgroundColor: 'black'
  },
  flatListContainer: {
    marginTop: 30,
    paddingBottom:60
  },
  imageContainer: {
    alignItems: 'center',
    margin: 5,
  },
  image: {
    height: itemWidth,
    width: itemWidth,
    borderRadius: 10,
  },
  name: {
    marginTop: 5,
    textAlign: 'center',
  },
  mainImage: {
    height: 300,
    width: 300,
    borderRadius: 10,
  },
  mainImageContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15
  },
  headerContainer: {
    height: 50,
    width: '100%',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  iconContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 100
  }
});

export default SavedFrames;
