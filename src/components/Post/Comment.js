import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Button,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
  },
  contentContainer: {
    paddingTop: 20,
  },
  timeText: {
    fontSize: 11,
  },
  topicText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bodyText: {
    fontSize: 14,
  },
});

function likeButton(commentID) {
  const comment = Firestore().collection('comments').doc(commentID);
  const user = Firebase.auth().currentUser.uid;

  comment.set({
    likedBy: {
      [user]: true,
    },
  },
  { merge: true });

  return (null);
}

function unlikeButton(commentID) {
  const comment = Firestore().collection('comments').doc(commentID);
  const user = Firebase.auth().currentUser.uid;

  comment.set({
    likedBy: {
      [user]: Firebase.firestore.FieldValue.delete(),
    },
  },
  { merge: true });

  return (null);
}

function DisplayLikes({ commentID }) {
  const [numLikes, setNumLikes] = useState(0);

  Firestore().collection('comments').doc(commentID)
    .get()
    .then((comment) => {
      // comment contains the information from the comment document. get()
      // pulls the likedBy field. Using Firestore map syntax, we check if
      // the key userID exists inside the map!
      const likeMap = comment.get('likedBy');
      if (likeMap !== undefined) {
        setNumLikes(Object.keys(likeMap).length);
      }
    });

  return (
    <Text>
      {'\n'}
      {numLikes}
      {' '}
      people liked this comment.
    </Text>
  );
}

export default function Comment({
  title, createdAt, date, body, id,
}) {
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const userID = Firebase.auth().currentUser.uid;

  // Runs whenever loading changes (someone hits the 'Like' or 'Unlike' button).
  useEffect(() => {
    // Checks if the user has liked this post or not.
    Firestore().collection('comments').doc(id).get()
      .then((comment) => {
        const likeMap = comment.get('likedBy');
        if (likeMap !== undefined) {
          const inMap = (userID in likeMap);
          setHasLiked(inMap);
        }
      });
  }, [id, loading, userID]);

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
      </View>
      <DisplayLikes commentID={id} />
      {hasLiked ? (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Unlike"
            onPress={() => {
              setLoading(!loading);
              unlikeButton(id);
            }}
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Like"
            onPress={() => {
              setLoading(!loading);
              likeButton(id);
            }}
          />
        </View>
      )}
    </View>
  );
}

Comment.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

DisplayLikes.propTypes = {
  commentID: PropTypes.string.isRequired,
};
