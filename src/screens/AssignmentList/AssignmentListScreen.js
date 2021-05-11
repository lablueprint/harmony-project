import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, Button,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';
import { List } from 'react-native-paper';

import Firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
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
  const uid = navigation.getParam('uid', null);
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  const [isTeacher, setRole] = useState(false);
  const [finished1, setFinished1] = useState(false);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [incompleteAssignments, setIncompleteAssignments] = useState([]);
  const [completedAssignmentsList, setCompletedAssignmentsList] = useState([]);
  const [incompleteAssignmentsList, setIncompleteAssignmentsList] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);
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
  }, [navigation, rerender]);

  useEffect(() => {
    if (!finished1) {
      return;
    }

    // const uid = navigation.getParam('uid', null);
    const createSubmission = ((userID, postID, body, attachment) => {
      let newStudentsCompleted = [];
      Firestore().collection('assignments').doc(postID)
        .get()
        .then((doc) => {
          newStudentsCompleted = doc.data().studentsSeen;
          newStudentsCompleted.push(userID);
        });

      Firestore().collection('assignments').doc(postID)
        .update({
          studentsCompleted: newStudentsCompleted,
        });

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

    async function setStudentsCompleted(assignmentID, studentsCompletedNew) {
      Firestore().collection('assignments').doc(assignmentID).update({
        studentsCompleted: studentsCompletedNew,
      });
    }

    async function getStudentsCompleted(assignmentID, classroomID) {
      let completedStudents = [];
      let allStudents = [];
      let incompleteStudents = [];

      await Firestore().collection('assignments').doc(assignmentID)
        .get()
        .then((doc) => { completedStudents = doc.data().studentsCompleted; });

      await Firestore().collection('classrooms').doc(classroomID)
        .get()
        .then((doc) => { allStudents = doc.data().studentIDs; });
      incompleteStudents = allStudents.filter((element) => !completedStudents.includes(element));
      return [completedStudents, incompleteStudents];
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
                <>
                  {!isTeacher && !studentsCompleted.includes(uid) && (
                  <Text
                    style={styles.buttonsContainer}
                  >
                    Incomplete
                  </Text>
                  )}
                  {!isTeacher && studentsCompleted.includes(uid) && (
                  <Text
                    style={styles.buttonsContainer}
                  >
                    Complete
                  </Text>
                  )}
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
                        assign: assignment,
                        mode: 'Edit',
                      });
                    }}
                  />
                  )}

                  <Text
                    style={styles.buttonsContainer}
                  >
                    Due Date:
                    {' '}
                    {assignment.dueDate}
                  </Text>

                  <Button
                    title={assignment.doPin ? 'Unpin' : 'Pin'}
                    onPress={async () => {
                      await Firestore().collection('assignments').doc(assignment.id).update({
                        doPin: !assignment.doPin,
                      })
                        .then(() => {
                          setRerender(!rerender);
                          console.log(`Successfully updated doPin to ${!assignment.doPin}`);
                        })
                        .catch((error) => {
                          console.log('Error updating doPin: ', error);
                        });
                    }}
                  />

                  {!isTeacher && (
                  <Button
                    title="Mark as Completed"
                    onPress={async () => {
                      if (!studentsCompleted.includes(uid)) {
                        studentsCompleted.push(uid);
                        await setStudentsCompleted(assignment.id, studentsCompleted);
                        console.log('UPDATED');
                      }
                      setRerender(!rerender);
                    }}
                  />

                  )}
                </>
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
        if (isTeacher) {
          Firestore().collection('assignments')
            .orderBy('doPin', 'desc')
            .orderBy('dueDate', 'asc')
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
        } else {
          Firestore().collection('assignments')
            .orderBy('doPin', 'desc')
            .orderBy('dueDate', 'asc')
            .get()
            .then(async (snapshot) => {
              const assignments = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

              // orders assignments by completion
              for (let i = 0; i < assignments.length; i += 1) {
                if (assignments[i].studentsCompleted.includes(uid)) {
                  const temp = completedAssignments;
                  temp.push(assignments[i]);
                  setCompletedAssignments(temp);
                } else {
                  const temp = incompleteAssignments;
                  temp.push(assignments[i]);
                  setIncompleteAssignments(temp);
                }
              }

              // TODO: MARK AS COMPLETE BUTTON
              const getAssignments = async (allAssigns) => Promise.all(allAssigns.map(
                async (assign) => getSingleAssignment(assign, studentClassroomIDs),
              ));

              async function setLists() {
                let assigns = await getAssignments(completedAssignments);
                setCompletedAssignmentsList(assigns);
                assigns = await getAssignments(incompleteAssignments);
                setIncompleteAssignmentsList(assigns);
              }

              await setLists();
            });
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [finished1, navigation, loadingNewPost, loadingNewComment,
    completedAssignments, incompleteAssignments, rerender]);

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
                  attachments: [],
                  mode: 'Create',
                  assign: null,
                });
              }}
            />
            )}
        </View>
        {errorMessage && <Text>{errorMessage}</Text>}
        {isTeacher && assignmentsList.length !== 0 && (
          <>
            { assignmentsList }
          </>
        )}
        {!isTeacher && incompleteAssignmentsList.length !== 0 && (
        <>
          { incompleteAssignmentsList }
        </>

        )}

        <List.Section>
          <List.Accordion
            title="Completed Assignments"
            expanded={expanded}
            onPress={handlePress}
          >
            {!isTeacher && completedAssignmentsList.length !== 0 && (
            <>
              { completedAssignmentsList }
            </>
            )}
          </List.Accordion>
        </List.Section>

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
