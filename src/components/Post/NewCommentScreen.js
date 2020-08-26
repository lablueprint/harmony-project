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

export default function NewCommentScreen({ navigation }) {
  const postId = navigation.getParam('id', 'No id Found');
  const [body, setBody] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const commentRecord = {
      postId,
      body,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      author: Firebase.auth().currentUser.uid,
      title: 'Comment',
    };
    Firestore().collection('comments')
      .add(commentRecord)
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
