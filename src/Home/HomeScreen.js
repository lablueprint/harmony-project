import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default async function HomeScreen() {

  await GetFirestore();

  return (
    <View>
      <Text>Hello World!</Text>
    </View>
  );
}
