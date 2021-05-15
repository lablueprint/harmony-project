// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Firebase from '@react-native-firebase/app';
import {
  // eslint-disable-next-line no-unused-vars
  View, Button, Text, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  container: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
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
    paddingBottom: 75,

  },
});

export default function AssignmentScreen({ route, navigation }) {
  const {
    post,
    isTeacher,
    hasBeenEval,
    hasBeenSubmitted,
    loadingNewComment,
    setLoadingNewComment,
    rerender,
    setRerender,
    createSubmission,
  } = route.params;
  const uid = Firebase.auth().currentUser;
  const date = post.createdAt.toDate();

  return (
    <ScrollView style={styles.container} key={post.id}>
      <Post
        id={post.id}
        name={post.username}
        title={post.title}
        createdAt={date.toTimeString()}
        date={date.toDateString()}
        attachments={post.attachments}
        collection="assignments"
        body={post.body}
        pin={post.doPin}
        rerender={rerender}
        setRerender={setRerender}
      >
        {post.body}
      </Post>
      <View style={styles.buttonsContainer}>
        {!isTeacher && !hasBeenEval && hasBeenSubmitted
              && (
                <>
                  <Text
                    style={styles.buttons}
                    onPress={() => {
                      navigation.navigate('NewComment', { id: post.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                    }}
                  >
                    Comment on Assignment
                  </Text>
                  <Text
                    style={styles.buttons}
                    onPress={() => {
                      navigation.navigate('NewPost', {
                        userID: uid,
                        postID: post.id,
                        collection: 'recordings',
                        title1: post.title,
                        handleSubmit: createSubmission,
                      });
                    }}
                  >
                    Upload Submission
                  </Text>
                  {/* TODO: View submissions */}
                  <Text
                    style={styles.buttons}
                    onPress={() => {

                    }}
                  >
                    View Submission
                  </Text>

                </>
              )}
        {!isTeacher && !hasBeenEval && !hasBeenSubmitted
              && (
                <>
                  <Text
                    style={styles.buttons}
                    onPress={() => {
                      navigation.navigate('NewComment', { id: post.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                    }}
                  >
                    Comment
                  </Text>
                  <Text
                    style={styles.buttons}
                    onPress={() => {
                      navigation.navigate('NewPost', {
                        userID: uid,
                        postID: post.id,
                        collection: 'recordings',
                        title1: `${post.title} Submission`,
                        handleSubmit: createSubmission,
                      });
                    }}
                  >
                    Upload Submission
                  </Text>
                </>
              )}
        {!isTeacher && hasBeenEval
            && (
              <>
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('NewComment', { id: post.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                  }}
                >
                  Comment
                </Text>
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('Evaluation', {
                      uid: hasBeenEval,
                    });
                  }}
                >
                  View Evaluation
                </Text>

              </>
            )}
        {isTeacher
            && (
              <>
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('NewComment', { id: post.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                  }}
                >
                  Comment
                </Text>
                <Text
                  style={styles.buttons}
                  onPress={() => {
                    navigation.navigate('Submissions', {
                      a: post.id,
                      c: post.classroomID,
                    });
                  }}
                >
                  View Submissions
                </Text>
              </>
            )}
      </View>
    </ScrollView>
  );
}

AssignmentScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};
