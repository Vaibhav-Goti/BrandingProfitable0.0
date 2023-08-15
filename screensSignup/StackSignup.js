import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './SignUp';
import SignUp2 from './SignUp2';
import SavedFrames from './CustomFrames';
import CustomFrameForm from './CustomFrame1';

const Stack = createNativeStackNavigator();

const SignUpStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignupScreen" options={{ headerShown: false, animation: 'slide_from_right' }} component={SignUp} />
      {/* <Stack.Screen name="SignUp2Screen" options={{ headerShown: false, animation: 'slide_from_right' }} component={SignUp2} /> */}
      <Stack.Screen name="CustomScreen" options={{ headerShown: false, animation: 'slide_from_right' }} component={SavedFrames} />
      <Stack.Screen name="CustomFrameForm" component={CustomFrameForm} options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
};

export default SignUpStack;