import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import Custom from './Custom';
import EditTemp from './EditTemp';

const CustomStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="customscreen" component={Custom} options={{ headerShown: false, animation:'slide_from_left' }} />
      </Stack.Navigator>
  );
};

export default CustomStack;