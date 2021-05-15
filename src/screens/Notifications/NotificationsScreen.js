import React, { useState, useEffect, useContext } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import PropTypes from 'prop-types';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import moment from 'moment';
import ClassroomContext from '../../context/ClassroomContext';

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
  const { uid } = Firebase.auth().currentUser;
  const { classroom, setClassroom } = useContext(ClassroomContext);
  const [classroomMap, setClassroomMap] = useState(); // Map(classroomID -> classroomData)
  const [notifications, setNotifications] = useState([]);

  /* Get all the notification documents associated with this user and store it
  in notificationList. */
  useEffect(() => {
    async function getNotifications() {
      let cmap = new Map();
      await Firestore().collection('classrooms').where('studentIDs', 'array-contains', uid).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((c) => {
            cmap.set(c.id, c.data());
          });
          setClassroomMap(cmap); // Only rerender once map is filled completely
        }).catch((error) => {
          console.warn(error);
        });
      
        await Firestore().collection('notifications').where('userID', '==', uid).get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            const notifications = querySnapshot.docs.map((doc) => ({
              id: doc.id, ...doc.data()
            }));
            setNotifications(notifications);
            // console.log(notifications);
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    }
    getNotifications();
  }, []);

  const renderNotification = ({item}) => {
    return (
      <ListItem
        // Optional chaining with '?.' since not all classrooms on Firestore have these props right now
        leftAvatar={{ 
          // Icon fallbacks broken for this version of react native elements
          source: { uri: classroomMap[item.classroomID]?.profilePicture },
          icon: {name: 'notifications', type: 'ionicon'}
       }}
        title={classroomMap[item.classroomID]?.name}
        subtitle={item?.message}
        rightTitle={moment(item.createdAt?.toDate()).fromNow().toString()}
        rightTitleStyle={{
          fontSize: 11,
          color: '#439AD8',
        }}
        onPress={() => {
          setClassroom(item.classroomID);
          // navigation.navigate()
        }}
        bottomDivider
      />
    );
  };

  /* Display a list of Notifications */
  return (
    <FlatList
      keyExtractor={(_, index) => index.toString()}
      data={notifications}
      renderItem={renderNotification}
    />
  );
}

NotificationsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
