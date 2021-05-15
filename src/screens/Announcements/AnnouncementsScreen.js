import React, { useState, useEffect } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import Firestore from '@react-native-firebase/firestore';
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

/*
Announcements Screen function
*/
export default function AnnouncementsScreen({ navigation }) {
  const uid = navigation.getParam('uid', null);
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
          return (
            <View style={styles.container} key={announcement.id}>
              <Post
                id={announcement.id}
                name={announcement.username}
                title={announcement.title}
                createdAt={date.toTimeString()}
                date={date.toDateString()}
                attachments={announcement.attachments}
                body={announcement.body}
                collection="announcements"
                pin={announcement.doPin}
                rerender={rerender}
                setRerender={setRerender}
              >
                {announcement.body}
              </Post>
              <Button
                styles={styles.container}
                title="Comment on Post"
                onPress={() => {
                  navigation.navigate('NewComment', { uid, postid: announcement.id, setLoad: setLoadingNewComment });
                }}
              />

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
        <Text style={styles.welcomeMessage}>Posts</Text>
        <Button
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
        />
        {errorMessage && <Text>{errorMessage}</Text>}
        {announcementsList}
      </ScrollView>
    </View>
  );
}

AnnouncementsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,

};
