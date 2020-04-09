/* import React, { useState, useEffect } from 'react';
import {
  Text, View, SafeAreaView, ScrollView, Button, FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import Post from './Post';

export default function PostScreen({ navigation }) {
  const ref = firestore().collection('posts');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => ref.onSnapshot((querySnapshot) => {
    const list = [];
    querySnapshot.forEach((doc) => {
      const { title, body } = doc.data();
      list.push({
        id: doc.id,
        title,
        body,
      });
    });

    setPosts(list);

    if (loading) {
      setLoading(false);
    }
  }), [loading, ref]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text> Posts </Text>
          <FlatList
            style={{ flex: 1 }}
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Post {...item} />}
          />
        </View>
        <Button
          title="Make a Post"
          onPress={() => {
            navigation.navigate('NewPost');
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

PostScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
}; */

import React, { useState } from 'react';
import {
  Text, Button, View, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
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

  firestore().collection('posts')
    .get()
    .then((snapshot) => {
      const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPostsList(posts.sort((a, b) => {
        // May need to change "time" to "createdAt" and compare with that
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
          <Post
            key={post.id}
            name={post.username}
            title={post.title}
            createdAt={date.toTimeString()}
            date={date.toDateString()}
          >
            {post.body}
          </Post>
        );
      }));
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.welcomeMessage}>Posts!</Text>
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
