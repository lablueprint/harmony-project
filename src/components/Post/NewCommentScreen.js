import React, { useState, useEffect } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { notifyAuthor } from '../../screens/Notifications/NotificationsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
  },
});

export default function NewCommentScreen({ navigation }) {
  const uid = navigation.getParam('uid', null);
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const postId = navigation.getParam('postid', '');
  const mainScreenLoadStatus = navigation.getParam('currentLoad');
  const reloadMainScreen = navigation.getParam('setLoad');
  const [commenterName, setCommenterName] = useState('');

  useEffect(() => {
    Firestore().collection('users').doc(uid).get().then((doc) => {
      const data = doc.data();
      if(data) {
        setCommenterName(data.name);
      }
    });
  });

  const handleSubmit = () => {
    setLoading(true);
    // reloadMainScreen(!mainScreenLoadStatus);
  
    const commentRecord = {
      postId,
      body,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      author: uid,
      title: 'Comment',
      likedBy: {},
    };

    Firestore().collection('comments')
      .add(commentRecord)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });

    notifyAuthor(postId, commenterName + " has commented on your post ", "BULLETIN");
  };

  return (
    <View style={styles.container}>
      {errorMessage && <Text>{errorMessage}</Text>}
      <View style={styles.tweetContainer}>
        <TextInput
          autoFocus
          fontSize={16}
          placeholder="Enter your comment..."
          multiline
          value={body}
          onChangeText={(content) => setBody(content)}
        />
      </View>
      {loading && <ActivityIndicator />}
      <Button disabled={loading} title="Comment on Post!" onPress={handleSubmit} />
    </View>
  );
}

NewCommentScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

NewCommentScreen.navigationOptions = {
  title: 'New Comment',
};
