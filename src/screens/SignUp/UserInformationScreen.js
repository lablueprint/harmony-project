import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView, Text,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import SignInWave from '../SignIn/background.svg';

const styles = StyleSheet.create({
  screen: {
    fontFamily: 'Helvetica Neue',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
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
  inputLabel: {
    color: '#BDBDBD',
  },
  errorStyle: {
    color: '#bc5d4e',
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 30,
    width: '100%',
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
  },
  pickerContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
    marginBottom: -30,
  },
  buttonContainer: {
    padding: 20,
  },
  buttonText_1: {
    color: '#8E4F97',
  },
  buttonText_2: {
    color: '#ffffff',
  },
  buttonText_3: {
    color: '#8e4f97',
  },
  button_1: {
    backgroundColor: '#ffffff',
    borderColor: '#8E4F97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
  button_2: {
    backgroundColor: '#8e4f97',
    borderColor: '#8e4f97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
  button_3: {
    backgroundColor: '#ffffff',
    borderColor: '#8e4f97',
    borderWidth: 3,
    borderRadius: 40,
    width: 250,
  },
});

export default function UserInformationScreen({ route, navigation }) {
  const { classCode, role } = route.params;

  const [firstName, setFirstName] = useState('');
  const [firstNameFocus, setFirstNameFocus] = useState(false);
  const [firstNameErr, setFirstNameErr] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const [lastNameErr, setLastNameErr] = useState('');
  const [studentID, setStudentID] = useState('');
  const [studentIDFocus, setStudentIDFocus] = useState(false);
  const [studentIDErr, setStudentIDErr] = useState('');
  const [email, setEmail] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [passwordErr, setPasswordErr] = useState('');
  const [reenterPwd, setReenterPwd] = useState('');
  const [reenterPwdFocus, setReenterPwdFocus] = useState(false);
  const [reenterPwdErr, setReenterPwdErr] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [gradeLevelErr, setGradeLevelErr] = useState('');

  const numbers = /\d/; // regex that tests numbers
  const lowers = /[a-z]/; // regex that tests lowercase letters
  const uppers = /[A-Z]/; // regex that tests uppercase letters
  const symbols = /[^a-zA-Z\d]/; // regex that tests symbols

  useEffect(() => {
    setFirstNameErr('');
  }, [firstName]);

  useEffect(() => {
    setLastNameErr('');
  }, [lastName]);

  useEffect(() => {
    setStudentIDErr('');
  }, [studentID]);

  useEffect(() => {
    setEmailErr('');
  }, [email]);

  useEffect(() => {
    setPasswordErr('');
  }, [password]);

  useEffect(() => {
    setReenterPwdErr('');
  }, [reenterPwd]);

  function verifyFirstName() {
    let error = false;
    if (firstName.length === 0) {
      setFirstNameErr('*Invalid first name');
      error = true;
    }

    return error;
  }

  function verifyLastName() {
    let error = false;
    if (lastName.length === 0) {
      setLastNameErr('*Invalid last name');
      error = true;
    }
    return error;
  }

  function verifyStudentID() {
    let error = false;
    if (role === 'Student') {
      if (studentID.length === 0) {
        setStudentIDErr('*Invalid Student ID');
        error = true;
      }
    }
    return error;
  }

  function verifyGrade() {
    let error = false;
    if (role === 'Student') {
      if (gradeLevel < 0) {
        setGradeLevelErr('*Invalid grade level');
        error = true;
      }
    }
    return error;
  }

  function verifyEmail() {
    let error = false;
    if (email.length === 0) {
      setEmailErr('*Invalid Email');
      error = true;
    } /* else if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.toLowerCase())) {
      setEmailErr('*Invalid Email');
      error = true;
    } */
    return error;
  }

  function verifyPassword() {
    let error = false;
    if (password.length < 8) {
      setPasswordErr('*Password must be at least 8 characters long');
      error = true;
    } else if (!uppers.test(password)) {
      setPasswordErr('*Password must contain at least 1 uppercase letter');
      error = true;
    } else if (!lowers.test(password)) {
      setPasswordErr('*Password must contain at least 1 lowercase letter');
      error = true;
    } else if (!numbers.test(password)) {
      setPasswordErr('*Password must contain at least 1 number');
      error = true;
    } else if (!symbols.test(password)) {
      setPasswordErr('*Password must contain at least 1 special character');
      error = true;
    }
    return error;
  }

  const signup = async () => {
    Auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          user.sendEmailVerification();
        }
      })
      .then(() => {
        navigation.navigate('InstrumentSelection', {
          classCode,
          role,
          firstName,
          lastName,
          studentID,
          gradeLevel,
          email,
          password,
        });
      })
      .catch((e) => {
        const errorCode = e.code;
        if (errorCode === 'auth/email-already-in-use') {
          setEmailErr('*Email already in use');
        }
      });
  };

  function verifyReenterPwd() {
    let error = false;
    if (reenterPwd.length < 8) {
      setReenterPwdErr('*Passwords do not match');
      error = true;
    } else if (reenterPwd !== password) {
      setReenterPwdErr('*Passwords do not match');
      error = true;
    }
    return error;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave />
        </Svg>
      </View>
      <ScrollView style={{ marginTop: 100, width: '100%' }}>
        <View style={styles.subContainer}>
          <Input
            onBlur={() => {
              setFirstNameFocus(false);
              verifyFirstName();
            }}
            onFocus={() => setFirstNameFocus(true)}
            label={firstNameFocus || firstName !== '' ? 'First Name' : ''}
            labelStyle={styles.inputLabel}
            placeholder="First Name"
            errorMessage={firstNameErr}
            errorStyle={styles.errorStyle}
            onChangeText={(value) => setFirstName(value)}
          />
        </View>
        <View style={styles.subContainer}>
          <Input
            onBlur={() => {
              setLastNameFocus(false);
              verifyLastName();
            }}
            onFocus={() => setLastNameFocus(true)}
            label={lastNameFocus || lastName !== '' ? 'Last Name' : ''}
            labelStyle={styles.inputLabel}
            placeholder="Last Name"
            errorMessage={lastNameErr}
            errorStyle={styles.errorStyle}
            onChangeText={(value) => setLastName(value)}
          />
        </View>
        {role === 'Student'
        && (
          <View style={styles.subContainer}>
            <Input
              onBlur={() => {
                setStudentIDFocus(false);
                verifyStudentID();
              }}
              onFocus={() => setStudentIDFocus(true)}
              label={studentIDFocus || studentID !== '' ? 'Student ID' : ''}
              labelStyle={styles.inputLabel}
              placeholder="Student ID"
              errorMessage={studentIDErr}
              errorStyle={styles.errorStyle}
              onChangeText={(value) => setStudentID(value)}
            />
          </View>
        )}
        {role === 'Student'
        && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gradeLevel}
              style={styles.textInput}
              onValueChange={(itemValue) => {
                setGradeLevel(itemValue);
                verifyGrade();
              }}
            >
              <Picker.Item label="Grade Level" value={-1} color="#9c9c9c" />
              <Picker.Item label="Kindergarten" value={0} />
              <Picker.Item label="1st" value={1} />
              <Picker.Item label="2nd" value={2} />
              <Picker.Item label="3rd" value={3} />
              <Picker.Item label="4th" value={4} />
              <Picker.Item label="5th" value={5} />
              <Picker.Item label="6th" value={6} />
              <Picker.Item label="7th" value={7} />
              <Picker.Item label="8th" value={8} />
              <Picker.Item label="9th" value={9} />
              <Picker.Item label="10th" value={10} />
              <Picker.Item label="11th" value={11} />
              <Picker.Item label="12th" value={12} />
            </Picker>
            <Text style={[styles.errorStyle, { marginLeft: 10 }]}>{gradeLevelErr}</Text>
          </View>
        )}
        <View style={styles.subContainer}>
          <Input
            onBlur={() => {
              setEmailFocus(false);
              verifyEmail();
            }}
            onFocus={() => setEmailFocus(true)}
            label={emailFocus || email !== '' ? 'Email' : ''}
            labelStyle={styles.inputLabel}
            placeholder="Email"
            errorMessage={emailErr}
            errorStyle={styles.errorStyle}
            onChangeText={(value) => setEmail(value)}
          />
        </View>
        <View style={styles.subContainer}>
          <Input
            onBlur={() => {
              setPasswordFocus(false);
              verifyPassword();
            }}
            onFocus={() => setPasswordFocus(true)}
            label={passwordFocus || password !== '' ? 'Password' : ''}
            labelStyle={styles.inputLabel}
            placeholder="Password"
            errorMessage={passwordErr}
            errorStyle={styles.errorStyle}
            secureTextEntry
            onChangeText={(value) => setPassword(value)}
          />
        </View>
        <View style={styles.subContainer}>
          <Input
            onBlur={() => {
              setReenterPwdFocus(false);
              verifyReenterPwd();
            }}
            onFocus={() => setReenterPwdFocus(true)}
            label={reenterPwdFocus || reenterPwd !== '' ? 'Re-enter Password' : ''}
            labelStyle={styles.inputLabel}
            placeholder="Re-enter Password"
            errorMessage={reenterPwdErr}
            errorStyle={styles.errorStyle}
            secureTextEntry
            onChangeText={(value) => setReenterPwd(value)}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            titleStyle={styles.buttonText_2}
            buttonStyle={styles.button_2}
            title="Next"
            onPress={() => {
              if (!verifyFirstName() && !verifyLastName() && !verifyStudentID()
              && !verifyGrade() && !verifyEmail() && !verifyPassword()
              && !verifyReenterPwd()) {
                signup();
              }
            }}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            titleStyle={styles.buttonText_3}
            buttonStyle={styles.button_3}
            title="Login"
            onPress={() => { navigation.navigate('SignIn'); }}
          />
        </View>
      </ScrollView>

    </View>
  );
}

UserInformationScreen.navigationOptions = ({ navigation }) => ({
  title: 'Sign In',
  headerShown: true,
});

UserInformationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.isRequired,
  }).isRequired,
};
