import React, { useState, useEffect, useContext} from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert, Image,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import Logo from '../../components/hp_circleLogo.png';
import LinearGradient from 'react-native-linear-gradient';
import AuthContext from '../../navigation/AuthContext';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f6f6f6'
  },
  banner: {
    height: '35%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  beforeBanner : { 
    width: 100, 
    height: 100, 
    backgroundColor: '#ffffff'
  },
  afterBanner : { 
    width: 100, 
    height: 100, 
    backgroundColor: '#ffffff'
  },
  whiteText: {
    color: '#ffffff'
  },
  h1: {
    fontSize: 28, 
    fontWeight: 'bold'
  },
  h2: {
    padding: 15, 
    fontSize: 22
  },
  errorStyle: {
    color: '#bc5d4e', 
    fontWeight: 'bold'
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
    color: '#828282'
  }, 
  buttonText_2: {
    color: '#ffffff'
  }, 
  buttonText_3: {
    color: '#8e4f97'
  },
  button_1 : {
    backgroundColor: 'transparent', 
    borderRadius: 40, 
    width: 250
  }, 
  button_2 : {
    backgroundColor: '#8e4f97', 
    borderRadius: 40, 
    width: 250
  }, 
  button_3: {
    backgroundColor: '#ffffff', 
    borderColor: '#8e4f97', 
    borderWidth: 3, 
    borderRadius: 40, 
    width: 250
  }
});

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLabel, setEmailLabel] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [authState, setAuthState] = useContext(AuthContext);

  useEffect(() => {
    setEmailError('');
  }, [email])

  useEffect(() => {
    setPasswordError('');
  }, [password])

  // login
  const login = async () => {
    //setShowLoading(true);
    try {
      if(email === '' && password === '') {
        setEmailError("*Invalid Email");
        setPasswordError("*Invalid Password");
        return;
      } else if (email === '' ) {
        setEmailError("*Invalid Email");
        return;
      } else if (password === '') {
        setPasswordError("*Invalid Password");
        return;
      }

      const doSignIn = await Auth().signInWithEmailAndPassword(email, password);
      setShowLoading(false);
      // if valid signin, navigate to landing
      if (doSignIn.user) {
<<<<<<< HEAD
        navigation.navigate('Load');
=======
        setAuthState(!authState);
>>>>>>> 68ea6869ed88031c676083664d5ab2f6f99a3ead
      }
    } catch (e) {
      const errorCode = e.code; 
      if(errorCode === 'auth/invalid-email') {
        setEmailError("*Invalid Email");
      } else if (errorCode === 'auth/wrong-password') {
        setPasswordError('*Wrong password');
      }
    } 
  };

  return (
    <View style={styles.screen}>
      <LinearGradient style={styles.banner} start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#8e4f97', '#bc5d4e']}>
          <Text style={[styles.whiteText, styles.h2]}>Welcome to</Text>
          <Text style={[styles.whiteText, styles.h1]}>Harmony Project</Text>
      </LinearGradient>
      <View style={styles.formContainer}>
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
