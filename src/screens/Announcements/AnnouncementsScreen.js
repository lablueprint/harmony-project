import React, { useState, useEffect } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import Firestore from '@react-native-firebase/firestore';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

export default function AnnouncementsScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);

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

};
