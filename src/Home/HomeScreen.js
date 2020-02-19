import React, { Component } from 'react';
import { Text, View } from 'react-native';

import TestFireBase from '../Components/FireBase/Storage';

export default function HomeScreen() {

  return (
    <View>
      <Text>Hello World!</Text>
      <TestFireBase />
    </View>
  );
}
