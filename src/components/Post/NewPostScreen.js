/* import React, { useState } from 'react';
import {
  Text, SafeAreaView, ScrollView, Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

export default function NewPostScreen() {
  const [topic, setTopic] = useState('');
  const [post, setPost] = useState('');
  const ref = firestore().collection('posts');

  async function addPost() {
    await ref.add({
      title: topic,
      body: post,
    });
    setTopic('');
    setPost('');
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>All Posts!</Text>
      </ScrollView>
      <TextInput
        placeholder="Topic"
        fontSize={24}
        onChangeText={setTopic}
        value={topic}
      />
      <TextInput
        placeholder="What's on your mind?"
        fontSize={18}
        onChangeText={setPost}
        value={post}
      />
      <Button title="Submit Post" onPress={() => addPost()} />
    </SafeAreaView>
  );
} */

import React, { useState } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

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
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const postRecord = {
      title,
      body,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
      classroomID: null,
      isSubmission: false,
      isPublic: true,
      dueDate: null,
      attachments: null,
      author: firebase.auth().currentUser.uid,
    };
    firestore().collection('posts')
      .doc()
      .set(postRecord)
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
