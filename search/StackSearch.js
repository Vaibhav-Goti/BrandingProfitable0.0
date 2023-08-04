import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditItem from './EditItemSearch';
import SearchScreen from './SearchScreen';

const Stack = createNativeStackNavigator();

const StackSearch = () => {
    return (
        <>
            <Stack.Navigator >
                <Stack.Screen
                    name="SearchScreen1"
                    component={SearchScreen}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="EditItemSearch"
                    component={EditItem}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
            </Stack.Navigator>
        </>
    );
};

export default StackSearch;
