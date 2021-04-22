import React, { useState, useEffect } from 'react';
import {
  View, Button, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import UploadFile from '../../components/UploadFile';
import {notifyStudents} from '../Notifications/NotificationsScreen';
import Firestore from '@react-native-firebase/firestore';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
  },
});

export default function NewAnnouncementScreen({ navigation }) {
  // const [title, setTitle] = useState('');
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const mainScreenLoadStatus = navigation.getParam('currentLoad');
  // const reloadMainScreen = navigation.getParam('setLoad');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const [attachment, setAttachment] = useState('');
  const uid = navigation.getParam('uid', null);
  const postID = navigation.getParam('postID');
  const collection = navigation.getParam('collection');
  const buttonTitle = navigation.getParam('buttonTitle', 'Submit');
  const [classroom, setClassroomID] = useState('');
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
      Firestore().collection('users').doc(uid).get().then((doc) => {
          const data = doc.data();
          setClassroomID(data.classroomIds[0]); 
          setTeacherName(data.name);
      })
      .catch((e) => {
          console.warn(e);
      })
  });

  const handleSubmit = async () => {
      navigation.goBack();
      await Firestore().collection('announcements').
      add({
          title, 
          body, 
          attachments: attachment,
          createdAt: Firestore.Timestamp.now(),
          updatedAt: Firestore.Timestamp.now(),
          classroomID: classroom,
          author: uid, 
          likedBy: []
      })
      notifyStudents(classroom, teacherName + " has created a new post '" + title + "'", "BULLETIN");
  }

  return (
    <View style={styles.container}>
      {/* {errorMessage && <Text>{errorMessage}</Text>} */}
      <View style={styles.tweetContainer}>
        <TextInput
          placeholder="Topic"
          fontSize={24}
          onChangeText={setTitle}
          value={title}
        />
        <TextInput
          autoFocus
          placeholder="What's on your mind?"
          multiline
          value={body}
          onChangeText={(content) => setBody(content)}
        />
        <UploadFile
          setAttachment={setAttachment}
          userId={uid}
          postId={postID}
          collection={collection}
        />
      </View>
      <Button
        // disabled={loading}
        title={buttonTitle}
        onPress={handleSubmit}
      />
    </View>
  );
}

NewAnnouncementScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

NewAnnouncementScreen.navigationOptions = {
  title: 'New Announcement',
};
