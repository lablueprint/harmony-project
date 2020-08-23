import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Comment from './Comment';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
});

function CommentLoader({ postID }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const commentsData = [];

  /* Will only update on mount (since it has no dependencies). Thus, the user
  must refresh the page or go to the next page and back again for the comment
  to show.
  */
  useEffect(() => {
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

export default function Post({
  title, createdAt, date, body, attachment, id,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.topicText}>
        {title}
      </Text>
      <Text style={styles.timeText}>
        {createdAt}
      </Text>
      <Text style={styles.timeText}>
        {date}
      </Text>
      <View style={styles.contentContainer}>
        <Text>
          {body}
        </Text>
        {attachment ? (
          <Image
            style={{ width: '100%', height: 200, resizeMode: 'center' }}
            source={{ uri: attachment }}
          />
        ) : null}
      </View>
      <CommentLoader postID={id} />
    </View>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  attachment: PropTypes.string.isRequired,
  id: PropTypes.string
};

CommentLoader.propTypes = {
  postID: PropTypes.string.isRequired,
};
