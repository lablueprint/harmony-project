import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
    </View>
  );
}

Home.navigationOptions = ({ navigation }) => ({
  title: 'Home',
});
