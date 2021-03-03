import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert, TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button, Input } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE, roles } from '../../components/const';

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
});

const numbers = /\d/; // regex that tests numbers
const lowers = /[a-z]/; // regex that tests lowercase letters
const uppers = /[A-Z]/; // regex that tests uppercase letters
const symbols = /[^a-zA-Z\d]/; // regex that tests symbols

export default function SignUpScreen({ navigation }) {
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [password, setPassword] = useState(''); // keeps track of inputted password to ensure validity
  const [showLoading, setShowLoading] = useState(false);
  const [code, setCode] = useState(''); // classroom code
  const classRef = Firestore().collection('classrooms');

  // password error message
  let message = 'Password must include:\n';

  const signup = async () => {
    // if password valid, signup
    if (password.length >= 8 && numbers.test(password) && uppers.test(password)
    && lowers.test(password) && symbols.test(password)) {
      setShowLoading(true);
      try {
        // user is signed up, then the appropriate firestore calls are made based on role
        const doSignUp = await Auth().createUserWithEmailAndPassword(userState.email, password);
        const { user } = doSignUp;
        setShowLoading(false);
        if (user) {
          // check if classroom exists before signing up student
          if (userState.role === 'STUDENT') {
            classRef.doc(code.toLowerCase()).get()
              .then((document) => {
                if (document.exists) {
                  return document.data();
                }
                return null;
              })
              .then((data) => {
                if (data) {
                  // if user is a student, add their id to the classroom
                  if (userState.role === 'STUDENT') {
                    classRef.doc(code.toLowerCase()).update({
                      studentIDs: Firestore.FieldValue.arrayUnion(user.uid),
                    });
                  }
                  Firestore().collection('users').doc(user.uid).set({
                    ...userState,
                    createdAt: Firestore.FieldValue.serverTimestamp(),
                    updatedAt: Firestore.FieldValue.serverTimestamp(),
                  });
                  // sign in and navigate to home screen upon signup
                  navigation.navigate('Classroom', { code, classroomInfo: data, uid: user.uid });
                } else {
                  // code invalid, delete created user and send error alert
                  Auth().currentUser.delete();
                  Alert.alert('Please enter a valid code.');
                }
              })
              .catch((e) => {
                Alert.alert(e.message);
              });
          } else {
            // sign up teacher
            Firestore().collection('users').doc(user.uid).set({
              ...userState,
              createdAt: Firestore.FieldValue.serverTimestamp(),
              updatedAt: Firestore.FieldValue.serverTimestamp(),
            });
            // sign in and navigate to home screen upon signup
            navigation.navigate('Landing', { uid: user.uid });
          }
        }
      } catch (e) {
        setShowLoading(false);
        Alert.alert(
          e.message,
        );
      }
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, height: 50 }}>Sign Up Here!</Text>
        </View>
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
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {userState.role === 'STUDENT'
        // show join code textinput only when user is signing up as a student
        && (
          <View style={styles.subContainer}>
            <Text style={{ fontSize: 20, height: 40 }}>Classroom code:</Text>
            <TextInput
              placeholder="ABCDEF"
              fontSize={20}
              maxLength={6}
              onChangeText={setCode}
              value={code}
            />
          </View>
        )}
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            title="Sign Up"
            onPress={() => signup()}
          />
        </View>
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
