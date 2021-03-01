import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, StyleSheet, Button,
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
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [rerender, setRerender] = useState(false);
  const uid = navigation.getParam('uid', null);

  const createSubmission = ((userID, assignmentID, body, attachment) => {
    Firestore().collection('submissions').where('authorID', '==', userID).where('assignmentID', '==', assignmentID)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) { // update if submission exists
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
        } else { // add submission if it doesn't exist
          Firestore().collection('submissions').add({
            authorID: userID,
            assignmentID,
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

  useEffect(() => {
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
        return studentClassroomIDs;
      })
      .then((studentClassroomIDs) => {
        // Gets all the assignments
        Firestore().collection('assignments')
          .orderBy('doPin', 'desc')
          .orderBy('updatedAt', 'desc')
          .get()
          .then((snapshot) => {
            // This creates an object for each document
            const assignments = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setAssignmentsList(assignments.map((assignment) => {
              const date = assignment.createdAt.toDate();
              // Only returns assignments with classroomIDs in classroomIDsList
              if (studentClassroomIDs.includes(assignment.classroomID)) {
                return (
                  <View style={styles.container} key={assignment.id}>
                    <Post
                      id={assignment.id}
                      name={assignment.username}
                      title={assignment.title}
                      createdAt={date.toTimeString()}
                      date={date.toDateString()}
                      attachments={assignment.attachments}
                      body={assignment.body}
                      collection="assignments"
                      pin={assignment.doPin}
                      rerender={rerender}
                      setRerender={setRerender}
                    >
                      {assignment.body}
                    </Post>
                    <Button
                      styles={styles.container}
                      title="Comment on Post"
                      onPress={() => {
                        navigation.navigate('NewComment', { ID: assignment.id });
                      }}
                    />
                    <Button
                      title="Upload Submission"
                      onPress={() => {
                        navigation.navigate('NewPost', {
                          userID: uid,
                          postID: assignment.id,
                          collection: 'recordings',
                          title: assignment.title,
                          mediaType: assignment.mediaType,
                          handleSubmit: createSubmission,
                        });
                      }}
                    />
                  </View>
                );
              }
              return null;
            }));
          });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [navigation, uid, rerender]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.welcomeMessage}>Assignments List</Text>
        <Button
          title="Make a Post"
          onPress={() => {
            navigation.navigate('NewPost');
          }}
        />
        {errorMessage && <Text>{errorMessage}</Text>}
        {assignmentsList}
        <Button
          style={styles.textInput}
          title="View Posts"
          onPress={() => {
            navigation.navigate('Post');
          }}
        />
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
