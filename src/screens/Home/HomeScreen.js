/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Alert, TextInput,
} from 'react-native';
import { Button } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
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

// navigation MUST INCLUDE: uid
export default function HomeScreen({ navigation }) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [uid, setUid] = useState(navigation.getParam('uid', null));
  const [code, setCode] = useState('');

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
      // if user is a student or teacher, add their id to the classroom
      if (userState.role === 'STUDENT') {
        classRef.doc(code.toLowerCase()).update({
          studentIDs: Firestore.FieldValue.arrayUnion(user.uid),
        });
      }
      if (userState.role === 'TEACHER') {
        classRef.doc(code.toLowerCase()).update({
          teacherIDs: Firestore.FieldValue.arrayUnion(user.uid),
        });
      }
      navigation.navigate('Classroom', { code, classroomInfo, uid });
    }
  }

  function onAuthStateChanged(authUser) {
    setUser(authUser);
    if (initializing) setInitializing(false);
  }

  // check signin on mount
  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if signed in, set uid
  useEffect(() => {
    if (user && !uid) setUid(user.uid);
  }, [user]);

  useEffect(() => {
    // if the user is signed in, then fetch its data
    if (uid) {
      Firestore().collection('users')
        .doc(uid)
        .get()
        .then((document) => {
          if (document.exists) {
            return document.data();
          }
          return null;
        })
        .then((data) => {
          setUserState(data);
        })
        .catch((e) => {
          Alert.alert(e.message);
        });
      // force teacher to create classroom on login
      /* if (userState && userState.role && userState.role === 'TEACHER'
      && userState.classroomIds.length === 0) {
        navigation.navigate('CreateClassroom', { uid });
      } */
    }
  }, [uid]);

  // if loading user data, return null
  if (initializing) return null;

  // if not logged in, unmount and go to signin page
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

      </View>

      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Announcements"
          onPress={() => {
            navigation.navigate('Announcements', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Assignment List"
          onPress={() => {
            navigation.navigate('AssignmentList', { uid });
          }}
        />
      </View>
      <View style={styles.subContainer}>
        <Button
          style={styles.textInput}
          title="Notifications"
          onPress={() => {
            navigation.navigate('Notifications', { uid });
          }}
        />
      </View>
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
      {userState && userState.role === 'TEACHER'
        && (
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
