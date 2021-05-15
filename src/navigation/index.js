import React, { useState, useEffect } from 'react';
import Firebase from '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigator from './BottomTabNavigation';
import AuthContext from './AuthContext';

/* This contains the default navigation settings for the ENTIRE
APPLICATION. Currently, it will display the linear gradient at the
top of the app for every single page.
*/
const defaultNavOptions = {
  headerBackground: () => (
    <LinearGradient
      colors={['#984A9C', '#C95748']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  ),
  title: '',
};

const AppContainer = () => {
  const Root = createStackNavigator();
  const [isAuth, setAuth] = useState(null);
  const authToken = useState(false);

  /* Check if user is logged in. If yes then isAuth is != null
  Will rerender when authToken is changed; authToken can be changed
  using React Context. Refer to SignInScreen.js's signin function
  for an example.
  */
  useEffect(() => {
    setAuth(Firebase.auth().currentUser);
  }, [authToken]);

  return (
    <AuthContext.Provider value={authToken}>
      <NavigationContainer>
        <Root.Navigator>
          {isAuth
            ? (
              <Root.Screen
                name="MainApp"
                component={BottomTabNavigator}
                options={defaultNavOptions}
              />
            )
            : (
              <Root.Screen
                name="AuthStack"
                component={AuthNavigation}
                options={{ title: '' }} to options={{ headerShown: false }}
              />
            )}
        </Root.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default AppContainer;
