import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LibraryScreen, LibraryFilesScreen } from '../../screens/Library';

const Stack = createStackNavigator();

const LibraryNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Library" component={LibraryScreen} />
    <Stack.Screen name="LibraryFiles" component={LibraryFilesScreen} />
  </Stack.Navigator>
);

export default LibraryNavigator;
