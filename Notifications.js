import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch notifications data from AsyncStorage when the component mounts
    AsyncStorage.getItem('notificationData').then(data => {
      if (data) {
        const notificationData = JSON.parse(data);
        // Set the notifications data in the component state
        setNotifications(notificationData.notifications.reverse());
      }
    });
  }, []);

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
    );
  };

  return (
    <LinearGradient colors={['#050505', '#1A2A3D']} locations={[0, 0.4]} style={{ flex: 1 }}>
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
      </View>

      {notifications.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Manrope-Bold' }}>
            Notifications not Found!
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{paddingBottom:20}}
        />
      )}
    </LinearGradient>
  );
};

export default Notifications;
