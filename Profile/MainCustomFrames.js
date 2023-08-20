import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomFrames from './CustomFrames';

const Stack = createNativeStackNavigator();

const MainCustomFrame = () => {
  return (
    <Stack.Navigator>
            <Stack.Screen name="CustomFramesProfileSelect" component={CustomFrames} options={{headerShown:false}} />
    </Stack.Navigator>
  );
};

export default MainCustomFrame;
