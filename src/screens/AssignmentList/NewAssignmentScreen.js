/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Calendar } from 'react-native-calendars';
import { List, IconButton } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import Dialog from 'react-native-dialog';
// eslint-disable-next-line import/named
import { notifyStudents } from '../Notifications/NotificationsScreen';

const styles = StyleSheet.create({
  buttonText_2: {
    color: '#323232',
    fontSize: 16,
  },
  buttonText_3: {
    color: '#8e4f97',
    fontSize: 16,
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
    height: 35,
    width: 130,
    paddingBottom: 5,
    borderColor: '#8e4f97',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginLeft: 12,
    margin: 12,
  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#F8F7F7',
  },
  listItems: {
    flex: 1,
    backgroundColor: 'white',
    paddingRight: 15,
    borderTopWidth: 5,
    borderBottomWidth: 2.5,
    borderColor: '#F8F7F7',

  },
  calendar: {
    flex: 1,
    backgroundColor: 'white',
    paddingRight: 55,
    paddingBottom: 15,

  },

  title: {
    paddingTop: 35,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 25,
    backgroundColor: 'white',
    color: 'black',
    fontSize: 24,
    fontFamily: 'Helvetica',
    borderBottomWidth: 2.5,
    borderColor: '#F8F7F7',

  },
  button: {
    backgroundColor: 'white',
  },
  desc: {
    paddingLeft: 40,
    paddingRight: 40,
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Helvetica',
    fontSize: 16,
    borderTopWidth: 2.5,
    borderColor: '#F8F7F7',
    lineHeight: 24,

  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
  },

  attachment: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15,
    paddingTop: 15,
    width: '75%',
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'Helvetica',
    fontSize: 14,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderColor: '#F8F7F7',

  },

});

export default function NewAssignmentScreen({ route, navigation }) {
  const {
    setLoad1,
    currentLoad1,
    title1,
    body1,
    attachments1,
    mode1,
    assign1,
  } = route.params;

  const [title, setTitle] = useState(title1);
  const [body, setBody] = useState(body1);
  // eslint-disable-next-line no-unused-vars
  const [attachment, setAttachment] = useState(attachments1);
  const [attachmentArr, setAttachmentArr] = useState([]);
  const [newAttach, setNewAttach] = useState('');
  const [rerender, setRerender] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDueDate] = useState('');
  const mainScreenLoadStatus = currentLoad1;
  const reloadMainScreen = setLoad1;
  const [classroom, setClassroomID] = useState('');
  const mode = mode1;
  // assignment = assign1;

  const [initializing, setInitializing] = useState(true);
  const { uid } = Firebase.auth().currentUser;
  // const ref = Firestore().collection('users');
  const [expanded0, setExpanded0] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const handlePress = () => setExpanded0(!expanded0);
  const handlePress1 = () => setExpanded1(!expanded1);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  // const [studentIDs, setStudentIDs] = useState([]);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setNewAttach('');
  };

  const showDialogEdit = (index) => {
    setVisibleEdit(true);
    setEditIndex(index);
  };

  const handleCancelEdit = () => {
    setVisibleEdit(false);
    setNewAttach('');
  };

  const showDialogDelete = (index) => {
    setVisibleDelete(true);
    setDeleteIndex(index);
  };

  const handleCancelDelete = () => {
    setVisibleDelete(false);
  };

  const handleAdd = () => {
    const n = attachment;
    n.push(newAttach);
    setAttachment(n);
    setNewAttach('');
    setVisible(false);
    setRerender(!rerender);
  };

  const handleEdit = (index) => {
    const n = attachment;
    n[index] = newAttach;
    setAttachment(n);
    setNewAttach('');
    setEditIndex(null);
    setVisibleEdit(false);
    setRerender(!rerender);
  };

  const handleDelete = (index) => {
    const n = attachment;
    n.splice(index, 1);
    setAttachment(n);
    setDeleteIndex(null);
    setVisibleDelete(false);
    setRerender(!rerender);
  };

  useEffect(() => {
    console.log('ONE');
    try {
      Firestore().collection('users').doc(uid).get()
        .then((doc) => {
          const data = doc.data();
          if (data) {
            setClassroomID(data.classroomIds[0]);
            setTeacherName(data.name);
          }
        });
      if (initializing) setInitializing(false);
    } catch (e) {
      setInitializing(false);
      Alert.alert(
        e.message,
      );
    }

    // eslint-disable-next-line no-unused-vars
    function getSingleAttachment(attach, index) {
      return (
        <>
          <View style={styles.inline}>
            <Text style={styles.attachment}>
              {attach}
            </Text>

            <IconButton
              icon="pencil-outline"
              onPress={() => showDialogEdit(index)}
            />
            <IconButton
              icon="trash-can"
              onPress={() => showDialogDelete(index)}
            />
          </View>
        </>
      );
    }
    let temp = [];
    if (attachment.length > 0) {
      temp = attachment.map((attach, index) => getSingleAttachment(attach, index));
    }
    temp.push(
      <>
        <View style={styles.inline}>
          <Text
            style={styles.attachment}
          >
            Add a New Attachment
          </Text>

          <IconButton
            icon="plus"
            onPress={showDialog}
          />

        </View>

      </>,

    );
    setAttachmentArr(temp);
  }, [rerender]);

  if (initializing) return null;

  /* When an assignment has been created, create a notification for every student in the class */
  /*
  const notifyStudents = () => {
    if(studentIDs.length > 0 && teacherName !== '') {
      studentIDs.forEach(async (studentID) => {
        await Firestore().collection('notifications').add({
          classroomID: classroom,
          createdAt: Firestore.Timestamp.now(),
          message: teacherName + " has created a new To Do '" + title + "'",
          page: "TODO",
          userID: studentID
        })
      })
    }
  }
  */

  const handleSubmit = () => {
    setLoading(true);
    reloadMainScreen(!mainScreenLoadStatus);

    const assignmentRecord = {
      title,
      body,
      attachments: attachment,
      createdAt: Firestore.Timestamp.now(),
      updatedAt: Firestore.Timestamp.now(),
      classroomID: classroom,
      hasBeenGraded: false,
      dueDate: date.dateString,
      author: Firebase.auth().currentUser.uid,
      likedBy: {},
    };
    Firestore().collection('assignments')
      .add(assignmentRecord)
      .then(() => {
        setLoading(false);

        navigation.navigate('AssignmentList', { uid });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });

    notifyStudents(classroom, `${teacherName} has created a new To Do '${title}'`, 'TODO');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {errorMessage && <Text>{errorMessage}</Text>}

          <TextInput
            style={styles.title}
            placeholder="To-Do Title..."
            onChangeText={setTitle}
            value={title}
          />

          <TextInput
            style={styles.desc}
            autoFocus
            padding={10}
            placeholder="Add a description..."
            multiline
            value={body}
            onChangeText={(content) => setBody(content)}
          />
          <View>
            <List.Accordion
              style={styles.listItems}
              title="Add Attachments"
              left={() => <List.Icon icon="paperclip" />}
              expanded={expanded1}
              onPress={handlePress1}
            >

              { attachmentArr }

            </List.Accordion>
            <>
              <View style={styles.container}>
                <Dialog.Container visible={visible}>
                  <Dialog.Title>Add New Attachment</Dialog.Title>
                  <Dialog.Description>
                    Insert Link
                  </Dialog.Description>
                  <Dialog.Input onChangeText={setNewAttach} />
                  <Dialog.Button label="Cancel" onPress={handleCancel} />
                  <Dialog.Button
                    label="Add"
                    onPress={() => {
                      if (newAttach !== '') { handleAdd(); }
                    }}
                  />
                </Dialog.Container>

                <Dialog.Container visible={visibleEdit}>
                  <Dialog.Title>Edit Attachment</Dialog.Title>
                  <Dialog.Description>
                    Insert Link
                  </Dialog.Description>
                  <Dialog.Input onChangeText={setNewAttach} />
                  <Dialog.Button label="Cancel" onPress={handleCancelEdit} />
                  <Dialog.Button
                    label="Edit"
                    onPress={() => {
                      if (newAttach !== '') { handleEdit(editIndex); }
                    }}
                  />
                </Dialog.Container>

                <Dialog.Container visible={visibleDelete}>
                  <Dialog.Title>Delete Attachment</Dialog.Title>
                  <Dialog.Description>
                    Are You Sure You Want To Delete This Link?
                  </Dialog.Description>
                  <Dialog.Button label="Cancel" onPress={handleCancelDelete} />
                  <Dialog.Button
                    label="Delete"
                    onPress={() => {
                      handleDelete(deleteIndex);
                    }}
                  />
                </Dialog.Container>

              </View>

            </>
            <List.Accordion
              style={styles.listItems}
              title="Set Due Date"
              left={() => <List.Icon icon="calendar" />}
              expanded={expanded0}
              onPress={handlePress}
            >

              <Calendar
                style={styles.calendar}
                onDayPress={(day) => { setDueDate(day); }}
              />
            </List.Accordion>
          </View>
        </View>
        {loading && <ActivityIndicator />}
        <Button
          buttonStyle={styles.button_2}
          titleStyle={styles.buttonText_3}
          disabled={loading}
          title={`${mode} To-Do`}
          onPress={handleSubmit}
        />
      </ScrollView>
    </View>

  );
}

NewAssignmentScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};
