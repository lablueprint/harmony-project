import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Button,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
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

function CommentLoader({ postID, loadingStatus }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const commentsData = [];

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
              id={comment.id}
            >
              {comment.body}
            </Comment>
          );
        }));
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  // Don't set commentsData as dependency or it'll enter an infinite rendering cycle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStatus, postID]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {errorMessage && <Text>{errorMessage}</Text>}
        {commentList}
      </ScrollView>
    </View>
  );
}

function likeButton(postID) {
  const post = Firestore().collection('posts').doc(postID);
  const user = Firebase.auth().currentUser.uid;

  post.set({
    likedBy: {
      [user]: true,
    },
  },
  { merge: true });

  /* IF WE NEED TO CHANGE TO .update INSTEAD OF .set: For nested objects in
  firebase, we must use a path string to update. If we simply updated the entire
  'likedBy' object, then the ENTIRE map will be reset with whatever is input.
  If we change this, make sure to change the same logic in 'Comment'.

  post.update({
    [`likedBy.${username}`]: true,
  });
  */

  return (null);
}

function unlikeButton(postID) {
  const post = Firestore().collection('posts').doc(postID);
  const user = Firebase.auth().currentUser.uid;

  post.set({
    likedBy: {
      [user]: Firebase.firestore.FieldValue.delete(),
    },
  },
  { merge: true });

  return (null);
}

function DisplayLikes({ postID }) {
  const [numLikes, setNumLikes] = useState(0);

  Firestore().collection('posts').doc(postID)
    .get()
    .then((post) => {
      // post contains the information from the post document. get()
      // pulls the likedBy field. Using Firestore map syntax, we check if
      // the key userID exists inside the map!
      const likeMap = post.get('likedBy');
      if (likeMap !== undefined) {
        setNumLikes(Object.keys(likeMap).length);
      }
    });

  return (
    <Text>
      {'\n'}
      {numLikes}
      {' '}
      people liked this post.
    </Text>
  );
}

export default function Post({
  title, createdAt, date, body, attachment, id, loadingStatus,
}) {
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const userID = Firebase.auth().currentUser.uid;

  // Runs whenever loading changes (someone hits the 'Like' or 'Unlike' button).
  useEffect(() => {
    // Checks if the user has liked this post or not.
    Firestore().collection('posts').doc(id).get()
      .then((post) => {
        const likeMap = post.get('likedBy');
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
        {attachment ? (
          <Image
            style={{ width: '100%', height: 200, resizeMode: 'center' }}
            source={{ uri: attachment }}
          />
        ) : null}
      </View>
      <DisplayLikes postID={id} />
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
      <CommentLoader postID={id} loadingStatus={loadingStatus} />
    </View>
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  date: PropTypes.string,
  body: PropTypes.string.isRequired,
  attachment: PropTypes.string.isRequired,
  id: PropTypes.string,
  loadingStatus: PropTypes.bool,
};

Post.defaultProps = {
  createdAt: '',
  date: '',
  id: '',
  loadingStatus: false,
};

CommentLoader.propTypes = {
  postID: PropTypes.string.isRequired,
  loadingStatus: PropTypes.bool,
};

CommentLoader.defaultProps = {
  loadingStatus: false,
};

DisplayLikes.propTypes = {
  postID: PropTypes.string.isRequired,
};

/* CODE TO GET A NAME FROM THE USERS DOCUMENT:
  Firestore().collection('users').doc('MHnkJ88vOzY1wg6rKNYRCNwCJ8X2').get()
    .then((snapshot) => {
      console.log(snapshot.get('name'));
    });
*/
