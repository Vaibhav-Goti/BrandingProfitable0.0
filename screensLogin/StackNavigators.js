import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './Login';
// import BuisnessOrPersonal from './BuisnessOrPersonal';
import OTP from './OTP';

import SignUpStack from '../screensSignup/StackSignup';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator initialRouteName='LoginScreen'>
      {/* <Stack.Screen name="BuisnessOrPersonal" component={BuisnessOrPersonal} options={{ headerShown: false, animation: 'slide_from_right', }} /> */}
      <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false, animation: 'slide_from_right', }} />
      <Stack.Screen name="SignUpStack" options={{ headerShown: false, animation: 'slide_from_right', }} component={SignUpStack} />
      <Stack.Screen name="OTP" options={{ headerShown: false, animation: 'slide_from_right', }} component={OTP} />
    </Stack.Navigator>
  );
};

export default MyStack;