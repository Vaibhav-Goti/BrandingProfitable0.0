import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from 'react-native-vector-icons/Octicons';
import axios from 'axios';
import Header from '../Header';
const { width } = Dimensions.get('window');
const itemWidth = width / 3.5; // Adjust the number of columns as needed

const BusinessScreen = ({ navigation, route }) => {
	const { businessFromAll } = route.params ?? '';
	const MyBusiness = 'Information & Technology';
	const [userBusiness, setUserBusiness] = useState('');
	const [profileData, setProfileData] = useState(null);
	const [businessOrPersonal, setBusinessOrPersonal] = useState('');
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	console.log(userBusiness)

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

	const retrieveProfileData = async () => {
		setLoading(true)
		try {
			const dataString = await AsyncStorage.getItem('profileData');
			if (dataString) {
				const data = JSON.parse(dataString);
				setProfileData(data);
				setUserBusiness(data.Designation || data.businessType)
			}
		} catch (error) {
			console.error('Error retrieving profile data:', error);
		}
		setTimeout(() => {
			setLoading(false)
		}, 1000);
	};
	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await axios.get(`https://b-p-k-2984aa492088.herokuapp.com/my_business/my_business/${businessFromAll || userBusiness || MyBusiness}`);
			console.log(`https://b-p-k-2984aa492088.herokuapp.com/my_business/my_business/${businessFromAll || userBusiness || MyBusiness}`)
			const result = response.data.data;
			setData(result);
		} catch (error) {
			console.log('Error fetching data....:', error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (businessFromAll || userBusiness) {
			retrieveProfileData();
			fetchData()
		}
	}, [businessFromAll, businessOrPersonal]);

	if (loading) {
		return (
			<LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="red" />
			</LinearGradient>
		);
	}

	const handleImagePress = (item, index) => {
		navigation.navigate('EditBusiness', {
			items: item.items,
			bannername: item.businessCategoryName,
			index: index ? index : ''
		});
	};

	return (
		<LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>

			<Header />

			<View style={{ paddingHorizontal: 15, paddingTop: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
				<View style={{ borderRadius: 30, paddingHorizontal: 20, justifyContent: 'center', backgroundColor: 'red', height: 30, }}>
					<Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
						{businessFromAll || userBusiness || MyBusiness}
					</Text>
				</View>
				<TouchableOpacity onPress={() => { navigation.navigate('AllBusiness') }} style={{ borderRadius: 40, backgroundColor: 'red', width: 40, height: 30, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ color: 'white' }}>
						<Octicons name="pencil" size={20} color={'white'} />
					</Text>
				</TouchableOpacity>
			</View>
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
										<Text style={[styles.bannerHeaderText, { width: 30, height: 30, textAlign: 'right', }]}>
											{/* <Icon name="angle-right" size={32} color={"white"} /> */}
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
		</LinearGradient>
	)
}

export default BusinessScreen

const styles = StyleSheet.create({
	headerContainer: {
		height: 65,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingHorizontal: 20,
		backgroundColor: 'white',
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		elevation: 5
	},
	headerText: {
		fontSize: 20,
		color: 'black',
		fontWeight: 'bold'
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
		marginHorizontal: 12,
		borderWidth: 1,
		borderColor: 'white'
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
		fontFamily: 'Manrope-Bold'
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
