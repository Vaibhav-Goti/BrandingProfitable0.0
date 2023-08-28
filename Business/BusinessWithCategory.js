import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const BusinessWithCategory = ({route,navigation}) => {
    const [data, setData] = useState([]);

    const { MyBusiness, businessFromAll } = route.params;

    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/my_business/my_business/${businessFromAll||MyBusiness}`);
            const result = response.data.data;
            setData(result);
        } catch (error) {
            console.log('Error fetching data... business with category:', error);
        }
        setLoading(false)
    };

    useEffect(() => {
        fetchData();
    }, []);

    // reload screen 

    const reloadScreen = () => {
        fetchData();
      };
    
      useEffect(() => {
        // Add a listener to the focus event to reload the screen
        const unsubscribe = navigation.addListener('focus', reloadScreen);
    
        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      }, [navigation]);

      if (loading) {
        return (
          <LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="red" />
          </LinearGradient>
        )
      }

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {data.map((item) => (
            <View key={item.businessCategoryName} style={styles.BannerItem}>
              <View>
                <View style={styles.bannerHeader}>
                  <Text style={styles.bannerHeaderText}>
                    {item.businessCategoryName}
                  </Text>
                  <TouchableOpacity onPress={() => handleImagePress(item)}>
                    <Text style={[styles.bannerHeaderText,{width:30,height:30,textAlign:'right',}]}>
                      <Icon name="angle-right" size={32} color={"white"} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imageScrollView}
                >
                  {item.items.map((imageItem, index) => (
                    <TouchableOpacity
                      key={index.toString()}
                      onPress={() => handleImagePress(item, index)}
                    >
                      <FastImage
                        source={{ uri: imageItem.myBusinessImageOrVideo }}
                        style={[styles.image, { marginLeft: index === 0 ? 15 : 0 }]}
                        onLoadEnd={() => Image.prefetch(imageItem.myBusinessImageOrVideo)}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          ))}
        </ScrollView >
      </View >
    );
}

const styles = StyleSheet.create({
    headerContainer: {
      height: 50,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 20
    },
    headerText: {
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
      marginLeft: 20
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: "center",
      paddingTop: 10
    },
    image: {
      borderRadius: 10,
      margin: 7,
      width: 120,
      height: 120,
      marginHorizontal:12,
      borderWidth:1,
      borderColor:'white'
    },
    BannerItem: {
      marginBottom: 10,
      width: '100%'
    },
    bannerHeader: {
      height: 45,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingRight: 20,
      paddingLeft: 20
    },
    bannerHeaderText: {
      fontSize: 18,
      color: 'white',
      fontFamily:'Manrope-Bold'
    },
    flatListContainer: {
      width: width,
      paddingBottom: 50
    },
    scrollViewContainer: {
      paddingBottom: 50,
    },
    imageScrollView: {
      flexDirection: 'row',
    },
  });

export default BusinessWithCategory;
