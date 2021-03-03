import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button,
} from 'react-native';

import Firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({

  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,

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
    fontSize: 10,
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
    console.log('ONE');
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
  }, [navigation]);

  useEffect(() => {
    if (!finished1) {
      return;
    }

    // const uid = navigation.getParam('uid', null);
    const createSubmission = ((userID, postID, body, attachment) => {
    // TODO: see if doc already exists. If it does, update the body, attachment, and updatedAt
      console.log(userID);
      Firestore().collection('submissions').where('authorID', '==', userID).where('assignmentID', '==', postID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) { // update if submission exists
          // querySnapshot.forEach((doc) => console.log(doc));
            const docID = querySnapshot.docs[0].id;
            Firestore().collection('submissions').doc(docID).update({
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              body,
              attachment,
            })
              .then(() => {
                console.log('Successfully updated document!');
              })
              .catch((error) => {
                console.log('Submission update failed');
                console.log(error);
              });
          } else { // do this to add submission if it doesn't exist
            Firestore().collection('submissions').add({
              authorID: userID,
              assignmentID: postID,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              body,
              attachment,
              hasReceivedFeedback: false,
            }).then(() => {
              console.log('Successfully inserted document!');
            })
              .catch((error) => {
                console.log('Submission failed ):');
                console.log(error);
              });
          }
        });
    });

    async function isEvaluated(userID, postID) {
      let ret = null;
      await Firestore().collection('evaluations').where('studentID', '==', userID).where('assignmentID', '==', postID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            ret = querySnapshot.docs[0].id;
          }
        });
      return ret;
    }

    async function isSubmitted(userID, postID) {
      let ret = null;
      await Firestore().collection('submissions').where('authorID', '==', userID).where('assignmentID', '==', postID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            ret = querySnapshot.docs[0].id;
          }
        });
      return ret;
    }

    async function getSinglePost(post, studentClassroomIDs) {
      const date = post.createdAt.toDate();
      const hasBeenEval = await isEvaluated(uid, post.id);
      const hasBeenSubmitted = await isSubmitted(uid, post.id);
      console.log(hasBeenEval);

      console.log(hasBeenSubmitted);

      // Only returns assignments with classroomIDs in classroomIDsList
      if (studentClassroomIDs.includes(post.classroomID)) {
        return (
          <View style={styles.container} key={post.id}>
            <Post
              key={post.id}
              name={post.username}
              title={post.title}
              createdAt={date.toTimeString()}
              date={date.toDateString()}
              attachment={post.attachment}
              body={post.body}
              loadingNewComment={loadingNewComment}
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
                              title: post.title,
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
                        Comment on Assignment
                      </Text>
                      <Text
                        style={styles.buttons}
                        onPress={() => {
                          navigation.navigate('NewPost', {
                            userID: uid,
                            postID: post.id,
                            collection: 'recordings',
                            title: post.title,
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
                        Comment on Assignment
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
                        Comment on Assignment
                      </Text>
                      <Text
                        style={styles.buttons}
                        onPress={() => {
                          navigation.navigate('Submissions', {
                            assignment: post.id,
                            classroom: post.classroomID,
                          });
                        }}
                      >
                        View Submissions
                      </Text>
                    </>
                  )}
            </View>

          </View>
        );
      }
      return null;
    }

    // Gets all the classrooms
    Firestore().collection('classrooms').get()
      .then((snapshot) => {
        const studentClassroomIDs = []; // array of all classrooms a student is in
        const classrooms = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        for (let i = 0; i < classrooms.length; i += 1) {
          if (classrooms[i].studentIDs.includes(uid)) {
            studentClassroomIDs.push(classrooms[i].id);
          }
        }
        console.log(studentClassroomIDs);
        return studentClassroomIDs;
      })
      .then((studentClassroomIDs) => {
        // Gets all the assignments
        Firestore().collection('assignments').limit(6)
          .orderBy('createdAt', 'desc')
          .get()
          .then((snapshot) => {
            // This creates an object for each document
            const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            const getPosts = async () => Promise.all(posts.map(
              async (post) => getSinglePost(post, studentClassroomIDs),
            ));
            async function setPosts() {
              const postList = await getPosts();
              setPostsList(postList);
            }
            setPosts();
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [finished1, navigation, loadingNewComment]);

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
        {/* <Button
          style={styles.textInput}
          title="View Posts"
          onPress={() => {
            navigation.navigate('Post');
          }}
        /> */}
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
