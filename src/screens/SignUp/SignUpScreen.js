import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text,
} from 'react-native';
import { Overlay, Input, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import { setFormikInitialValue } from 'react-native-formik';
import SignInWave from '../SignIn/background.svg';

const styles = StyleSheet.create({
  screen: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  wavyBanner: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '20%',
  },
  h2: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F4F4F',
  },
  buttonContainer: {
    padding: 20,
  },
  buttonText_1: {
    color: '#8E4F97',
  },
  buttonText_2: {
    color: '#BC5D4E',
  },
  button_1: {
    backgroundColor: '#ffffff',
    borderColor: '#8E4F97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
  button_2: {
    backgroundColor: '#ffffff',
    borderColor: '#BC5D4E',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
});

export default function SignUpScreen({ navigation }) {
  let classCode = '';
  let role = 'Student';

  const [askClassCode, setAskClassCode] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave />
        </Svg>
      </View>
      <Text style={styles.h2}>Sign up as a...</Text>
      <Overlay
        isVisible={askClassCode}
        borderRadius={10}
        width={300}
        height={160}
      >
        <View style={{ padding: 10 }}>
          <Text style={styles.h3}>Enter classroom code: </Text>
          <Input
            placeholder="Classroom code"
            onChangeText={(value) => { classCode = value; }}
          />
          <View style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', padding: 10,
          }}
          >
            <Button
              buttonStyle={{ backgroundColor: 'transparent' }}
              title="Cancel"
              titleStyle={{ color: '#828282' }}
              onPress={() => { setAskClassCode(false); }}
            />
            <Button
              buttonStyle={{
                backgroundColor: '#8E4F97',
                borderRadius: 40,
                width: 100,
              }}
              title="Submit"
              titleStyle={{ color: '#ffffff' }}
              onPress={() => {
                setAskClassCode(false);
                navigation.navigate('UserInformation', { classCode, role });
              }}
            />
          </View>
        </View>
      </Overlay>
      <Button
        titleStyle={styles.buttonText_1}
        buttonStyle={styles.button_1}
        containerStyle={styles.buttonContainer}
        title="Teacher"
        onPress={() => {
          setAskClassCode(true);
          role = 'Teacher';
        }}
      />
      <Button
        titleStyle={styles.buttonText_2}
        buttonStyle={styles.button_2}
        containerStyle={styles.buttonContainer}
        title="Student"
        onPress={() => {
          setAskClassCode(true);
          role = 'Student';
        }}
      />
    </View>

  );
}

SignUpScreen.navigationOptions = ({ navigation }) => ({
  title: 'Sign In',
  headerShown: false,
});

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
