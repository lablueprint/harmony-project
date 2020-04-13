import React, { useState } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
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
  let commentsData = [];

  firestore().collection('comments')
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        snapshot.forEach((anotherSnapshot) => {
          const commentData = anotherSnapshot.data();
          if ((anotherSnapshot.get('postId') === postID) && !(commentsData.includes(commentData))) {
            commentsData = commentsData.concat(commentData);
          }
        });
      }
    })
    .then(() => {
      setCommentList(commentsData.sort((a, b) => {
        const aMillis = a.createdAt.toMillis();
        const bMillis = b.createdAt.toMillis();
        if (aMillis < bMillis) {
          return -1;
        }
        if (aMillis > bMillis) {
          return 1;
        }
        return 0;
      }).map((comment) => {
        const date = comment.createdAt.toDate();
        return (
          <Comment
            key={comment.id}
            name={comment.username}
            title={comment.title}
            createdAt={date.toTimeString()}
            date={date.toDateString()}
          >
            {comment.body}
          </Comment>
        );
      }));
    })
    .catch((error) => {
      setErrorMessage(error.message);
      // throw error;
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

  firestore().collection('posts')
    .get()
    .then((snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostsList(posts.sort((a, b) => {
        const aMillis = a.createdAt.toMillis();
        const bMillis = b.createdAt.toMillis();
        if (aMillis > bMillis) {
          return -1;
        }
        if (aMillis < bMillis) {
          return 1;
        }
        return 0;
      }).map((post) => {
        const date = post.createdAt.toDate();
        return (
          <>
            <Post
              key={post.id}
              name={post.username}
              title={post.title}
              createdAt={date.toTimeString()}
              date={date.toDateString()}
            >
              {post.body}
            </Post>
            <CommentLoader postID={post.id} />
          </>
        );
      }));
    })
    .catch((error) => {
      setErrorMessage(error.message);
      // throw error;
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
        <Button
          title="Make a Comment"
          onPress={() => {
            navigation.navigate('NewComment');
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
