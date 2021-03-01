import React, { useEffect, useState } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Calendar } from 'react-native-calendars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  postContainer: {
    flex: 1,

  },
});

export default function NewAssignmentScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDueDate] = useState('');
  const mainScreenLoadStatus = navigation.getParam('currentLoad');
  const reloadMainScreen = navigation.getParam('setLoad');
  const [classroom, setClassroomID] = useState('');

  const [initializing, setInitializing] = useState(true);
  const uid = navigation.getParam('uid', null);

  const ref = Firestore().collection('users');

  useEffect(() => {
    console.log('ONE');
    try {
      ref.doc(uid).get().then((doc) => {
        const data = doc.data();
        setClassroomID(data.classroomIds[0]);
      });
      if (initializing) setInitializing(false);
    } catch (e) {
      setInitializing(false);
      Alert.alert(
        e.message,
      );
    }
  }, []);

  if (initializing) return null;

  const handleSubmit = () => {
    setLoading(true);
    reloadMainScreen(!mainScreenLoadStatus);

    const assignmentRecord = {
      title,
      body,
      attachments: attachment,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      classroomID: classroom,
      hasBeenGraded: false,
      dueDate: date.dateString,
      author: Firebase.auth().currentUser.uid,
      likedBy: {},
    };
    Firestore().collection('assignments')
      .add(assignmentRecord)
      .then(() => {
        setLoading(false);

        navigation.navigate('AssignmentList', { uid });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      {errorMessage && <Text>{errorMessage}</Text>}
      <View style={styles.tweetContainer}>
        <TextInput
          placeholder="Topic"
          fontSize={24}
          onChangeText={setTitle}
          value={title}
        />
        <TextInput
          placeholder="Attachment URL"
          value={attachment}
          onChangeText={(content) => setAttachment(content)}
        />
        <TextInput
          autoFocus
          placeholder="What's on your mind?"
          multiline
          value={body}
          onChangeText={(content) => setBody(content)}
        />
        <Text>
          Choose a Due Date
        </Text>

        <Calendar
          onDayPress={(day) => { setDueDate(day); }}

        />

      </View>
      {loading && <ActivityIndicator />}
      <Button disabled={loading} title="Create a New Assignment" onPress={handleSubmit} />
    </View>
  );
}

NewAssignmentScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

NewAssignmentScreen.navigationOptions = {
  title: 'New Assignment',
};
