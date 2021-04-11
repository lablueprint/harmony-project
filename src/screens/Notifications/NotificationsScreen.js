import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, StyleSheet, Platform, View, Alert, TextInput,
} from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { INITIAL_USER_STATE } from '../../components';
import Firestore from '@react-native-firebase/firestore';
import Post from '../../components/Post/Post';

export default function NotificationsScreen({ navigation }) {
    const uid = navigation.getParam('uid', null);

    const [notificationList, setNotificationList] = useState([]);

    /* Grab all the notifications associated with this user. For each notification, create a Post element. Then add the Post element to the notificationsList. */
    useEffect(() => {
        Firestore().collection('notifications').where('userID', '==' , uid).orderBy('createdAt').get()
        .then((querySnapshot) => {
            if(querySnapshot.size > 0) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setNotificationList(
                        <Post
                            body = {data.message}
                            collection = "notifications"
                            pin = "false"
                            rerender = "false"
                        />
                        )
                 }  
                );
            }
        })
        .catch((error) => {
            console.warn(error);
        });
    });

    /* Display a list of Notifications (using the Post element) */
    return (
        <ScrollView>
            {notificationList}
        </ScrollView>
    );
}

NotificationsScreen.navigationOptions = ({ navigation }) => ({
    title: 'Notifications',
    headerShown: false,
  });
  
NotificationsScreen.propTypes = {
    navigation: PropTypes.shape({
      uid: PropTypes.func.isRequired,
    }).isRequired,
  };