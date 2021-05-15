import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import UserInformationScreen from '../screens/SignUp/UserInformationScreen';

const Stack = createStackNavigator();

const AuthNavigation = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="UserInformation" component={UserInformationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

export default AuthNavigation;
