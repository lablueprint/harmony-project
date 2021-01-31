import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Alert,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
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
    height: 550,
    padding: 50,
  },
  subContainerText: {
    marginBottom: 5,
    padding: 5,
  },
  subContainerButton: {
    marginBottom: 15,
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
  text: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

// navigation MUST INCLUDE: uid
export default function ProfileScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const uid = navigation.getParam('uid', null);
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);

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
  });

  // const submitProfile = async () => {
  //   setShowLoading(true);
  //   try {
  //     await ref.doc(uid).update({
  //       ...userState,
  //       updatedAt: Firestore.FieldValue.serverTimestamp(),
  //     });
  //     setShowLoading(false);
  //   } catch (e) {
  //     setShowLoading(false);
  //     Alert.alert(
  //       e.message,
  //     );
  //   }
  // };

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.subContainerText}>
          <Text h4>{userState.name}</Text>
        </View>
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Edit Profile"
            onPress={() => {
              navigation.navigate('EditProfile', { uid });
            }}
          />
        </View>
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Settings"
          />
        </View>
        <View style={styles.subContainerText}>
          <Text h4>Current Classes</Text>
          <Text style={styles.text}>blah blah</Text>
        </View>
        <View style={styles.subContainerText}>
          <Text h4>Instrument Rentals</Text>
          <Text style={styles.text}>blah blah</Text>
        </View>
        <View style={styles.subContainerText}>
          <Text h4>Forms</Text>
          <Text style={styles.text}>blah blah</Text>
        </View>
        {/* <View style={styles.subContainer}>
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
        </View> */}
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Back to Home"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        </View>
      </View>
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
ProfileScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profile',
  headerShown: false,
});

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
