import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import SplashScreen from './SplashScreen';
// import { PaperProvider } from 'react-native-paper';

import StackNavigatorMain from './screensMain/StackNavigators';
import StackNavigatorLogin from './screensLogin/StackNavigators';
import StackSearch from './search/StackSearch';
import Notifications from './Notifications';
import EditHome from './Home/EditHome';
import EditHomeDynamic from './Home/EditHomeDynamic';
import EditBusiness from './Business/EditBusiness';
import EditTempFromCustom from './custom/EditTemp';
import ChooseCustomFrame from './custom/ChooseCustomFrame';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EditCustomChoice from './custom/EditCustomChoice';

const Stack = createNativeStackNavigator();

// const SplashScreen = () => (
//   <View style={styles.container}>
//     <Text style={styles.text}>Splash Screen</Text>
//   </View>
// );
console.log(process.env.REACT__APP_URL)

const MyStack = () => {
  const [loader, setLoader] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const retrieveData = async () => {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(data === 'true');
    } catch (error) {
      console.log('Error retrieving login status:', error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      await retrieveData();
      setTimeout(() => {
        setLoader(false);
      }, 3000);
    };

    initializeApp();
  }, []);

  return (
    <>
      {loader ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={isLoggedIn ? ('StackMain') : ("StackLogin")}>
            <Stack.Screen
              name="StackMain"
              component={StackNavigatorMain}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SearchScreen"
              component={StackSearch}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
        <Stack.Screen name="EditHomeScreen" component={EditHome} options={{ headerShown: false, animation: 'slide_from_right', }} />
        <Stack.Screen name="EditHomeDynamic" component={EditHomeDynamic} options={{ headerShown: false, animation: 'slide_from_right', }} />
        <Stack.Screen name="EditBusiness" component={EditBusiness} options={{ headerShown: false, animation: 'slide_from_right', }} />
        <Stack.Screen name="EditTempFromCustom" component={EditTempFromCustom} options={{ headerShown: false, animation: 'slide_from_right', }} />
        <Stack.Screen name="EditCustomChoice" component={EditCustomChoice} options={{ headerShown: false, animation: 'slide_from_right', }} />
        <Stack.Screen name="ChooseCustomFrame" component={ChooseCustomFrame} options={{ headerShown: false, animation: 'slide_from_right', }} />

            <Stack.Screen
              name="Notifications"
              component={Notifications}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="StackLogin"
              component={StackNavigatorLogin}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MyStack;
