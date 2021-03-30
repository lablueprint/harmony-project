import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert, SafeAreaView, ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Input } from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
// eslint-disable-next-line import/no-unresolved
import CheckBox from '@react-native-community/checkbox';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE, roles, instruments } from '../../components/const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
  checklist: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
});

const numbers = /\d/; // regex that tests numbers
const lowers = /[a-z]/; // regex that tests lowercase letters
const uppers = /[A-Z]/; // regex that tests uppercase letters
const symbols = /[^a-zA-Z\d]/; // regex that tests symbols

export default function SignUpScreen({ navigation }) {
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [password, setPassword] = useState(''); // keeps track of inputted password to ensure validity
  const [showLoading, setShowLoading] = useState(false);
  const [next, setNext] = useState(false);
  const instToggle = {
    musicianship: false,
    bassoon: false,
    cello: false,
    clarinet: false,
    bass: false,
    drumline: false,
    drums: false,
    flute: false,
    frenchHorn: false,
    guitar: false,
    production: false,
    oboe: false,
    percussion: false,
    keyboard: false,
    sax: false,
    trombone: false,
    trumpet: false,
    tuba: false,
    viola: false,
    violin: false,
  };

  // password error message
  let message = 'Password must include:\n';

  const goNext = () => {
    if (password.length !== 0 && userState.email.length !== 0 && userState.firstName.length !== 0
    && userState.lastName.length !== 0 && (userState.role !== 'TEACHER' || userState.displayName.length !== 0)) {
      if (password.length >= 8 && numbers.test(password) && uppers.test(password)
      && lowers.test(password) && symbols.test(password)) {
        // move to next screen
        setNext(true);
      } else {
        // error messages for a bad password
        if (password.length < 8) message += 'At least 8 characters\n';
        if (!numbers.test(password)) message += 'A number\n';
        if (!uppers.test(password)) message += 'An uppercase letter\n';
        if (!lowers.test(password)) message += 'A lowercase letter\n';
        if (!symbols.test(password)) message += 'A symbol\n';
        Alert.alert(
          message,
        );
      }
    } else {
      Alert.alert(
        'Please fill in all the fields',
      );
    }
  };

  const signup = async () => {
    // if everything valid, signup
    if (password.length >= 8 && numbers.test(password) && uppers.test(password)
    && lowers.test(password) && symbols.test(password)) {
      setShowLoading(true);
      try {
        // user is signed up, then the appropriate firestore calls are made based on role
        const doSignUp = await Auth().createUserWithEmailAndPassword(userState.email, password);
        const { user } = doSignUp;
        setShowLoading(false);
        if (user) {
          user.sendEmailVerification();
          const userInsts = [];
          Object.entries(instToggle).forEach((key, value) => {
            if (value) {
              userInsts.push(instruments[key]);
            }
          });
          Firestore().collection('users').doc(user.uid).set({
            ...userState,
            createdAt: Firestore.FieldValue.serverTimestamp(),
            updatedAt: Firestore.FieldValue.serverTimestamp(),
          });
          // sign in and navigate to home screen upon signup
          navigation.navigate('Landing', { uid: user.uid });
        }
      } catch (e) {
        setShowLoading(false);
        Alert.alert(
          e.message,
        );
      }
    } else {
      Alert.alert(
        'Please enter a date of birth',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, height: 50 }}>Sign Up Here!</Text>
        </View>
        {!next && (
        <>
          <View style={styles.subContainer}>
            <Picker
              selectedValue={userState.role}
              style={styles.textInput}
              onValueChange={(itemValue) => {
                setUserState({
                  ...userState,
                  role: itemValue,
                });
              }}
            >
              <Picker.Item label="Student" value={roles.student} />
              <Picker.Item label="Teacher" value={roles.teacher} />
            </Picker>
          </View>
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="Email"
              value={userState.email}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  email: text,
                });
              }}
            />
          </View>
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="First Name"
              value={userState.firstName}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  firstName: text,
                });
              }}
            />
            <Input
              style={styles.textInput}
              placeholder="Last Name"
              value={userState.lastName}
              onChangeText={(text) => {
                setUserState({
                  ...userState,
                  lastName: text,
                });
              }}
            />
          </View>
          {userState.role === 'TEACHER'
            ? (
              <View style={styles.subContainer}>
                <Input
                  style={styles.textInput}
                  placeholder="Display Name"
                  value={userState.displayName}
                  onChangeText={(text) => {
                    setUserState({
                      ...userState,
                      displayName: text,
                    });
                  }}
                />
              </View>
            )
            : (
              <View style={styles.subContainer}>
                <Input
                  style={styles.textInput}
                  placeholder="Student ID"
                  value={userState.hpID}
                  onChangeText={(text) => {
                    setUserState({
                      ...userState,
                      hpID: text,
                    });
                  }}
                />
              </View>
            )}
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.subContainer}>
            <Button
              style={styles.textInput}
              title="Next"
              onPress={goNext}
            />
          </View>
        </>
        )}
        {next
        && (
          <SafeAreaView>
            <ScrollView style={{ height: '80%', marginVertical: 20 }}>
              <View style={styles.subContainer}>
                <Picker
                  selectedValue={userState.gradeLevel}
                  style={styles.textInput}
                  onValueChange={(itemValue) => {
                    setUserState({
                      ...userState,
                      gradeLevel: itemValue,
                    });
                  }}
                >
                  <Picker.Item label="K" value={0} />
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
              </View>
              <View style={styles.subContainer}>
                <Text>
                  Instruments:
                </Text>
                {Object.entries(instruments).map(([key, val]) => (
                  <View style={styles.checklist}>
                    <CheckBox
                      value={instToggle[key]}
                      onValueChange={(value) => {
                        instToggle[key] = value;
                      }}
                    />
                    <TouchableHighlight
                      onPress={() => {
                        instToggle[key] = !instToggle[key];
                      }}
                      underlayColor="#E1E1E1"
                    >
                      <Text>{val}</Text>
                    </TouchableHighlight>
                  </View>
                ))}
              </View>
              <Text>Date of Birth:</Text>
              <Calendar
                minDate={Date()}
                onDayPress={(data) => {
                  setUserState({
                    ...userState,
                    dob: data,
                  });
                }}
                markedDates={{
                  [userState.dob]: { selected: true },
                }}
              />
              <View style={styles.subContainer}>
                <Button
                  style={styles.textInput}
                  title="Sign Up"
                  onPress={() => signup()}
                />
              </View>
            </ScrollView>
          </SafeAreaView>
        )}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Already a user?</Text>
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            title="Login"
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          />
        </View>
        {showLoading
          && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
          )}
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
SignUpScreen.navigationOptions = ({ navigation }) => ({
  title: 'Sign Up',
  headerShown: false,
});

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
