import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, Text
} from 'react-native';
import { Button } from 'react-native-elements';
import SignInWave from '../SignIn/background.svg';
import Svg from 'react-native-svg';

const styles = StyleSheet.create({
  screen: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wavyBanner:  {
    position: "absolute",
    top: 0,
    width: '100%',
    height: '20%'
  },
  h2: {
    fontSize: 30,
    fontWeight: 'bold', 
    color: '#4F4F4F'
  },
  buttonContainer: {
    padding: 20, 
  },
  buttonText_1: {
    color: '#8E4F97'
  },
  buttonText_2: {
    color: '#BC5D4E'
  },
  button_1: {
    backgroundColor: '#ffffff', 
    borderColor: '#8E4F97', 
    borderWidth: 3, 
    borderRadius: 40, 
    width: 250
  },
  button_2: {
    backgroundColor: '#ffffff', 
    borderColor: '#BC5D4E', 
    borderWidth: 3, 
    borderRadius: 40, 
    width: 250
  }
});

export default function SignUpScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave/>
        </Svg>
      </View>
      <Text style={styles.h2}>Sign up as a...</Text>
      <Button
        titleStyle={styles.buttonText_1}
        buttonStyle={styles.button_1}
        containerStyle={styles.buttonContainer}
        title={"Teacher"}
        onPress={() => navigation.navigate('UserInformation', {role: 'Teacher'})}
      />
      <Button
        titleStyle={styles.buttonText_2}
        buttonStyle={styles.button_2}
        containerStyle={styles.buttonContainer}
        title={"Student"}
        onPress={() => navigation.navigate('UserInformation', {role: 'Student'})}
      />
    </View>

  );
}
