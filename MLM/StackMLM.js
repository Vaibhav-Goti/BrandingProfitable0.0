import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import MLMhome from './MLMhome';
import MLMScreen2 from './MLMScreen2';
import WalletApp from './Wallet';
import MainMLMScreen from './MainMLMScreen';

const Stack = createNativeStackNavigator();

const StackMLM = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name="MLMhome" component={MainMLMScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MLMScreen2" component={MLMScreen2} options={{ headerShown: false, animation:'slide_from_right' }} />
        <Stack.Screen name="WalletApp" component={WalletApp} options={{ headerShown: false, animation:'slide_from_right' }} />
      </Stack.Navigator>
  );
};

export default StackMLM;