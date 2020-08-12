import React, { useState } from 'react';
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
              id = {post.id}
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

/*I think my problem lies in that I have a difficult time saving the
last document requested so that when the user goes to the next page,
the function can do a query based off the last document. In other words,
I'm having trouble understanding exactly how to save states/pass them etc

Side Note: It seemed like the attempt I made in the past where I had 
PostScreen hold the previous state didn't exactly work because I set it up 
to use a hook where it was set = to useState(null) or useState(). Thus,
everytime the app reran the component, the "previous state" was lost because
it was reset to null/nothing. Not fully sure if that was the case, but it
never ended up working. I tried to use EffectHooks to fix it but I never
figured it out. I saved a version of my code where I attempted Effect Hooks
+ used console logs to test it out. I have a screenshot of the console log
output as well once I accessed the posts page. If you want either/both lmk!

Current Thought Process: I was thinking that I can pull everything that's
currently inside the PostScreen component and place it into a new
"PostLoader" component. The PostLoader component would have a hook to save
the state of the previous document and have a default value of the FIRST 
post in firestore (this is what my friend told me I should prolly do).
The PostLoader component would be used inside the new PostScreen component
(after setting up the hook and all.) After the PostLoader component, then 
I would call a new Pagination component. This component would depend on
the saved document state from the hook and make a compound query to request
the next batch of posts to be displayed. I would likely have to pull
some of the hooks inside PostLoader out as well and make them shared so that
both PostLoader and Pagination can affect the PreviousDocument and the list
of posts to be displayed. My worry with this, though, is that if what
I described in the above paragraph is actually what's happening, then this
may not work either as the state of "PreviousDocument" might be reset to
it's default (AKA the first post) whenever the app reruns it.

*/