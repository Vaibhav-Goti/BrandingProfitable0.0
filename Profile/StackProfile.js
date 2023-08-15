import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './Profile';
import CustomFrame from './CustomFrame1';
import SavedFrames from './SavedFrames';
import CustomFrames from './CustomFrames';
import fullScreenProfile from './fullScreenProfile';
import CustomFrame2 from './CustomFrame2';
import EditProfile from './EditProfile';

const Stack = createNativeStackNavigator();

const StackProfile = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false, animation: 'slide_from_left' }} />
        <Stack.Screen name="CustomFrames" component={CustomFrames} options={{ headerShown: false }} />
        <Stack.Screen name="CustomFrameScreen" component={CustomFrame} options={{ headerShown: false }} />
        <Stack.Screen name="CustomFrameScreen2" component={CustomFrame2} options={{ headerShown: false }} />
        <Stack.Screen name="SavedFrameScreen" component={SavedFrames} options={{ headerShown: false }} />
        <Stack.Screen name="fullScreenProfile" component={fullScreenProfile} options={{ headerShown: false }} />
        <Stack.Screen name="editprofile" component={EditProfile} options={{ headerShown: false, animation: 'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackProfile;