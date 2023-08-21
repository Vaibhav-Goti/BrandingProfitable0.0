import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function GetFCMToken() {
    return AsyncStorage.getItem("fcmtoken").then((token) => {
        console.log('FCM Token:', token); // Log the FCM token here
        return token;
    });
}

export async function requestUserPermission() {
    let fcmtoken = await GetFCMToken();
    const navigation = useNavigation(); // Get the navigation object

    // Initialize counts and notifications
    let counts = {
        unreadCount: 0, // Initialize the unread notification count
        readCount: 0,   // Initialize the read notification count
    };

    // Initialize notifications array
    let notifications = [];

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

    // Load existing counts and notifications from AsyncStorage
    try {
        const savedData = await AsyncStorage.getItem('notificationData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            counts = parsedData.counts;
            notifications = parsedData.notifications;
        }
    } catch (error) {
        console.error('Error loading notification data:', error);
    }

    // Handle incoming notifications
    messaging().onMessage(async remoteMessage => {
        console.log("notification on foreground state......", remoteMessage);

        // Update the unread count when a new notification is received
        counts.unreadCount++;

        // Save the notification to the array
        notifications.push(remoteMessage);

        // Save counts and notifications to AsyncStorage
        await AsyncStorage.setItem('notificationData', JSON.stringify({ counts, notifications }));
        console.log("set Thai gyu Bapu!")
        
    });

    // Handle notification opened while the app is in the background
    messaging().onNotificationOpenedApp(async remoteMessage => {
        console.log(
            'Notification caused the app to open from the background state:',
            remoteMessage.notification,
        );

        // Update the read count when a notification is opened
        counts.readCount++;

        // Save counts and notifications to AsyncStorage
        await AsyncStorage.setItem('notificationData', JSON.stringify({ counts, notifications }));
        
        // Show an alert and navigate to the 'Notifications' screen
        Alert.alert(
            'Notification!',
            'Click ok to show Notification!',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Notifications'); // Use the 'navigation' object to navigate
                    },
                },
            ],
            { cancelable: false }
        );
    });

    // Handle initial notification while the app is not running
    messaging()
        .getInitialNotification()
        .then(async remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused the app to open from the quit state:',
                    remoteMessage.notification,
                );

                // Update the read count when an initial notification is opened
                counts.readCount++;

                // Save counts and notifications to AsyncStorage
                await AsyncStorage.setItem('notificationData', JSON.stringify({ counts, notifications }));
            }
        });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
    });
}
