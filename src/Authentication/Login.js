import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';

export default function Login({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login</Text>
    </View>
  );
}

Login.navigationOptions = ({ navigation }) => ({
  title: 'Login',
  headerShown: false,
});
