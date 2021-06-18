import { ScrollView } from 'react-native-gesture-handler';
import React, { useState, useEffect, useContext } from 'react';
import {
  Text, View, StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import { List, IconButton, FAB } from 'react-native-paper';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';
import ClassroomContext from '../../context/ClassroomContext';

const styles = StyleSheet.create({
  fab: {
    position: 'relative',
    zIndex: -1,
    color: 'white',
    width: '32%',
    backgroundColor: '#8e4f97',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 140,
  },
  buttonText_1: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonText_2: {
    color: '#323232',
    fontSize: 16,
  },
  buttonText_3: {
    color: '#8e4f97',
    fontSize: 12,
    fontWeight: '500',
  },
  button_1: {
    backgroundColor: 'transparent',
    borderRadius: 40,
    width: 125,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  button_2: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 29,
    width: 90,
    paddingBottom: 5,
    borderColor: '#8e4f97',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginLeft: 12,
  },
  button_3: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 31,
    width: 130,
    paddingBottom: 5,
    borderColor: '#8e4f97',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginLeft: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    paddingTop: 15,
    paddingLeft: 15,
    color: '#323232',
    borderRadius: 25,
    fontSize: 22,
    fontFamily: 'Helvetica',
    borderBottomWidth: 2.5,
    borderColor: 'grey',
    alignSelf: 'flex-start',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop: 12,
    marginBottom: 5,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    width: '95%',
  },
  icons: {
    position: 'absolute',
    marginLeft: 350,
    alignSelf: 'flex-end',
  },
  dueDate: {
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 2,
    marginLeft: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  students: {
    paddingLeft: 5,
    paddingTop: 2,
    paddingBottom: 3,
    margin: 2,
    borderRadius: 20,
    marginLeft: 12,
    backgroundColor: '#F8F7F7',
  },
  buttonsContainer: {
    alignSelf: 'center',
    paddingLeft: 5,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#F8F7F7',
    borderRadius: 20,
    margin: 5,
    marginLeft: 15,
    width: '37%',
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

/**
 * The AssignmentListScreen is where the students and teachers can view all the class to-do's.
 * @public
 * @memberOf Screens
 * @param {string} navigation
 * - The stack navigator that allows the aphp to transition between screens
 * @returns The AssignmentListScreen
 */
export default function AssignmentListScreen({ navigation }) {
  const { uid } = Firebase.auth().currentUser;
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
  // eslint-disable-next-line
  const { classroom, setClassroom } = useContext(ClassroomContext);
  const studentClassroomIDs = [classroom];

  const handlePress = () => setExpanded(!expanded);
  useEffect(() => {
    console.log('ONE');
    console.log(classroom);
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
  }, [navigation, rerender, classroom]);

  useEffect(() => {
    if (!finished1) {
      return;
    }

    // const uid = navigation.getParam('uid', null);
    async function createSubmission(userID, postID, body, attachment) {
      let newStudentsCompleted = [];
      await Firestore().collection('assignments').doc(postID)
        .get()
        .then((doc) => {
          newStudentsCompleted = doc.data().studentsSeen;
          newStudentsCompleted.push(userID);
        });

      await Firestore().collection('assignments').doc(postID)
        .update({
          studentsCompleted: newStudentsCompleted,
        });

      await Firestore().collection('submissions').where('authorID', '==', userID).where('assignmentID', '==', postID)
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
      // navigation.navigate('AssignmentList');
    }

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
        .then((doc) => {
          allStudents = doc.data().studentIDs;
        });
      incompleteStudents = allStudents.filter((element) => !completedStudents.includes(element));
      return [completedStudents, incompleteStudents];
    }

    async function getSingleAssignment(assignment, studentClassroomID) {
      const hasBeenEval = await isEvaluated(uid, assignment.id);
      const hasBeenSubmitted = await isSubmitted(uid, assignment.id);
      let studentsSeenTemp = [];
      await Firestore().collection('assignments').doc(assignment.id)
        .get()
        .then((doc) => { studentsSeenTemp = doc.data().studentsSeen; });

      const studentsStatus = await getStudentsCompleted(assignment.id, assignment.classroomID);
      const studentsCompleted = studentsStatus[0];
      const studentsNotCompleted = studentsStatus[1];
      const totalStudents = studentsCompleted.length + studentsNotCompleted.length;

      // Only returns assignments with classroomIDs in classroomIDsList
      if (studentClassroomID.includes(assignment.classroomID)) {
        return (
          <>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={async () => {
                  if (!isTeacher && !studentsSeenTemp.includes(uid)) {
                    studentsSeenTemp.push(uid);
                    await setStudentsSeen(assignment.id, studentsSeenTemp);
                    console.log('UPDATED');
                  }
                  navigation.navigate('Assignment', {
                    post: assignment,
                    isTeacher,
                    hasBeenEval,
                    hasBeenSubmitted,
                    loadingNewComment,
                    setLoadingNewComment,
                    rerender,
                    setRerender,
                    createSubmission,
                  });
                }}
              >
                <View style={styles.row}>
                  <Text style={styles.title}>
                    {assignment.title}
                  </Text>

                  <IconButton
                    color="#8e4f97"
                    icon={assignment.doPin ? 'pin-off' : 'pin-outline'}
                    style={styles.icons}
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
                </View>
                <View style={styles.row}>
                  {assignment.dueDate != null && (
                  <Button
                    buttonStyle={styles.dueDate}
                    titleStyle={styles.buttonText_1}
                    title={'Due: '
                  + `${assignment.dueDate}`}
                  />
                  )}
                </View>
                <View style={styles.row}>
                  {isTeacher && (
                  <Button
                    buttonStyle={styles.students}
                    titleStyle={styles.buttonText_2}
                    onPress={() => {
                      navigation.navigate('StudentNames', {
                        studentIDs: studentsSeenTemp,
                      });
                    }}
                    title={`Seen: ${studentsSeenTemp.length} / ${totalStudents}`}
                  />
                  )}

                  {isTeacher && (
                  <Button
                    buttonStyle={styles.students}
                    titleStyle={styles.buttonText_2}
                    onPress={() => {
                      navigation.navigate('StudentNames', {
                        studentIDs: studentsCompleted,
                      });
                    }}
                    title={`Completed: ${studentsCompleted.length} / ${totalStudents}`}
                  />
                  )}
                </View>

                {/* {isTeacher && (
                <Text
                  style={styles.buttonsContainer}
                  onPress={() => {
                    navigation.navigate('StudentNames', {
                      studentIDs: studentsNotCompleted,
                    });
                  }}
                >
                  Not Completed:
                  {' '}
                  {studentsNotCompleted.length}
                </Text>
                )} */}
                <View style={styles.row}>
                  {isTeacher && (
                  <Button
                    buttonStyle={styles.button_2}
                    titleStyle={styles.buttonText_3}
                    title="Edit"
                    onPress={() => {
                      navigation.navigate('NewAssignment', {
                        setLoad1: setLoadingNewPost,
                        currentLoad1: loadingNewPost,
                        title1: assignment.title,
                        body1: assignment.body,
                        attachments1: assignment.attachments,
                        assign1: assignment,
                        mode1: 'Edit',
                      });
                    }}
                  />
                  )}

                  <Button
                    buttonStyle={styles.button_2}
                    titleStyle={styles.buttonText_3}
                    title="Comment"
                    onPress={() => {
                      navigation.navigate('NewComment', { id: assignment.id, setLoad: setLoadingNewComment, currentLoad: loadingNewComment });
                    }}
                  />
                  {!isTeacher
                  && !studentsCompleted.includes(uid) && (
                  <Button
                    buttonStyle={styles.button_3}
                    titleStyle={styles.buttonText_3}
                    title="Mark as Completed"
                    onPress={async () => {
                      if (!studentsCompleted.includes(uid)) {
                        studentsCompleted.push(uid);
                        await setStudentsCompleted(assignment.id, studentsCompleted)
                          .then(() => setRerender(!rerender));
                      }
                    }}
                  />
                  )}

                </View>

              </TouchableOpacity>
            </View>
          </>
        );
      }
      return null;
    }

    // Gets all the classrooms

    // array of all classrooms a student is in
    // const classrooms = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    // for (let i = 0; i < classrooms.length; i += 1) {
    //   // Needs rewriting/var renaming for supporting teachers, but this seems to work for now
    //   if (classrooms[i].studentIDs.includes(uid) || classrooms[i].teacherIDs.includes(uid)) {
    //     studentClassroomIDs.push(classrooms[i].id);
    //   }
    // }
    // console.log(studentClassroomIDs);

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
  }, [finished1, navigation, loadingNewPost, loadingNewComment,
    completedAssignments, incompleteAssignments, rerender]);

  return (
    <View>
      <ScrollView>
        {isTeacher
            && (
            <FAB
              style={styles.fab}
              small
              animated
              icon="plus"
              label="Create"
              onPress={() => {
                navigation.navigate('NewAssignment', {
                  setLoad1: setLoadingNewPost,
                  currentLoad1: loadingNewPost,
                  title1: '',
                  body1: '',
                  attachments1: [],
                  mode1: 'Create',
                  assign1: null,
                });
              }}
            />
            )}

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
        {!isTeacher
        && (
        <List.Section>
          {!isTeacher
        && completedAssignmentsList.length !== 0 && (
        <List.Section>
          <List.Accordion
            title="Completed Assignments"
            expanded={expanded}
            onPress={handlePress}
          >
            {completedAssignmentsList.length !== 0 && (
            <>
              { completedAssignmentsList }
            </>
            )}
          </List.Accordion>
        </List.Section>
          )}
        </List.Section>
        )}

      </ScrollView>
    </View>
  );
}

AssignmentListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
