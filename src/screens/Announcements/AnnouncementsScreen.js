import React, { useState, useEffect } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import dateformat from 'dateformat';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({
  headingTitle: {
    fontSize: 28,
    fontWeight: '600',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignContent: 'center',
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
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 5,
  },
});

/*
Announcements Screen function
*/
export default function AnnouncementsScreen({ navigation }) {
  const { uid } = Firebase.auth().currentUser;
  const [errorMessage, setErrorMessage] = useState(null);
  const [announcementsList, setAnnouncementsList] = useState([]);
  const [rerender, setRerender] = useState(false);
  const [loadingNewComment, setLoadingNewComment] = useState(false);
  const [loadingNewPost, setLoadingNewPost] = useState(false);
  /*
this will only run one time when the component is mounted
*/

  useEffect(() => {
    Firestore().collection('announcements')
      .orderBy('doPin', 'desc')
      .orderBy('updatedAt', 'desc')
      .get()
      .then((snapshot) => {
        const announcements = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAnnouncementsList(announcements.map((announcement) => {
          const date = announcement.createdAt.toDate();
          const dateForm = dateformat(date, 'mmmm d, yyyy');
          const timeForm = dateformat(date, 'h:MM TT');
          return (
            <View style={styles.container} key={announcement.id}>
              <Post
                id={announcement.id}
                author={announcement.author}
                title={announcement.title}
                createdAt={timeForm}
                date={dateForm}
                attachments={announcement.attachments}
                body={announcement.body}
                collection="announcements"
                pin={announcement.doPin}
                rerender={rerender}
                setRerender={setRerender}
                navigation={navigation}
              >
                {announcement.body}
              </Post>

            </View>
          );
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [navigation, rerender]);

  return (
    <View style={styles.container}>
      <ScrollView>

        {/* <Button
          title="Make a Post"
          onPress={() => {
            navigation.navigate('NewAnnouncement', {
              setLoad: setLoadingNewPost,
              currentLoad: loadingNewPost,
              uid,
              title: '',
              body: '',
              attachments: '',
            });
          }}
        /> */}
        {errorMessage && <Text>{errorMessage}</Text>}
        {announcementsList}
      </ScrollView>
    </View>
  );
}

AnnouncementsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,

};
