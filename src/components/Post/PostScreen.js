import React, { useState, useEffect } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import Firestore from '@react-native-firebase/firestore';
import Post from './Post';

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

/* Each time there is a nextPage or prevPage request, the app will make
pageSize + 2 document requests. The extra 2 document requests are used to
check if the user is currently on the first or last post, disabling the
previous and next buttons respectively.
*/
const pageSize = 2;

function nextPage(last) {
  return (
    Firestore().collection('posts')
      .orderBy('createdAt', 'desc')
      // Since it's ordered by createdAt must use startAfter based off createdAt
      .startAfter(last.createdAt)
      .limit(pageSize)
      .get()
  );
}

function prevPage(first) {
  return (
    Firestore().collection('posts')
    // Firestore does NOT have limitToLast, only Firebase does. Thus instead of
    // using endBefore() and limitToLast, we reverse the order and use startAfter
      .orderBy('createdAt', 'asc')
      .startAfter(first.createdAt)
      .limit(pageSize)
      .get()
  );
}

function getFirstPost() {
  return (
    Firestore().collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()
  );
}

function getLastPost() {
  return (
    Firestore().collection('posts')
      .orderBy('createdAt', 'asc')
      .limit(1)
      .get()
  );
}

export default function PostsScreen({ navigation }) {
  /* displayData is what is altered behind the scenes while postsList is the
  final array of posts to be rendered on screen. Currently can't merge their
  roles because the second effect hook is built to change whenever displayData
  changes --> It will enter an infinite loop of rerenders as the second effect
  hook actually changes displayData when run.
  */
  const [errorMessage, setErrorMessage] = useState(null);
  const [postsList, setPostsList] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [isLastPage, setIsLastPage] = useState(false);


  // Used only on inital mounting and never again. Sets up first set of posts.
  useEffect(() => {
    Firestore().collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(pageSize)
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setDisplayData(posts);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, []);

  // Runs whenever displayData changes, component mounts, or navigation is
  // triggered
  useEffect(() => {
    // Ensures that this doesn't run if the first useEffect hasn't run yet OR
    // if there are 0 posts
    if (!(displayData.length === 0)) {
    // Check if user is on first page
      getFirstPost()
        .then((snapshot) => {
          const firstPost = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          if (firstPost[0].id === displayData[0].id) {
            setIsFirstPage(true);
          } else {
            setIsFirstPage(false);
          }
        });

      // Check if user is on last page
      getLastPost()
        .then((snapshot) => {
          const lastPost = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          if (lastPost[0].id === displayData[displayData.length - 1].id) {
            setIsLastPage(true);
          } else {
            setIsLastPage(false);
          }
        });

      // Handles setting up postsList to be rendered
      setPostsList(displayData.map((post) => {
        const date = post.createdAt.toDate();
        return (
          <View style={styles.container} key={post.id}>
            <Post
              id={post.id}
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
                navigation.navigate('NewComment', { id: post.id });
              }}
            />
          </View>
        );
      }));
    }
  }, [displayData, navigation]);

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
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          { isFirstPage ? null
            : (
              <Button
                title="Previous"
                onPress={() => {
                  prevPage(displayData[0])
                    .then((snapshot) => {
                      const prevPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                      setDisplayData(prevPosts);
                    });
                }}
              />
            )}
          { isLastPage ? null
            : (
              <Button
                title="Next"
                onPress={() => {
                  nextPage(displayData[displayData.length - 1])
                    .then((snapshot) => {
                      const nextPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                      setDisplayData(nextPosts);
                    });
                }}
              />
            )}
        </View>
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
