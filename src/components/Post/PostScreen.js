import React, { useState } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import Firestore from '@react-native-firebase/firestore';
import Post from './Post';
import Comment from './Comment';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    fontSize: 20,
  },
});

function CommentLoader({ postID }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const commentsData = [];

  Firestore().collection('comments')
    .where('postId', '==', postID)
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach((anotherSnapshot) => {
          commentsData.push({ ...anotherSnapshot.data(), id: anotherSnapshot.id });
        });
      }
    })
    .then(() => {
      setCommentList(commentsData.map((comment) => {
        const date = comment.createdAt.toDate();
        return (
          <Comment
            key={comment.id}
            name={comment.username}
            title={comment.title}
            createdAt={date.toTimeString()}
            date={date.toDateString()}
            body={comment.body}
          >
            {comment.body}
          </Comment>
        );
      }));
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });
  return (
    <View style={styles.container}>
      <ScrollView>
        {errorMessage && <Text>{errorMessage}</Text>}
        {commentList}
      </ScrollView>
    </View>
  );
}

export default function PostsScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);

  Firestore().collection('posts')
    .orderBy('createdAt', 'desc')
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
            <CommentLoader postID={post.id} />
          </View>
        );
      }));
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });

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

PostsScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

CommentLoader.propTypes = {
  postID: PropTypes.string.isRequired,
};
