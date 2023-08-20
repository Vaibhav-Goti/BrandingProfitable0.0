import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SavedFrames from './SavedFrames';
import MainCustomFrame from './MainCustomFrames';

const Tab = createMaterialTopTabNavigator();

const Frames = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, color: 'gray' }, // Inactive tab text color
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white', // Active tab text color
        tabBarIndicatorStyle: { backgroundColor: 'white' }, // Active tab indicator color
      }}
    >
      <Tab.Screen name="SavedFramesProfile" component={SavedFrames} options={{title:'Saved Frames'}} />
      <Tab.Screen name="CustomFramesProfile" component={MainCustomFrame} options={{title:'Custom Frames'}} />
    </Tab.Navigator>
  );
};

export default Frames;
