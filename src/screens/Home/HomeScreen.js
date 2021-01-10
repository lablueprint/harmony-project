/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Alert, TextInput,
} from 'react-native';
import { Button } from 'react-native-elements';
import Firestore, { firebase } from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import UploadFile from '../../components/UploadFile';
import { INITIAL_USER_STATE } from '../../components';

const styles = StyleSheet.create({
  subContainer: {
    marginBottom: 10,
    padding: 10,
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

export default function HomeScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [uid, setUid] = useState(navigation.getParam('uid', null));
  const ref = Firestore().collection('users');
  const [code, setCode] = useState('');

  async function getUserData() {
    try {
      const doc = await ref.doc(uid).get();
      const data = doc.data();
      // Handler for case with nonexistent user entries in Firestore
      setUserState(data);
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
  }, [userState]);

  function onAuthStateChanged(authUser) {
    setUser(authUser);
  }

  // input code, join
  async function joinClassroom() {
    const classRef = Firestore().collection('classrooms');
    const doc = await classRef.doc(code.toLowerCase()).get();
    const classroomInfo = doc.data();
    if (!classroomInfo) {
      Alert.alert(
        'Please input a valid code!',
      );
    } else {
      // currently updates every time you join a classroom
      // in the future this would update only once: immediately upon signup
      classRef.doc(code.toLowerCase()).update({
        students: firebase.firestore.FieldValue.arrayUnion(uid),
      });
      ref.doc(uid).update({
        classroomIds: firebase.firestore.FieldValue.arrayUnion(code.toLowerCase()),
      });
      navigation.navigate('Classroom', { code, classroomInfo, uid });
    }
  }

  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user && !uid) setUid(user.uid);
  }, [user]);

  if (initializing) return null;

  if (!user) {
    return navigation.navigate('SignIn');
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>
        Welcome {user.email}
      </Text>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Profile"
          onPress={() => {
            navigation.navigate('Profile', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="View Evaluation"
          onPress={() => {
            navigation.navigate('Evaluation');
          }}
        />
        <Button
          style={styles.textInput}
          title="GenericForm"
          onPress={() => {
            navigation.navigate('GenericFormDemo', { });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="View Posts"
          onPress={() => {
            navigation.navigate('Post');
          }}
        />
        <UploadFile
          docId="example"
          collection="posts"
        />
      </View>

      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Announcements"
          onPress={() => {
            navigation.navigate('Announcements');
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Assignment List"
          onPress={() => {
            navigation.navigate('AssignmentList');
          }}
        />
      </View>
      {userState && userState.role === 'TEACHER'
        ? (
          <View style={styles.subContainer}>
            <Button
              style={styles.textInput}
              title="Create Classroom"
              onPress={() => {
                navigation.navigate('CreateClassroom', { uid });
                // for now a separate page using this button
              }}
            />
          </View>
        )
        : (
          <View style={styles.subContainer}>
            <TextInput
              placeholder="ABCDEF"
              fontSize={20}
              maxLength={6}
              onChangeText={setCode}
              value={code}
            />
            <Button
              style={styles.textInput}
              title="Join Classroom"
              onPress={() => {
                joinClassroom();
              }}
            />
          </View>
        )}
    </View>
  );
}

// eslint-disable-next-line no-unused-vars
HomeScreen.navigationOptions = ({ navigation }) => ({
  title: 'Home',
  headerRight: () => (
    <Button
      title="Sign Out"
      buttonStyle={{ padding: 5, marginRight: 20 }}
      onPress={() => { Auth().signOut(); }}
    />
  ),
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
