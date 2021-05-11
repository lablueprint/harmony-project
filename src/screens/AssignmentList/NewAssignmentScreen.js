import React, { useEffect, useState } from 'react';
import {
  View, Button, Text, ActivityIndicator, StyleSheet, Alert,
} from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { Calendar } from 'react-native-calendars';
import { List, IconButton } from 'react-native-paper';
// eslint-disable-next-line import/no-unresolved
import Dialog from 'react-native-dialog';

const styles = StyleSheet.create({
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
    paddingBottom: 125,
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

export default function NewAssignmentScreen({ navigation }) {
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  // eslint-disable-next-line no-unused-vars
  const [attachment, setAttachment] = useState(navigation.getParam('attachments'));
  const [attachmentArr, setAttachmentArr] = useState([]);

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDueDate] = useState('');
  const mainScreenLoadStatus = navigation.getParam('currentLoad');
  const reloadMainScreen = navigation.getParam('setLoad');
  const [classroom, setClassroomID] = useState('');
  const mode = navigation.getParam('mode');
  const assignment = navigation.getParam('assign');

  const [initializing, setInitializing] = useState(true);
  const uid = navigation.getParam('uid', null);
  const ref = Firestore().collection('users');
  const [expanded0, setExpanded0] = useState(false);
  const [expanded1, setExpanded1] = useState(false);
  const handlePress = () => setExpanded0(!expanded0);
  const handlePress1 = () => setExpanded1(!expanded1);
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    setVisible(false);
  };
  useEffect(() => {
    console.log('ONE');
    try {
      ref.doc(uid).get().then((doc) => {
        const data = doc.data();
        setClassroomID(data.classroomIds[0]);
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
            />
            <IconButton
              icon="trash-can"
            />
          </View>
        </>
      );
    }

    const temp = attachment.map((attach, index) => getSingleAttachment(attach, index));
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
  }, []);

  if (initializing) return null;

  const handleSubmit = () => {
    setLoading(true);
    reloadMainScreen(!mainScreenLoadStatus);
    if (mode === 'Create') {
      const assignmentRecord = {
        title,
        body,
        attachments: attachment,
        createdAt: Firestore.Timestamp.now(),
        updatedAt: Firestore.Timestamp.now(),
        classroomID: classroom,
        dueDate: date.dateString,
        author: Firebase.auth().currentUser.uid,
        likedByIDs: {},
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
    } else {
      Firestore().collection('assignments').doc(assignment.id)
        .update({
          title,
          body,
          attachments: attachment,
          updatedAt: Firestore.Timestamp.now(),
          dueDate: date.dateString,
        })
        .then(() => {
          setLoading(false);
          navigation.navigate('AssignmentList', { uid });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
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
                  <Dialog.Title>Account delete</Dialog.Title>
                  <Dialog.Description>
                    Do you want to delete this account? You cannot undo this action.
                  </Dialog.Description>
                  <Dialog.Button label="Cancel" onPress={handleCancel} />
                  <Dialog.Button label="Delete" onPress={handleDelete} />
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
          style={styles.submitButton}
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
};

NewAssignmentScreen.navigationOptions = {
  title: 'New Assignment',
};
