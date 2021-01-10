import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import {
  Text, View, StyleSheet, Alert, Button, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import Firestore, { firebase } from '@react-native-firebase/firestore';
// import Post from './Post';
import { INITIAL_USER_STATE } from '../../components';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
});

export default function CreateClassroomScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [initializing, setInitializing] = useState(true);
  const uid = navigation.getParam('uid', null);
  const ref = Firestore().collection('users');
  const [userState, setUserState] = useState(INITIAL_USER_STATE);
  const [errorMessage, setErrorMessage] = useState(null);

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
  }, [userState]);

  // creates classroomID
  function makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function create() {
    const code = makeid(6);
    const classroomInfo = {
      classTitle: title,
      classTime: null, // text field?? idk
      createdAt: Firestore.Timestamp.now(),
      startDate: null,
      endDate: null,
      meetDays: [],
      students: [],
      teachers: [uid],
      term: [],
      type: null,
    };
    ref.doc(uid).update({
      classroomIds: firebase.firestore.FieldValue.arrayUnion(code.toLowerCase()),
    });
    Firestore().collection('classrooms')
      .doc(code).set(classroomInfo)
      .then(() => {
        navigation.navigate('Classroom', { code, classroomInfo, uid });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <View style={styles.container}>
      {errorMessage && <Text>{errorMessage}</Text>}
      {/*
      need:
      numeric input
      date input 1
      date input 2
      picker input? for days
      num input
      text input for other teachers?
      selector input?
      text input
      */}
      <Text>
        Classroom Title:
      </Text>
      <TextInput
        placeholder="Michael's Class"
        fontSize={20}
        onChangeText={setTitle}
        value={title}
      />
      <Button
        style={styles.textInput}
        title="Create"
        onPress={() => {
          create();
        }}
      />
    </View>
  );
}

CreateClassroomScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
