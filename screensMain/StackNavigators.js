import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';

import CustomStack from '../custom/CustomStack';
import StackHome from '../Home/StackNavigatorHome';
import StackProfile from '../Profile/StackProfile';
import MLMScreenStack from '../MLM/MlmScreenStack';
import BusinessStack from '../business/BusinessStack';
import FastImage from 'react-native-fast-image';

const Tab = createBottomTabNavigator();

const MyStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { position: 'absolute', paddingBottom: 12, borderTopWidth: 0.5, elevation: 0, borderColor: 'black', height: 60, paddingTop: 9 }
      }}
    >
      <Tab.Screen name="StackHomeScreen" component={StackHome} options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <>
                <FastImage source={require('../assets/Icons/home2.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Manrope-Regular', }}>
                  Home
                </Text>
              </>)
          } else {
            return <FastImage source={require('../assets/Icons/home.png')} style={{ height: 25, width: 25 }} />
          }
        },
      }} />
      <Tab.Screen name="customstack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <>
                <FastImage source={require('../assets/Icons/brush1.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Manrope-Regular', }}>
                  Custom
                </Text>
              </>)
          } else {
            return <FastImage source={require('../assets/Icons/brush.png')} style={{ height: 25, width: 25 }} />
          }
        },
      }} component={CustomStack} />
      <Tab.Screen name="MlmScreenStack" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <>
                <FastImage source={require('../assets/Icons/new.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Manrope-Regular', }}>
                  MLM
                </Text>
              </>)
          } else {
            return <FastImage source={require('../assets/Icons/mlm.png')} style={{ height: 25, width: 25 }} />
          }
        },
      }} component={MLMScreenStack} />
      <Tab.Screen name="StackProfileScreen" options={{
        headerShown: false,
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <>
                <FastImage source={require('../assets/Icons/user1.png')} style={{ height: 25, width: 25, marginTop: 10 }} />
                <Text style={{ color: '#FF0000', fontFamily: 'Manrope-Regular', }}>
                  Profile
                </Text>
              </>)
          } else {
            return <FastImage source={require('../assets/Icons/user.png')} style={{ height: 25, width: 25 }} />
          }
        },
      }} component={StackProfile} />
    </Tab.Navigator>
  );
};

export default MyStack;
