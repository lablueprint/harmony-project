import React, { useState } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import Auth from '@react-native-firebase/auth';

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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const forgotpassword = async () => {
    setShowLoading(true);
    try {
      await Auth().sendPasswordResetEmail(email);
      setShowLoading(false);
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
          <Text style={{ fontSize: 28, height: 50 }}>Forgot Your Password?</Text>
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
          <Button
            style={styles.textInput}
            icon={(
              <Icon
                name="input"
                size={15}
                color="white"
              />
            )}
            title="Reset Password"
            onPress={() => forgotpassword()}
          />
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
            title="Back to Login"
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

ForgotPasswordScreen.navigationOptions = ({ navigation }) => ({
  title: 'Forgot Password',
  headerShown: false,
});
