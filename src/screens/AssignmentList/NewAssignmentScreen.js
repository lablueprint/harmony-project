import React, { useEffect, useState } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Calendar } from 'react-native-calendars';
import {notifyStudents} from '../Notifications/NotificationsScreen';

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
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const [attachment, setAttachment] = useState(navigation.getParam('attachments')[0]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDueDate] = useState('');
  const mainScreenLoadStatus = navigation.getParam('currentLoad');
  const reloadMainScreen = navigation.getParam('setLoad');
  const [classroom, setClassroomID] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [studentIDs, setStudentIDs] = useState([]);

  const [initializing, setInitializing] = useState(true);
  const uid = navigation.getParam('uid', null);

  useEffect(() => {
    console.log('ONE');
    try {
      Firestore().collection('users').doc(uid).get().then((doc) => {
        const data = doc.data();
        setClassroomID(data.classroomIds[0]);
        setTeacherName(data.name);
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

  /* When an assignment has been created, create a notification for every student in the class */
  /*
  const notifyStudents = () => {
    if(studentIDs.length > 0 && teacherName !== '') {
      studentIDs.forEach(async (studentID) => {
        await Firestore().collection('notifications').add({
          classroomID: classroom, 
          createdAt: Firestore.Timestamp.now(), 
          message: teacherName + " has created a new To Do '" + title + "'", 
          page: "TODO", 
          userID: studentID
        })
      })
    }
  }
  */

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

      notifyStudents(classroom, teacherName + " has created a new To Do '" + title + "'", "TODO");
  };

  return (
    <View style={styles.container}>
      {errorMessage && <Text>{errorMessage}</Text>}
      <View style={styles.tweetContainer}>
        <Text padding={10}>
          Title
        </Text>
        <TextInput
          placeholder="Topic"
          padding={10}
          fontSize={24}
          onChangeText={setTitle}
          value={title}
        />
        <Text padding={10}>
          Attachment
        </Text>
        <TextInput
          placeholder="Attachment URL"
          padding={10}
          value={attachment}
          onChangeText={(content) => setAttachment(content)}
        />
        <Text padding={10}>
          Description
        </Text>
        <TextInput
          autoFocus
          padding={10}
          placeholder="What's on your mind?"
          multiline
          value={body}
          onChangeText={(content) => setBody(content)}
        />
        <Text padding={10}>
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
