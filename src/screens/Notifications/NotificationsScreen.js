import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, ScrollView,
} from 'react-native';
import { Icon, ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import moment from 'moment';

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#d0e6f5',
    padding: 6,
    borderRadius: 25,
  },
});

/**
 * Get the list of students in this class, then reate a notification for each student.
 * @param {String} classroomID - The document ID of the classroom.
 * @param {String} message - The body of the notification.
 * @param {String} page - The page the notification should navigate the user to
 */
export async function notifyStudents(classroomID, message, page) {
  let studentIDs = [];
  await Firestore().collection('classrooms').doc(classroomID).get()
    .then((doc) => {
      const data = doc.data();
      if (data) {
        studentIDs = data.studentIDs;
      }
    })
    .catch((e) => {
      console.warn(e);
    });

  if (studentIDs.length > 0) {
    studentIDs.forEach(async (studentID) => {
      await Firestore().collection('notifications').add({
        classroomID,
        createdAt: Firestore.Timestamp.now(),
        message,
        page,
        userID: studentID,
      });
    });
  }
}

/**
 * Get the author of the post, then create a notification for the author.
 * (ie. when a comment has been created)
 * @param {String} announcementID - The document ID of the post.
 * @param {String} message - The body of the notification.
 * @param {String} page - The page the notification should navigate the user to
 */
export async function notifyAuthor(announcementID, message, page) {
  let authorID = '';
  let classroomID = '';
  let announcementTitle = '';
  await Firestore().collection('announcements').doc(announcementID).get()
    .then((doc) => {
      const data = doc.data();
      if (data) {
        authorID = data.author;
        classroomID = data.classroomID;
        announcementTitle = data.title;
      }
    });

  if (authorID !== '' && classroomID !== '' && announcementTitle !== '') {
    const newMessage = message + announcementTitle;
    await Firestore().collection('notifications').add({
      classroomID,
      createdAt: Firestore.Timestamp.now(),
      newMessage,
      page,
      userID: authorID,
    });
  }
}

export default function NotificationsScreen({ navigation }) {
  // const uid = navigation.getParam('uid', null);
  const { uid } = Firebase.auth().currentUser;
  const [classroomList, setClassroomList] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [listItems, setListItems] = useState([]);

  /* Get all the notification documents associated with this user and store it
  in notificationList. */
  useEffect(() => {
    async function getNotifications() {
      await Firestore().collection('notifications').where('userID', '==', uid).get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            const notifications = querySnapshot.docs.map((doc) => ({
              ...doc.data(), id: doc.id,
            }));
            setNotificationList(notifications);
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    }
    getNotifications();
  }, []);

  /* Get all the classroom documents associated with each notification doc and store
  it in classroomList. */
  useEffect(() => {
    async function getClasses() {
      notificationList.map(async (notification) => {
        await Firestore().collection('classrooms').doc(notification.classroomID).get()
          .then((snapshot) => {
            if (snapshot) {
              // eslint-disable-next-line no-shadow
              setClassroomList((classroomList) => [...classroomList, snapshot.data()]);
            }
          });
      });
    }
    getClasses();
  }, [notificationList]);

  /* For each notification, create a list item */
  useEffect(() => {
    if (notificationList.length > 0 && classroomList.length === notificationList.length) {
      const ListItems = notificationList.map((element, index) => (
        <ListItem
          key={element.id}
          leftIcon={(
            <View style={styles.iconContainer}>
              <Icon
                name={element.page === 'TODO' ? 'clipboard' : 'home'}
                type="feather"
                color="#439ad8"
              />
            </View>
          )}
          title={classroomList[index].name}
          subtitle={element.message}
          rightTitle={moment(element.createdAt.toDate()).fromNow().toString()}
          rightTitleStyle={{
            fontSize: 11,
            color: '#439AD8',
          }}
          bottomDivider
        />
      ));
      setListItems(ListItems);
    }
  }, [classroomList]);

  /* Display a list of Notifications */
  return (
    <ScrollView>
      {listItems}
    </ScrollView>
  );
}

// eslint-disable-next-line no-unused-vars
NotificationsScreen.navigationOptions = ({ navigation }) => ({
  title: 'Notifications',
  headerShown: true,
});

NotificationsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
