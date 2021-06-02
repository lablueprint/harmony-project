/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from '@react-native-firebase/auth';
import AuthNavigation from './AuthNavigation';
import BottomTabNavigator from './BottomTabNavigation';
import { ClassroomContext, HeaderContext } from '../context';
import ClassroomSelector from '../components/ClassroomSelector';

const AppContainer = () => {
  const Root = createStackNavigator();

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [classroom, setClassroom] = useState('');
  const [animate, setAnimate] = useState('');

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

  // useEffect(() => {
  //   console.log('hi');
  // }, [header]);

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
    <ClassroomContext.Provider value={{ classroom, setClassroom }}>
      <HeaderContext.Provider value={{ animate, setAnimate }}>
        <NavigationContainer>
          <Root.Navigator screenOptions={{ headerMode: 'screen' }}>
            {user
              ? (
                <Root.Screen
                  name="MainApp"
                  component={BottomTabNavigator}
                  options={({ route }) => ({
                    headerMode: 'float',
                    header: ({ scene }) => getFocusedRouteNameFromRoute(route) !== 'Profile' && <ClassroomSelector scene={scene} />,
                  })}
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
      </HeaderContext.Provider>
    </ClassroomContext.Provider>
  );
};

export default AppContainer;
