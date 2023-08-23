import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';

function GetFCMToken() {
  let fcmToken = AsyncStorage.getItem("fcmtoken");
}

export async function requestUserPermission() {
  const showToastWithGravity = (data) => {
    ToastAndroid.showWithGravityAndOffset(
      data,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      50
    )
  }

  GetFCMToken();
  let fcmtoken;
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    if (!fcmtoken) {
      try {
        fcmtoken = await messaging().getToken();
        if (fcmtoken) {
          console.log('new fcmToken:', fcmtoken);
          await AsyncStorage.setItem('fcmtoken', fcmtoken);
        }
      } catch (error) {
        console.log('error in Notification:', error);
      }
    }
  }

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // Handle the notification here
    handleNotification(remoteMessage);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    showToastWithGravity("New Notification!");
    // Handle the notification here
    handleNotification(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        // Handle the notification here
        handleNotification(remoteMessage);
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log("notification on foreground state......", remoteMessage);
    showToastWithGravity("New Notification!");
    // Handle the notification here
    handleNotification(remoteMessage);
  });
}

// Function to handle notifications
async function handleNotification(remoteMessage) {
  // Retrieve existing notification data from AsyncStorage
  let notificationData = await AsyncStorage.getItem('notificationData');
  if (notificationData) {
    notificationData = JSON.parse(notificationData);
  } else {
    // Initialize notificationData if it doesn't exist
    notificationData = { counts: 0, notifications: [] };
  }

  // Update counts and add the new notification
  notificationData.counts++;
  notificationData.notifications.push(remoteMessage);

  // Save the updated data back to AsyncStorage
  await AsyncStorage.setItem('notificationData', JSON.stringify(notificationData));
}
