import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, Text,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Svg from 'react-native-svg';
import SignInWave from '../SignIn/background.svg';

const styles = StyleSheet.create({
  screen: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
  inputContainer: {
    padding: 10,
  },
  inputLabel: {
    color: '#BDBDBD',
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

export default function UserInformationScreen({ route, navigation }) {
  const { role } = route.params;

  const [firstName, setFirstName] = useState('');
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [lastName, setLastName] = useState('');
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [studentID, setSudentID] = useState('');
  const [studentIDFocus, setSudentIDFocus] = useState(false);
  const [email, setEmail] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [reenterPwd, setReenterPwd] = useState('');
  const [reenterPwdFocus, setReenterPwdFocus] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave />
        </Svg>
      </View>
      <ScrollView style={{ marginTop: 190, width: '100%' }}>
        <Input
          onBlur={() => setFirstNameFocus(false)}
          onFocus={() => setFirstNameFocus(true)}
          label={firstNameFocus || firstName !== '' ? 'First Name' : ''}
          labelStyle={styles.inputLabel}
          placeholder="First Name"
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setFirstName(value)}
        />
        <Input
          onBlur={() => setLastNameFocus(false)}
          onFocus={() => setLastNameFocus(true)}
          label={lastNameFocus || lastName !== '' ? 'Last Name' : ''}
          labelStyle={styles.inputLabel}
          placeholder="Last Name"
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setLastName(value)}
        />
        {role === 'Student'
        && (
        <Input
          onBlur={() => setSudentIDFocus(false)}
          onFocus={() => setSudentIDFocus(true)}
          label={studentIDFocus || studentID !== '' ? 'Student ID' : ''}
          labelStyle={styles.inputLabel}
          placeholder="Student ID"
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setSudentID(value)}
        />
        )}
        <Input
          onBlur={() => setEmailFocus(false)}
          onFocus={() => setEmailFocus(true)}
          label={emailFocus || email !== '' ? 'Email' : ''}
          labelStyle={styles.inputLabel}
          placeholder="Email"
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setEmail(value)}
        />
        <Input
          onBlur={() => setPasswordFocus(false)}
          onFocus={() => setPasswordFocus(true)}
          label={passwordFocus || password !== '' ? 'Password' : ''}
          labelStyle={styles.inputLabel}
          placeholder="Password"
          secureTextEntry
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setPassword(value)}
        />
        <Input
          onBlur={() => setReenterPwdFocus(false)}
          onFocus={() => setReenterPwdFocus(true)}
          label={reenterPwdFocus || reenterPwd !== '' ? 'Re-enter Password' : ''}
          labelStyle={styles.inputLabel}
          placeholder="Re-enter Password"
          secureTextEntry
          containerStyle={styles.inputContainer}
          onChangeText={(value) => setReenterPwd(value)}
        />
        <Input
          labelStyle={styles.inputLabel}
          placeholder="Birthdate"
          containerStyle={styles.inputContainer}
        />
      </ScrollView>

    </View>
  );
}
