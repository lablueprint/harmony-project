import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button,
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
    padding: 10,

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
  buttons:
  {
    color: 'blue',
    paddingLeft: 35,
    fontSize: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',

  },
});

export default function AssignmentListScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);
  // const [initializing, setInitializing] = useState(true);
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  const [isTeacher, setRole] = useState(false);
  const [finished1, setFinished1] = useState(false);

  const uid = navigation.getParam('uid', null);
  useEffect(() => {
    async function getUserData() {
      Firestore().collection('users').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          if (data.role === 'TEACHER') {
            setRole(true);
          }
        })
        .then(() => {
          setFinished1(true);
        });
    }
    getUserData();
  }, []);

  useEffect(() => {
    if (!finished1) {
      return;
    }
    console.log('ONE');
    Firestore().collection('assignments')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPostsList(posts.map((assignment) => {
          const date = assignment.createdAt.toDate();
          return (
            <View style={styles.sectionContainer} key={assignment.id}>
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
              <View style={styles.buttonsContainer}>
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('NewComment', { id: assignment.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                  }}
                >
                  Comment on Assignment
                </Text>
                {isTeacher
                && (
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('Submissions', {
                      assignment: assignment.id,
                      classroom: assignment.classroomID,
                    });
                  }}
                >
                  View Submissions
                </Text>
                )}
              </View>
            </View>
          );
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [navigation, loadingNewComment, finished1]);

  // if (initializing) return null;

  return (
    <View>
      <ScrollView>
        {isTeacher
        && (
        <Button
          title="Create An Assignment"
          onPress={() => {
            navigation.navigate('NewAssignment', { setLoad: setLoadingNewPost, currentLoad: loadingNewPost, uid });
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
