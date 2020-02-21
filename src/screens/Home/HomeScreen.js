import React from 'react';
import {
  SafeAreaView, ScrollView, Text, View,
} from 'react-native';

import UploadFile from '../../components/ImagePicker';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Hello World!</Text>
          <UploadFile />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
