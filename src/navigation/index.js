import React, { useState, useEffect } from 'react';
import Firebase from '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigator from './BottomTabNavigation';

const AppContainer = () => {
  const [isAuth, setAuth] = useState(null);

  // Check if user is logged in. If yes then isAuth is != null
  useEffect(() => {
    setAuth(Firebase.auth().currentUser);
  }, []);

  return (
    <NavigationContainer>
      { isAuth && <BottomTabNavigator /> }
      { !isAuth && <AuthNavigation /> }
    </NavigationContainer>
  );
};

export default AppContainer;
