import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigation';

const AppContainer = () => (
  <NavigationContainer>
    <BottomTabNavigator />
  </NavigationContainer>
);

export default AppContainer;
