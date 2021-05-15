import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import Svg from 'react-native-svg';
import AuthContext from '../../navigation/AuthContext';
import SignInWave from './background.svg';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f6f6f6',
    width: '100%',
  },
  bannerText: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 50,
  },
  wavyBanner: {
    position: 'absolute',
    width: '100%',
    height: '55%',
  },
  beforeBanner: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
  },
  afterBanner: {
    width: 100,
    height: 100,
    backgroundColor: '#ffffff',
  },
  whiteText: {
    color: '#ffffff',
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  h2: {
    padding: 15,
    fontSize: 22,
  },
  errorStyle: {
    color: '#bc5d4e',
    fontWeight: 'bold',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    paddingTop: 40,
    padding: 20,
  },
  subContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 10,
  },
  buttonText_1: {
    color: '#828282',
  },
  buttonText_2: {
    color: '#ffffff',
  },
  buttonText_3: {
    color: '#8e4f97',
  },
  button_1: {
    backgroundColor: 'transparent',
    borderRadius: 40,
    width: 250,
  },
  button_2: {
    backgroundColor: '#8e4f97',
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

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLabel, setEmailLabel] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  // const [authState, setAuthState] = useContext(AuthContext);

  // signin
  const signin = async () => {
    setShowLoading(true);
    Auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        setShowLoading(false);
      })
      .catch((e) => {
        setShowLoading(false);
        Alert.alert(e.message);
      });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.wavyBanner}>
        <Svg viewBox="0 0 375 450" width="100%" height="100%" preserveAspectRatio="none">
          <SignInWave />
        </Svg>
      </View>
      <View style={styles.bannerText}>
        <Text style={[styles.whiteText, styles.h2]}>Welcome to</Text>
        <Text style={[styles.whiteText, styles.h1]}>Harmony Project</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.subContainer}>
          <Text style={{ fontSize: 28, height: 50 }}>Please Sign In!</Text>
        </View>
        <View style={styles.subContainer}>
          <Input
            style={styles.textInput}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            label={emailLabel}
            errorMessage={emailError}
            errorStyle={styles.errorStyle}
          />
        </View>
        <View style={styles.subContainer}>
          <Input
            style={styles.textInput}
            placeholder="password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            label={passwordLabel}
            errorMessage={passwordError}
            errorStyle={styles.errorStyle}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            titleStyle={styles.buttonText_1}
            buttonStyle={styles.button_1}
            title="Forgot password?"
            onPress={() => navigation.navigate('ForgotPassword')}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            titleStyle={styles.buttonText_2}
            buttonStyle={styles.button_2}
            title="Login"
            onPress={() => login()}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            titleStyle={styles.buttonText_3}
            buttonStyle={styles.button_3}
            title="Sign Up"
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          />
        </View>
        {showLoading
          && (
          <View style={styles.activity}>
            <ActivityIndicator size="large" color="#828282" />
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
};
