import React, { Component } from 'react';
import { Text, View } from 'react-native';

import TestFireBase from '../FireBase';

export default function HomeScreen() {

  return (
    <View>
      <Text>Hello World!</Text>
      <TestFireBase />
    </View>
  );
}
