import React, { useState, useEffect } from 'react';
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import { Text, ListItem, colors } from 'react-native-elements';
import PropTypes, { element } from 'prop-types';
import { INITIAL_USER_STATE } from '../../components';
import Firestore from '@react-native-firebase/firestore';
import moment from 'moment';

/**
Get the list of students in this class to notify when the assignment has been created
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
    })  

    if(studentIDs.length > 0) {
      studentIDs.forEach(async (studentID) => {
        await Firestore().collection('notifications').add({
          classroomID, 
          createdAt: Firestore.Timestamp.now(), 
          message, 
          page, 
          userID: studentID
        })
      })
    }
  }

export default function NotificationsScreen({ navigation }) {
    const uid = navigation.getParam('uid', null);
    const [classroomList, setClassroomList] = useState([]);
    const [notificationList, setNotificationList] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [rerender, setRerender] = useState(false);

    /* Get all the notification documents associated with this user and store it in notificationList.*/
    useEffect(() => {    
        async function getNotifications() {
            await Firestore().collection('notifications').where('userID', '==' , uid).get()
                .then((querySnapshot) => {
                    if(querySnapshot.size > 0) {
                        const notifications = querySnapshot.docs.map((doc) => ({
                            ...doc.data(), id: doc.id
                        }));
                        setNotificationList(notifications);
                    }
                })
            .catch((error) => {
                console.warn(error);
            })};
        getNotifications();
    }, []);

    /* Get all the classroom documents associated with each notification doc and store it in classroomList.*/
    useEffect(() => {
        async function getClasses() {
            notificationList.map(async (notification) => {
                await Firestore().collection('classrooms').doc(notification.classroomID).get()
                .then((snapshot) => {
                    if(snapshot) {
                        setClassroomList(classroomList => [...classroomList, snapshot.data()]);
                    }
                })
            })
        }
        getClasses();
    }, [notificationList])

    /* For each notification, create a list item */
    useEffect(() => {
        
        if(notificationList.length > 0 && classroomList.length == notificationList.length) {
            const ListItems = notificationList.map((element, index) => (
                <ListItem
                    key={element.id}
                    leftAvatar={{ source: { uri: classroomList[index].profilePicture } }}
                    title={classroomList[index].name}
                    subtitle={element.message}
                    rightTitle={moment(element.createdAt.toDate()).fromNow().toString()}
                    rightTitleStyle={{
                        fontSize: 11,
                        color:'#439AD8',
                    }}
                    bottomDivider
                />
            ))
            setListItems(ListItems)
        }
    }, [classroomList])

    /* Display a list of Notifications */
    return (
        <ScrollView>
            {listItems}
        </ScrollView>
    );
}

NotificationsScreen.navigationOptions = ({ navigation }) => ({
    title: 'Notifications',
    headerShown: true,
  });
  
NotificationsScreen.propTypes = {
    navigation: PropTypes.shape({
      uid: PropTypes.func.isRequired,
    }).isRequired,
  };