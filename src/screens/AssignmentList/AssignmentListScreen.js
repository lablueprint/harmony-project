import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';

import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';

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
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 10,
    paddingTop: 10,

  },

});

// const screenHandler = ((postID, updatedValue) => {
//   console.log(postID);
//   Firestore().collection('assignments').doc(postID).update({
//     doPin: updatedValue,
//   })
//     .then(() => {
//       console.log(`Successfully updated doPin to ${updatedValue}`);
//     })
//     .catch((error) => {
//       console.log('Error updating doPin: ', error);
//     });
// });

export default function AssignmentListScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const { uid } = Firebase.auth().currentUser;
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  const [isTeacher, setRole] = useState(false);
  const [finished1, setFinished1] = useState(false);

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
              updatedAt: Firebase.firestore.FieldValue.serverTimestamp(),
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
              createdAt: Firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: Firebase.firestore.FieldValue.serverTimestamp(),
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
      if (isTeacher) {
        return ret;
      }
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
      if (isTeacher) {
        return ret;
      }
      await Firestore().collection('submissions').where('authorID', '==', userID).where('assignmentID', '==', postID)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            ret = querySnapshot.docs[0].id;
          }
        });
      return ret;
    }

    async function setStudentsSeen(assignmentID, studentsSeenNew) {
      Firestore().collection('assignments').doc(assignmentID).update({
        studentsSeen: studentsSeenNew,
      });
    }

    async function getStudentsCompleted(assignmentID, classroomID) {
      const completedStudents = [];
      let allStudents = [];

      await Firestore().collection('submissions').where('assignmentID', '==', assignmentID)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            completedStudents.push(doc.data().authorID);
          });
        });
      await Firestore().collection('classrooms').doc(classroomID)
        .get()
        .then((doc) => { allStudents = doc.data().studentIDs; });
      allStudents = allStudents.filter((element) => !completedStudents.includes(element));
      return [completedStudents, allStudents];
    }

    async function getSingleAssignment(assignment, studentClassroomIDs) {
      const hasBeenEval = await isEvaluated(uid, assignment.id);
      const hasBeenSubmitted = await isSubmitted(uid, assignment.id);
      let studentsSeenTemp = [];
      await Firestore().collection('assignments').doc(assignment.id)
        .get()
        .then((doc) => { studentsSeenTemp = doc.data().studentsSeen; });

      const studentsStatus = await getStudentsCompleted(assignment.id, assignment.classroomID);
      const studentsCompleted = studentsStatus[0];
      const studentsNotCompleted = studentsStatus[1];

      console.log(hasBeenEval);
      console.log(hasBeenSubmitted);

      // Only returns assignments with classroomIDs in classroomIDsList
      if (studentClassroomIDs.includes(assignment.classroomID)) {
        return (
          <>
            <TouchableOpacity
              onPress={async () => {
                if (!isTeacher && !studentsSeenTemp.includes(uid)) {
                  studentsSeenTemp.push(uid);
                  await setStudentsSeen(assignment.id, studentsSeenTemp);
                  console.log('UPDATED');
                }
                navigation.navigate('Assignment', {
                  assignment,
                  isTeacher,
                  hasBeenEval,
                  hasBeenSubmitted,
                  loadingNewComment,
                  setLoadingNewComment,
                  rerender,
                  setRerender,
                  uid,
                  createSubmission,

                });
              }}
            >
              <Card
                title={assignment.title}
                titleStyle={{
                  textAlign: 'left',
                }}
                containerStyle={{ padding: 20 }}
              >
                {isTeacher && (
                <Text
                  style={styles.buttonsContainer}
                  onPress={() => {
                    navigation.navigate('StudentNames', {
                      students: studentsSeenTemp,
                    });
                  }}
                >
                  Seen:
                  {' '}
                  {studentsSeenTemp.length}
                </Text>
                )}

                {isTeacher && (
                <Text
                  style={styles.buttonsContainer}
                  onPress={() => {
                    navigation.navigate('StudentNames', {
                      students: studentsCompleted,
                    });
                  }}
                >
                  Completed:
                  {' '}
                  {studentsCompleted.length}
                </Text>
                )}

                {isTeacher && (
                <Text
                  style={styles.buttonsContainer}
                  onPress={() => {
                    navigation.navigate('StudentNames', {
                      students: studentsNotCompleted,
                    });
                  }}
                >
                  Not Completed:
                  {' '}
                  {studentsNotCompleted.length}
                </Text>
                )}

                {isTeacher && (
                <Button
                  style={styles.buttonsContainer}
                  title="Edit"
                  onPress={() => {
                    navigation.navigate('NewAssignment', {
                      setLoad: setLoadingNewPost,
                      currentLoad: loadingNewPost,
                      uid,
                      title: assignment.title,
                      body: assignment.body,
                      attachments: assignment.attachments,
                    });
                  }}
                />
                )}
              </Card>
            </TouchableOpacity>

          </>
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
        Firestore().collection('assignments')
          .orderBy('doPin', 'desc')
          .orderBy('updatedAt', 'desc')
          .get()
          .then((snapshot) => {
            const assignments = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            const getAssignments = async () => Promise.all(assignments.map(
              async (assignment) => getSingleAssignment(assignment, studentClassroomIDs),
            ));
            async function setAssignments() {
              const assigns = await getAssignments();
              setAssignmentsList(assigns);
            }
            setAssignments();
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [finished1, navigation, loadingNewPost, loadingNewComment, rerender]);

  return (
    <View>
      <ScrollView>
        <View>
          {isTeacher
            && (

            <Button
              title="Create An Assignment"
              onPress={() => {
                navigation.navigate('NewAssignment', {
                  setLoad: setLoadingNewPost,
                  currentLoad: loadingNewPost,
                  uid,
                  title: '',
                  body: '',
                  attachments: '',
                });
              }}
            />
            )}
        </View>
        {errorMessage && <Text>{errorMessage}</Text>}
        {assignmentsList}

      </ScrollView>
    </View>
  );
}

AssignmentListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
