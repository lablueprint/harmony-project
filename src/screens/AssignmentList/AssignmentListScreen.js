import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  Text, View, ScrollView, StyleSheet, Button,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';
import UploadFile from '../../components/UploadFile/UploadFile';
// import UploadFile from '../../components/UploadFile';

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

export default function AssignmentListScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    Firestore().collection('assignments').where('hasBeenSubmitted', '==', false)
      // .orderBy('createdAt', 'desc')
      // .limit(5)
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
              <UploadFile
                docId="example"
                collection="recordings"
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
        <Text style={styles.welcomeMessage}>Assignments List</Text>
        <Button
          title="Make a Post"
          onPress={() => {
            navigation.navigate('NewPost');
          }}
        />
        {errorMessage && <Text>{errorMessage}</Text>}
        {postsList}
        <Button
          style={styles.textInput}
          title="View Posts"
          onPress={() => {
            navigation.navigate('Post');
          }}
        />

      </ScrollView>

    </View>
  );
}

AssignmentListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
