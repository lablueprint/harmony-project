import React, { Component } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import TestFireBase from '../Components/FireBase/Storage';

import { UploadFile } from '../Components/ImagePicker';

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
