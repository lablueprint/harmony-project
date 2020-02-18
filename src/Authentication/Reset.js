import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';

export default function Reset({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Reset</Text>
    </View>
  );
}

Reset.navigationOptions = ({ navigation }) => ({
  title: 'Reset',
  headerShown: false,
});
