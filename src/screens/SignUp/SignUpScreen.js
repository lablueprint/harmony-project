import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE } from '../../components';

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

export default function SignUpScreen({ navigation }) {
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const signup = async () => {
    setShowLoading(true);
    try {
      const doSignUp = await Auth().createUserWithEmailAndPassword(userState.email, password);
      const { user } = doSignUp;
      setShowLoading(false);
      if (user) {
        Firestore().collection('users').doc(user.uid).set({
          ...userState,
          createdAt: Firestore.FieldValue.serverTimestamp(),
          updatedAt: Firestore.FieldValue.serverTimestamp(),
        });
        navigation.navigate('EditProfile', { uid: user.uid });
      }
    } catch (e) {
      setShowLoading(false);
      Alert.alert(
        e.message,
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
