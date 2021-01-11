import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button, Alert,
} from 'react-native';

import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default function AssignmentListScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);
  const [isTeacher, setRole] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [loadingNewPost, setLoadingNewPost] = useState(false);

  const uid = navigation.getParam('uid', null);
  const ref = Firestore().collection('users');

  async function getUserData() {
    try {
      ref.doc(uid).get().then((doc) => {
        const data = doc.data();
        if (data.role === 'TEACHER') {
          setRole(true);
        }
      });

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
    Firestore().collection('assignments')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPostsList(posts.map((assignment) => {
          const date = assignment.createdAt.toDate();
          return (
            <View style={styles.container} key={assignment.id}>
              <Post
                key={assignment.id}
                name={assignment.username}
                title={assignment.title}
                createdAt={date.toTimeString()}
                date={assignment.dueDate}
                attachment={assignment.attachments}
                body={assignment.body}
              >
                {assignment.body}
              </Post>
              <Button
                styles={styles.container}
                title="Comment on Assignment"
                onPress={() => {
                  navigation.navigate('NewComment', { id: assignment.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                }}
              />
            </View>
          );
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [loadingNewPost]);

  if (initializing) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.welcomeMessage}>Assignments List</Text>
        {isTeacher
        && (
        <Button
          title="Create An Assignment"
          onPress={() => {
            navigation.navigate('NewAssignment', { setLoad: setLoadingNewPost, currentLoad: loadingNewPost });
          }}
        />
        )}
        {errorMessage && <Text>{errorMessage}</Text>}
        {postsList}
      </ScrollView>
    </View>
  );
}

AssignmentListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,

  }).isRequired,
};
