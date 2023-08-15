import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BusinessScreen from './BusinessScreen';
import AllBusiness from './AllBusiness';

const Stack = createNativeStackNavigator();

const StackBusiness = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="BusinessScreen" component={BusinessScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AllBusiness" component={AllBusiness} options={{ headerShown: false, animation:'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackBusiness;