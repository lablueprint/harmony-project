import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NotificationsScreen from '../../screens/Notifications/NotificationsScreen';

const Stack = createStackNavigator();

const NotificationStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

export default NotificationStackNavigator;
