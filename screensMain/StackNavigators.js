import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, StyleSheet } from 'react-native';

import CustomStack from '../custom/CustomStack';
import StackHome from '../Home/StackNavigatorHome';
import StackProfile from '../Profile/StackProfile';
// import MLMScreenStack from '../MLM/MlmScreenStack';
import StackMLM from '../MLM/StackMLM';
// import BusinessStack from '../Business/BusinessStack';
import FastImage from 'react-native-fast-image';
import StackBusiness from '../Business/StackBusiness';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    borderTopWidth: 0.5,
    elevation: 0,
    borderColor: 'black',
    height: 70,
    paddingTop: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Change this to the desired background color
    paddingHorizontal: 10
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 30,
    height: 35,
    backgroundColor: '#F5ACAE',
    marginTop: 10,
    alignSelf: 'center', // Align the active tab to the center
  },
  tabIcon: {
    height: 25,
    width: 25,
    marginTop: 10,
  },
  activeText: {
    color: '#FF0000',
    fontFamily: 'Poppins-Regular',
  },
});

const MyStack = () => {

  const [businessOrPersonal, setBusinessOrPersonal] = React.useState('');
  const fetchData = async () => {
    const businessOrPersonal = await AsyncStorage.getItem('BusinessOrPersonl');
    console.log('main screen ma set krelo business or personal - ', businessOrPersonal)
    setBusinessOrPersonal(businessOrPersonal);
  };

  React.useEffect(() => {
    fetchData()
  })

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabContainer,
      }}
    >
      <Tab.Screen name="StackHomeScreen" component={StackHome} options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 30, height: 35, backgroundColor: '#F5ACAE', marginTop: 10, }}>
                <FastImage source={require('../assets/Icons/home2.png')} style={{ height: 18, width: 18, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 4 }}>
                  {""}  Home
                </Text>
              </View>)
          } else {
            return <FastImage source={require('../assets/Icons/home.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
          }
        },
      }} />
      <Tab.Screen name="customstack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 30, height: 35, backgroundColor: '#F5ACAE', marginTop: 10 }}>
                <FastImage source={require('../assets/Icons/brush1.png')} style={{ height: 22, width: 22, marginLeft: 10 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', marginRight: 8, fontSize: 10, marginTop: 3 }}>
                  {" "}Custom
                </Text>
              </View>)
          } else {
            return <FastImage source={require('../assets/Icons/brush.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
          }
        },
      }} component={CustomStack} />
{/* 
      {businessOrPersonal == 'personal' ? (
        null
      ) : ( */}
        <Tab.Screen name="BusinessStack" options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 30, height: 35, backgroundColor: '#F5ACAE', marginTop: 10 }}>
                  <FastImage source={require('../assets/Icons/bag1.png')} style={{ height: 20, width: 20, marginLeft: 12 }} />
                  <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', marginRight: 6, fontSize: 10, marginTop: 3 }}>
                    {" "}Business
                  </Text>
                </View>)
            } else {
              return <FastImage source={require('../assets/Icons/bag.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
            }
          },
        }} component={StackBusiness} />
      {/* // )} */}

      <Tab.Screen name="StackProfileScreen" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 30, height: 35, backgroundColor: '#F5ACAE', marginTop: 10, }}>
                <FastImage source={require('../assets/Icons/user1.png')} style={{ height: 16, width: 16, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 3 }}>
                  {""} Profile
                </Text>
              </View>)
          } else {
            return <FastImage source={require('../assets/Icons/user.png')} style={{ height: 23, width: 23, marginTop: 10 }} />
          }
        },
      }} component={StackProfile} />

      <Tab.Screen name="MlmScreenStack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 30, height: 35, backgroundColor: '#F5ACAE', marginTop: 10 }}>
                <FastImage source={require('../assets/Icons/new.png')} style={{ height: 20, width: 20, }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Poppins-Regular', fontSize: 10, marginTop: 3 }}>
                  {""}  MLM

                </Text>
              </View>)
          } else {
            return <FastImage source={require('../assets/Icons/mlm.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
          }
        },
      }} component={StackMLM} />

    </Tab.Navigator>
  );
};

export default MyStack;
