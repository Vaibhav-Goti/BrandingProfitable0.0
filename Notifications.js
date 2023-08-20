import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActionFromState } from '@react-navigation/native';

const Notifications = ({ navigation }) => {
    const [notificationCount, setNotificationCount] = useState(1)
    const [notifications, setNotifications] = useState([])

    const getNotificationCounts = async () => {
        try {
            const notificationsData = await AsyncStorage.getItem('notificationData');

            const parsedNotifications = JSON.parse(notificationsData || '[]'); // Parse the JSON data

            setNotifications(parsedNotifications?.notifications);
            setNotificationCount(parsedNotifications?.counts);
        } catch (error) {
            console.log('Error getting notification counts:', error);
        }
    }

    useEffect(() => {
        getNotificationCounts();
    }, []);

    // setInterval(() => {
    //     getNotificationCounts(); // Add parentheses to call the function
    // }, 5000);    

    const clearNoti = async () => {
        // try {
        //     await AsyncStorage.removeItem('notificationData');
        //     setNotifications([])
        //     console.log("cleared!")
        // } catch (e) {
        //     console.log(e)
        // }
    }

    const renderItem = ({ item }) => {

        const sentTime = item.sentTime;
        const formattedTime = new Date(sentTime).toLocaleString();

        return (
            <View style={{ padding: 20, backgroundColor: '#050505', margin: 20, marginTop: 10, marginBottom: 5, borderRadius: 10, flexDirection: 'row', elevation: 5 }}>
                <Text>
                    <MaterialCommunityIcons name="message-text" size={25} color={'white'} />
                </Text>
                <View style={{ marginLeft: 20, width: '100%' }}>
                    <Text style={{ color: 'white', fontFamily: 'Inter-Bold', fontSize: 17, marginBottom: 4 }}>
                        {item.notification?.title || 'Title'}
                    </Text>
                    <Text style={{ color: 'gray', fontFamily: 'Inter-Bold', fontSize: 13 }}>
                        {item.notification?.body || 'notification body'}
                    </Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: 'gray', fontFamily: 'Inter-Bold', fontSize: 10, }}>
                            {formattedTime || 'notification Time'}
                        </Text>
                    </View>
                </View>
            </View>
        )
    };

    const reversedNotifications = [...notifications].reverse();

    return (
        <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
            {/* header */}
            {/* header */}

            <View
                style={{
                    flexDirection: 'row',
                    height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                    <Text style={{ color: 'white', padding: 10 }} onPress={() => { navigation.goBack() }} >
                        <Icon name="angle-left" size={30} color={'white'} />
                    </Text>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 20,
                            fontFamily: 'Manrope-Bold',
                            marginLeft: 15,
                        }}>
                        {' '}
                        Notifications{' '}
                    </Text>
                </View>
                {/* <TouchableOpacity style={{ padding: 5 }} onPress={clearNoti}>
                    <Icon name="trash" size={22} color={'white'} />
                </TouchableOpacity> */}
            </View>
            
            {!notifications? (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'white',fontFamily:'Manrope-Bold'}}>
                        Notifications not Found!
                    </Text>
                </View>
            ) : (
            <FlatList
                data={reversedNotifications}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
            )}

        </LinearGradient>
    );
};

const styles = StyleSheet.create({});

export default Notifications;
