import React, { useState } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
  },
});

export default function NewPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const postRecord = {
      title,
      body,
      attachment,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      classroomID: null,
      isSubmission: false,
      isPublic: true,
      dueDate: null,
      author: Firebase.auth().currentUser.uid,
    };
    Firestore().collection('posts')
      .add(postRecord)
      .then(() => {
        setLoading(false);
        navigation.navigate('Post');
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
      </View>
      {loading && <ActivityIndicator />}
      <Button disabled={loading} title="Make a Post!" onPress={handleSubmit} />
    </View>
  );
}

NewPostScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

NewPostScreen.navigationOptions = {
  title: 'New Post',
};
