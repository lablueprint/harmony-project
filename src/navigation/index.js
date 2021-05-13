/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// import Firebase from '@react-native-firebase/app';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import Auth from '@react-native-firebase/auth';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigator from './BottomTabNavigation';
// import AuthContext from './AuthContext';

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
  // const [isAuth, setAuth] = useState(null);
  // const authToken = useState(false);

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(authUser) {
    if (authUser && authUser.email) setUser(authUser); // only set if not anonymous
    else setUser(null);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // /* Check if user is logged in. If yes then isAuth is != null
  // Will rerender when authToken is changed; authToken can be changed
  // using React Context. Refer to SignInScreen.js's signin function
  // for an example.
  // */
  // useEffect(() => {
  //   setAuth(Firebase.auth().currentUser);
  // }, [authToken]);

  return (
  // <AuthContext.Provider value={authToken}>
    <NavigationContainer>
      <Root.Navigator>
        {user
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
              options={{ title: '' }}
            />
          )}
      </Root.Navigator>
    </NavigationContainer>
  // </AuthContext.Provider>
  );
};

export default AppContainer;
