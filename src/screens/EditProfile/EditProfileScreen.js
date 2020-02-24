/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert,
} from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
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

export default function EditProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [uid, setUid] = useState(navigation.getParam('uid', null));
  const ref = Firestore().collection('users');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  // const [associatedId, setAssociatedId] = useState('');
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [portfolio, setPortfolio] = useState('');
  // const [role, setRole] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  async function getUserData() {
    try {
      // If we somehow get to this screen with no uid passed, go back to homescreen
      if (!uid) navigation.navigate('Home');
      const doc = await ref.doc(uid).get();
      const data = doc.data();
      // TODO: handle behavior for nonexistent user entries in Firestore
      setName(data.name);
      setEmail(data.email);
      setAddress(data.address);
      if (initializing) setInitializing(false);
    } catch (e) {
      setInitializing(false);
      Alert.alert(
        e.message,
      );
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  const submitProfile = async () => {
    setShowLoading(true);
    try {
      await ref.doc(uid).set({
        address,
        email,
        name,
      });
      setShowLoading(false);
    } catch (e) {
      setShowLoading(false);
      Alert.alert(
        e.message,
      );
    }
  };

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, height: 50 }}>Edit Your Profile</Text>
        </View>
        <View style={styles.subContainer}>
          <Input
            style={styles.textInput}
            placeholder="Name"
            leftIcon={(
              <Icon
                name="profile"
                size={24}
              />
            )}
            value={name}
            onChangeText={setName}
          />
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
            placeholder="Address"
            leftIcon={(
              <Icon
                name="house"
                size={24}
              />
            )}
            value={address}
            onChangeText={setAddress}
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
            title="Change Profile"
            onPress={() => submitProfile()}
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
            title="Back to Home"
            onPress={() => {
              navigation.navigate('Home');
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
EditProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Edit Profile',
  headerShown: false,
});

EditProfileScreen.propTypes = {
  navigation: PropTypes.elementType.isRequired,
};
