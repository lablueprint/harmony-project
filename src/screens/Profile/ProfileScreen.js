/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Alert, Image,
} from 'react-native';
import { Button, Text } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import Firebase from '@react-native-firebase/app';
import { INITIAL_USER_STATE } from '../../components';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
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
  const [loading, setLoading] = useState(true);
  // const [edit, toggleEdit] = useState(false);
  const { uid } = Firebase.auth().currentUser;
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  // const [newState, setNewState] = useState(INITIAL_USER_STATE);

  useEffect(() => {
    // if the user is signed in, then fetch its data
    function fetchData() {
      if (uid) {
        ref.doc(uid).get()
          .then((document) => {
            if (document.exists) {
              return document.data();
            }
            return null;
          })
          .then((data) => {
            setUserState(data);
            // setNewState(data);
            if (loading) setLoading(false);
          })
          .catch((e) => {
            Alert.alert(e.message);
          });
      }
    }

    navigation.addListener('focus', () => {
      fetchData();
    });
  }, [uid]);

  /* function saveProfile() {

  } */

  if (loading) return null;

  // if not logged in, unmount and go to signin page
  if (!uid) {
    return navigation.navigate('SignIn');
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {/* profile pic */}
        {/* edit ? input fields : texts */}
        {userState.profilePic !== ''
        && <Image style={{ display: 'flex', height: 100, width: 100 }} source={{ uri: userState.profilePic }} />}
        <View style={styles.subContainerText}>
          <Text h4>{`${userState.firstName} ${userState.lastName}`}</Text>
        </View>
        <View style={styles.subContainerText}>
          <Text>{`Date of Birth: ${userState.dob}`}</Text>
        </View>
        <View style={styles.subContainerText}>
          <Text>{`Grade: ${userState.gradeLevel}`}</Text>
        </View>
        <View style={styles.subContainerText}>
          <Text>{`Instruments: ${userState.instruments}`}</Text>
        </View>
        {/* edit ? (
          <View style={styles.subContainerButton}>
            <Button
              style={styles.textInput}
              title="Save"
              onPress={() => {
                saveProfile();
              }}
            />
          </View>
        ) : (
          <View style={styles.subContainerButton}>
            <Button
              style={styles.textInput}
              title="Edit Profile"
              onPress={() => {
                toggleEdit(true);
              }}
            />
          </View>
        ) */}
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Edit Profile"
            onPress={() => {
              navigation.navigate('EditProfile', { uid });
              setLoading(true);
            }}
          />
        </View>
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Settings"
            onPress={() => {
              // route to notification settings page
            }}
          />
        </View>
        <View style={styles.subContainerButton}>
          <Button
            title="Sign Out"
            onPress={() => { Auth().signOut(); }}
            style={styles.textInput}
          />
        </View>
        {/* REMOVE THESE LATER ONCE WE HAVE NAVBAR */}
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Back to Home"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        </View>
        <View style={styles.subContainerButton}>
          <Button
            style={styles.textInput}
            title="Back to Landing"
            onPress={() => {
              navigation.navigate('Load');
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
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};
