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
import { useFocusEffect } from '@react-navigation/native';

const BusinessScreen = ({ navigation, route }) => {
	const { businessFromAll } = route.params ?? '';
	const MyBusiness = 'Information & Technology';
	const [userBusiness, setUserBusiness] = useState('');
	const [profileData, setProfileData] = useState(null);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);

	const retrieveProfileData = async () => {
		try {
			const dataString = await AsyncStorage.getItem('profileData');
			if (dataString) {
				const data = JSON.parse(dataString);
				setProfileData(data);
				setUserBusiness(data.Designation || data.businessType);
			}
		} catch (error) {
			console.error('Error retrieving profile data:', error);
		}
	};

	const fetchData = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`https://b-p-k-2984aa492088.herokuapp.com/my_business/my_business`
			);
			const result = response.data.data;
			setData(result);
		} catch (error) {
			console.log('Error fetching data.... business screen:', error);
		}
		setLoading(false);
	};


	const elements = [
		{ name: "aaa", value: 1 },
		{ name: "bbb", value: 2 },
		{ name: "ccc", value: 3 },
		{ name: "jjj", value: 4 },
		{ name: "ddd", value: 5 },
	];

	// const firstElementIndex = data.findIndex(element => element.businessTypeName === "Education");

	// const elementsCopy = data.slice(firstElementIndex); // Create a copy of the data array

	// console.log(elementsCopy)

	// elementsCopy.splice(0, firstElementIndex); // Remove the element with the businessTypeName "jjj" from the copy

	// data.unshift(elementsCopy[0]); // Insert the element with the businessTypeName "jjj" at the beginning of the original array

	const businessCopy = data.filter((name) => (name.businessTypeName == userBusiness))
	// console.log(businessCopy[0].items,"aksdfjlfkajsdlfdjklasjdfklfjl")

	const filteredData = data.filter((name)=>(name.businessTypeName!=userBusiness))

	const handleImagePress = (item, index) => {
		navigation.navigate('EditBusiness', {
			items: item.items,
			bannername: item.businessTypeName,
			index: index ? index : '',
		});
	};

	//  this is my modified arrays of business which user choose the business 



	// Use useFocusEffect to fetch data when the screen is focused
	useFocusEffect(
		React.useCallback(() => {
			retrieveProfileData();
			fetchData();
		}, [businessFromAll, userBusiness])
	);

	if (loading) {
		return (
			<LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="red" />
			</LinearGradient>
		);
	}

	return (
		<LinearGradient colors={['#050505', '#1A2A3D']} style={{ flex: 1, marginBottom: 50 }}>

			<Header />

			<View style={{ paddingHorizontal: 15, paddingTop: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
				<View style={{ borderRadius: 30, paddingHorizontal: 20, justifyContent: 'center', backgroundColor: 'red', height: 30, }}>
					<Text style={{ color: 'white', fontFamily: 'Manrope-Regular' }}>
						{userBusiness}
					</Text>
				</View>
				{/* <TouchableOpacity onPress={() => { navigation.navigate('AllBusiness') }} style={{ borderRadius: 40, backgroundColor: 'red', width: 40, height: 30, alignItems: 'center', justifyContent: 'center' }}>
					<Text style={{ color: 'white' }}>
						<Octicons name="pencil" size={20} color={'white'} />
					</Text>
				</TouchableOpacity> */}
			</View>
			<View style={styles.container}>
				<ScrollView contentContainerStyle={styles.scrollViewContainer}>

					{businessCopy.length!=0?(
						<View key={businessCopy?.businessTypeName} style={styles.BannerItem}>
						<View>
							<View style={styles.bannerHeader}>
								<Text style={styles.bannerHeaderText}>
									{businessCopy[0]?.businessTypeName}
								</Text>
								<TouchableOpacity onPress={() => handleImagePress(businessCopy)}>
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
								{businessCopy[0]?.items?.map((imageItem, index) => (
									<TouchableOpacity
										key={index.toString()}
										onPress={() => handleImagePress(businessCopy, index)}
									>
										<FastImage
											source={{ uri: imageItem.imageUrl }}
											style={[styles.image, { marginLeft: index === 0 ? 15 : 0 }]}
											onLoadEnd={() => Image.prefetch(imageItem.imageUrl)}
										/>
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>
					</View>

					):(null)}

					
					
					{filteredData.map((item) => (
						<View key={item.businessTypeName} style={styles.BannerItem}>
							<View>
								<View style={styles.bannerHeader}>
									<Text style={styles.bannerHeaderText}>
										{item.businessTypeName}
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
												source={{ uri: imageItem.imageUrl }}
												style={[styles.image, { marginLeft: index === 0 ? 15 : 0 }]}
												onLoadEnd={() => Image.prefetch(imageItem.imageUrl)}
											/>
										</TouchableOpacity>
									))}
								</ScrollView>
							</View>
						</View>
					))}

					{/* anohter all business data */}

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
