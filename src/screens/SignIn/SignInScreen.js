import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

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
    padding: 10,
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

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const signin = async () => {
    setShowLoading(true);
    try {
      const doSignIn = await Auth().signInWithEmailAndPassword(email, password);
      setShowLoading(false);
      if (doSignIn.user) {
        navigation.navigate('Home', { uid: doSignIn.user.uid });
      }
    } catch (e) {
      setShowLoading(false);
      Alert.alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, height: 50 }}>Please Sign In!</Text>
        </View>
        <View style={styles.subContainer}>
          <Input
            style={styles.textInput}
            placeholder="Email"
            leftIcon={(
              <Icon
                name="mail"
                size={24}
              />
            )}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.subContainer}>
          <Input
            style={styles.textInput}
            placeholder="Password"
            leftIcon={(
              <Icon
                name="lock"
                size={24}
              />
            )}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            icon={(
              <Icon
                name="input"
                size={15}
                color="white"
              />
            )}
            title="Login"
            onPress={() => signin()}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Forgot Password?</Text>
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            icon={(
              <Icon
                name="refresh"
                size={15}
                color="white"
              />
            )}
            title="Reset Password"
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Not a user?</Text>
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            icon={(
              <Icon
                name="check-circle"
                size={15}
                color="white"
              />
            )}
            title="Register"
            onPress={() => {
              navigation.navigate('SignUp');
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
SignInScreen.navigationOptions = ({ navigation }) => ({
  title: 'Sign In',
  headerShown: false,
});

SignInScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
