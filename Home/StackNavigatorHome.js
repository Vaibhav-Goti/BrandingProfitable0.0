import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';
import CategoriesScreen from './SubCategoriesScreen/CategoriesScreen';
import TrendingScreen from './SubCategoriesScreen/TrendingScreen';
import EditHomeDynamic from './EditHomeDynamic';

const Stack = createNativeStackNavigator();

const StackHome = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="category" component={CategoriesScreen} options={{ headerShown: false, animation:'slide_from_right'}} />
        <Stack.Screen name="trending" component={TrendingScreen} options={{ headerShown: false, animation:'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackHome;