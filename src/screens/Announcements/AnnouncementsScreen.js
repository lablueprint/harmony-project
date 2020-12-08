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
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);
  /*
this will only run one time when the component is mounted
*/
  useEffect(() => {
    Firestore().collection('announcements')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPostsList(posts.map((post) => {
          const date = post.createdAt.toDate();
          return (
            <View style={styles.container} key={post.id}>
              <Post
                key={post.id}
                name={post.username}
                title={post.title}
                createdAt={date.toTimeString()}
                date={date.toDateString()}
                attachment={post.attachment}
                body={post.body}
              >
                {post.body}
              </Post>
              <Button
                styles={styles.container}
                title="Comment on Post"
                onPress={() => {
                  navigation.navigate('NewComment', { ID: post.id });
                }}
              />

            </View>
          );
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.welcomeMessage}>Posts</Text>
        <Button
          title="Make a Post"
          onPress={() => {
            navigation.navigate('NewPost');
          }}
        />
        {errorMessage && <Text>{errorMessage}</Text>}
        {postsList}
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
