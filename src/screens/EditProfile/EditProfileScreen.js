/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, ActivityIndicator, View, Text, Alert, Picker,
} from 'react-native';
import { Button, Input } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE, roles } from '../../components';

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
  const uid = navigation.getParam('uid', null);
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);

  const [showLoading, setShowLoading] = useState(false);

  async function getUserData() {
    try {
      // If we somehow get to this screen with no uid passed, go back to homescreen
      if (!uid) navigation.navigate('Home');
      const doc = await ref.doc(uid).get();
      const data = doc.data();
      // Handler for case with nonexistent user entries in Firestore
      if (!data) {
        await ref.doc(uid).set({
          ...userState,
          createdAt: Firestore.FieldValue.serverTimestamp(),
          updatedAt: Firestore.FieldValue.serverTimestamp(),
        });
      } else {
        setUserState(data);
      }
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
      await ref.doc(uid).update({
        ...userState,
        updatedAt: Firestore.FieldValue.serverTimestamp(),
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
            value={userState.name}
            onChangeText={(text) => {
              setUserState({
                ...userState,
                name: text,
              });
            }}
          />
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
            placeholder="Address"
            value={userState.address}
            onChangeText={(text) => {
              setUserState({
                ...userState,
                address: text,
              });
            }}
          />
        </View>
        <View style={styles.subContainer}>
          <Picker
            selectedValue={userState.role}
            style={styles.textInput}
            onValueChange={(value) => {
              setUserState({
                ...userState,
                role: value,
              });
            }}
          >
            <Picker.Item label="Student" value={roles.student} />
            <Picker.Item label="Parent" value={roles.parent} />
            <Picker.Item label="Teacher" value={roles.teacher} />
          </Picker>
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
            title="Save Profile"
            onPress={() => submitProfile()}
          />
        </View>
        <View style={styles.subContainer}>
          <Button
            style={styles.textInput}
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
