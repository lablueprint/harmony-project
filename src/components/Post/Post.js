import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, Button, Alert,
} from 'react-native';
import Firestore from '@react-native-firebase/firestore';
import Firebase from '@react-native-firebase/app';
import { ScrollView } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import Comment from './Comment';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
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

// loadAmount refers to how many comments are loaded when clicking "Load Comments"
// As well as the amount loaded initially.
const loadAmount = 1;

function CommentLoader({
  postID, loadingNewComment, numCommentsLoaded, setloadedLastComment, loadedLastComment,
  setNoComments, noComments,
}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [loadCounter, setLoadCounter] = useState(0);
  const [forceRerender, setForceRerender] = useState(false);

  /**
   * This useEffect is important as it ensures that new comments are loaded
   * properly after they're made. There lies an issue when making a new comment,
   * where the check to see if the lastComment has been loaded will still think
   * the old last comment is the real last comment and doesn't properly change
   * loadedLastComment back to false. By setting loadCounter back to 0, this will
   * force the component to rerender itself a few times, effectively fixing the
   * discrepancy. numCommentsLoaded is also a depency to allow LoadCommentButton
   * to properly display the buttons with appropriate data.
   */
  useEffect(() => {
    setLoadCounter(0);
  }, [loadingNewComment, numCommentsLoaded]);

  useEffect(() => {
    // Sets up the comments to be displayed
    Firestore().collection('comments')
      .where('postId', '==', postID)
      .orderBy('createdAt', 'desc')
      .limit(numCommentsLoaded)
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const comments = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setCommentsData(comments);
          /**
           * This if statement below is important because it fixes a problem that
           * arose due to the "loadCounter" fix described below (I know...). The
           * loadCounter fix allows initial comments to be rendered upon mount,
           * but causes a weird issue to arise when using the "setCommentsData"
           * function. This issue causes commentsData to not be  occasionally
           * fail to properly set commentsData to "comments" whenever a user
           * presses "Load Comments". The user must instead press the button
           * twice. This if statement checks if the amount of data inside
           * commentsData matches the expected number of comments to be displayed.
           * If it doesn't, a rerender if forced and the comments should be
           * displayed correctly.
           */
          if (commentsData.length !== numCommentsLoaded) {
            setForceRerender(!forceRerender);
          }

          // Below should only happen when there are no comments and then the user
          // makes a comment.
          if ((noComments === true) && (commentsData.length <= numCommentsLoaded)) {
            setNoComments(false);
            setloadedLastComment(true);
          }
        } else {
          setNoComments(true);
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

        /**
         * loadCounter is a crude workaround to an annoying issue. Without this
         * code here, whenever the post page is visited, NO comments will be
         * displayed. Instead, the user must click the "Load Comments" button
         * which will always be displayed first. This is because the code in this
         * useEffect will only run twice upon mounting. The nature of this
         * language will result in CommentsData and CommentList to be empty (not
         * properly filled with data). This loadCounter code is meant to force
         * commentLoader to rerender itself a few more times to properly fill the
         * post with comments and to make the "Load Comments" button disappear if
         * needed.
         */
        if (loadCounter < 2) {
          setLoadCounter(loadCounter + 1);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });

    // Checks if the last comment is loaded.
    Firestore().collection('comments')
      .where('postId', '==', postID)
      .orderBy('createdAt', 'asc')
      .limit(1)
      .get()
      .then((comment) => {
        const lastComment = comment.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (lastComment[0] !== undefined
          && commentsData[Object.keys(commentList).length - 1] !== undefined) {
          if (lastComment[0].id === commentsData[Object.keys(commentsData).length - 1].id) {
            setloadedLastComment(true);
          } else {
            setloadedLastComment(false);
          }
        }
      });

  // Don't set commentsData as dependency or it'll enter an infinite rendering cycle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingNewComment, postID, numCommentsLoaded, loadedLastComment, loadCounter, forceRerender]);

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
      /* post contains the information from the post document. get()
       pulls the likedBy field. Using Firestore map syntax, we check if
       the key userID exists inside the map!
       */
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

function LoadCommentButton({
  loadedLastComment, noComments, setNumCommentsLoaded, numCommentsLoaded,
}) {
  const newLimitLess = numCommentsLoaded - loadAmount;
  const newLimitMore = numCommentsLoaded + loadAmount;

  /**
   * The second condition (loadedLastComment && numCommentsLoaded <= loadAmount)
   * should only be true if a post only be true if there are no more comments
   * available to load AND the user cannot load fewer comments than is allowed.
   * For example, if loadAmount is 1, and there is 1 comment available in Firestore
   * then no buttons will be displayed as the user can't request more comments and
   * there must be a minimum of 1 comment displayed (provided they exist).
   * */
  if (noComments || (loadedLastComment && numCommentsLoaded <= loadAmount)) {
    return null;
  }

  if (loadedLastComment) {
    return (
      <Button
        title="Load Fewer Comments"
        onPress={() => {
          if (newLimitLess <= 0) {
            setNumCommentsLoaded(1);
          } else {
            setNumCommentsLoaded(newLimitLess);
          }
        }}
      />
    );
  }

  if (numCommentsLoaded <= loadAmount) {
    return (
      <Button
        title="Load More Comments"
        onPress={() => {
          setNumCommentsLoaded(newLimitMore);
        }}
      />
    );
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      <Button
        title="Load Fewer Comments"
        onPress={() => {
          if (newLimitLess <= 0) {
            setNumCommentsLoaded(0);
          } else {
            setNumCommentsLoaded(newLimitLess);
          }
        }}
      />
      <Button
        title="Load More Comments"
        onPress={() => {
          setNumCommentsLoaded(newLimitMore);
        }}
      />
    </View>
  );
}

export default function Post({
  title, createdAt, date, body, attachment, id, loadingNewComment,
}) {
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [loadedLastComment, setloadedLastComment] = useState(false);
  const [noComments, setNoComments] = useState(false);
  const [numCommentsLoaded, setNumCommentsLoaded] = useState(loadAmount);
  const [isAuthor, setIsAuthor] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const userID = Firebase.auth().currentUser.uid;

  const [showMore, setShowMore] = useState(true);
  const [buttons, setButtons] = useState(true);

  const [lines, setLines] = useState(6);

  // const [showMoreComments, setShowMoreComments] = useState(false);
  // const [amount, setAmount] = useState(2);

  const onTextLayout = (e) => {
    if (e.nativeEvent.lines.length > 5) {
      setButtons(true);
    } else {
      setButtons(false);
    }
  };
  // Runs once and never again. Checks if the current user is the author of the
  // post.
  useEffect(() => {
    Firestore().collection('posts').doc(id).get()
      .then((snapshot) => {
        const postAuthor = snapshot.get('author');
        if (postAuthor === userID) {
          setIsAuthor(true);
        }
      });
  }, [id, userID]);

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
  }, [id, loading, userID, numCommentsLoaded, loadedLastComment, noComments, loadingNewComment]);

  /*
  * HasDeleted will only be true if the user fully carries through with a
  * deletion. HasDeleted will force the post to not display (on the frontend)
  * while Firestore is busy doing it's magic in the backend.
  */
  return (
    hasDeleted ? null : (
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
          <Text numberOfLines={lines} onTextLayout={onTextLayout}>
            {body}
          </Text>
          {showMore && buttons && (
          <Button
            title="Show More"
            onPress={() => {
              setLines(body.numberOfLines);
              setShowMore(false);
            }}
          />
          )}
          {!showMore && buttons && (
          <Button
            title="Hide More"
            onPress={() => {
              setLines(6);
              setShowMore(true);
            }}
          />
          )}
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
        {isAuthor ? (
          <Button
            title="Delete"
            onPress={() => {
              Alert.alert(
                'Are you sure you want to delete this post?',
                'All comments will be deleted as well. This action cannot be undone.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      setHasDeleted(true);

                      /* The comments of each post must also be deleted alongside
                      * the post. This is done through "batched writes". First
                      * create a Firestore query and get a snapshot.
                      */
                      Firestore().collection('comments')
                        .where('postId', '==', id)
                        .get()
                        .then((snapshot) => {
                          // Then create a Firestore batch.
                          const batch = Firestore().batch();

                          snapshot.forEach((doc) => {
                            // For each document within the batch that matches
                            // the each document in the snapshot, append a delete
                            batch.delete(doc.ref);
                          });

                          // Commit the batch to finalize it.
                          batch.commit();
                        });

                      Firestore().collection('posts').doc(id).delete();
                    },
                  },
                ],
                { cancelable: false },
              );
            }}
          />
        ) : null}
        <CommentLoader
          postID={id}
          loadingNewComment={loadingNewComment}
          numCommentsLoaded={numCommentsLoaded}
          setloadedLastComment={setloadedLastComment}
          loadedLastComment={loadedLastComment}
          setNoComments={setNoComments}
          noComments={noComments}
        />
        {(loadedLastComment || noComments) ? null
          : (
            <Button
              title="Load More Comments"
              onPress={() => {
                setNumCommentsLoaded(numCommentsLoaded + loadAmount);
              }}
            />
          )}
        {/* <LoadCommentButton
        loadedLastComment={loadedLastComment}
        noComments={noComments}
        setNumCommentsLoaded={setNumCommentsLoaded}
        numCommentsLoaded={numCommentsLoaded}
      /> */}
      </View>
    )
  );
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  date: PropTypes.string, // date object ?
  body: PropTypes.string.isRequired,
  attachment: PropTypes.string.isRequired,
  id: PropTypes.string,
  loadingNewComment: PropTypes.bool,
};

Post.defaultProps = {
  createdAt: '',
  date: '',
  id: '',
  loadingNewComment: false,
};

CommentLoader.propTypes = {
  postID: PropTypes.string.isRequired,
  loadingNewComment: PropTypes.bool,
  numCommentsLoaded: PropTypes.number,
  setloadedLastComment: PropTypes.func,
  loadedLastComment: PropTypes.bool,
  setNoComments: PropTypes.func,
  noComments: PropTypes.bool,
};

CommentLoader.defaultProps = {
  loadingNewComment: false,
  numCommentsLoaded: loadAmount,
  setloadedLastComment: null,
  loadedLastComment: false,
  setNoComments: null,
  noComments: false,
};

DisplayLikes.propTypes = {
  postID: PropTypes.string.isRequired,
};

LoadCommentButton.propTypes = {
  loadedLastComment: PropTypes.bool.isRequired,
  noComments: PropTypes.bool.isRequired,
  setNumCommentsLoaded: PropTypes.func.isRequired,
  numCommentsLoaded: PropTypes.number.isRequired,
};

/* CODE TO GET A NAME FROM THE USERS DOCUMENT:
  Firestore().collection('users').doc('MHnkJ88vOzY1wg6rKNYRCNwCJ8X2').get()
    .then((snapshot) => {
      console.log(snapshot.get('name'));
    });

  Where the string inside .doc() is the uid of the currentUser.
*/
