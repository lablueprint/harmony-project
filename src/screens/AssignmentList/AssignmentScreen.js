// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Firebase from '@react-native-firebase/app';
import {
  // eslint-disable-next-line no-unused-vars
  View, Text, StyleSheet,
} from 'react-native';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import Post from '../../components/Post/Post';

const styles = StyleSheet.create({
  fab: {
    position: 'relative',
    zIndex: -1,
    color: 'white',
    width: '32%',
    backgroundColor: '#8e4f97',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 140,
  },
  buttonText_1: {
    color: 'grey',
    fontSize: 13,
    fontWeight: '500',
  },
  buttonText_2: {
    color: '#323232',
    fontSize: 16,
  },
  buttonText_3: {
    color: '#8e4f97',
    fontSize: 16,
    fontWeight: '500',
  },
  button_1: {
    backgroundColor: 'transparent',
    borderRadius: 40,
    width: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  button_2: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 31,
    width: 205,
    paddingBottom: 5,
    borderColor: '#8e4f97',
    borderWidth: 0.5,
    alignSelf: 'center',
    marginLeft: 12,
  },
  button_3: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 35,
    width: 175,
    paddingBottom: 7,
    borderColor: '#8e4f97',
    borderWidth: 0.5,
    marginLeft: 120,
    marginTop: 10,

  },
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: '#F8F7F7',

  },
  buttons:
 {
   alignSelf: 'center',
   color: 'blue',
   paddingLeft: 35,
   fontSize: 15,
 },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default function AssignmentScreen({ route, navigation }) {
  const {
    post,
    isTeacher,
    hasBeenEval,
    hasBeenSubmitted,
    // eslint-disable-next-line no-unused-vars
    loadingNewComment,
    // eslint-disable-next-line no-unused-vars
    setLoadingNewComment,
    rerender,
    setRerender,
    createSubmission,
  } = route.params;
  const { uid } = Firebase.auth().currentUser;
  const date = post.createdAt.toDate();

  return (
    <ScrollView style={styles.container} key={post.id}>

      <View style={styles.buttonsContainer}>
        {!isTeacher && !hasBeenEval && hasBeenSubmitted
              && (
                <>
                  <Text
                    style={styles.buttons}
                    onPress={() => {
                      navigation.navigate('NewPost', {
                        userID: uid,
                        postID: post.id,
                        collection: 'submissions',
                        title1: post.title,
                        handleSubmit: createSubmission,
                      });
                    }}
                  >
                    Upload Submission
                  </Text>
                  {/* TODO: View submissions */}
                  {/* <Text
                    style={styles.buttons}
                    onPress={() => {

                    }}
                  >
                    View Submission
                  </Text> */}

                </>
              )}
        {!isTeacher && !hasBeenEval && !hasBeenSubmitted
              && (
                <>
                  <Button
                    buttonStyle={styles.button_3}
                    titleStyle={styles.buttonText_3}
                    onPress={() => {
                      navigation.navigate('NewPost', {
                        userID: uid,
                        postID: post.id,
                        collection: 'recordings',
                        title1: `${post.title} Submission`,
                        handleSubmit: createSubmission,
                      });
                    }}
                    title="Upload Submission"
                  />
                </>
              )}
        {!isTeacher && hasBeenEval
            && (
              <>

                <Button
                  buttonStyle={styles.button_3}
                  titleStyle={styles.buttonText_3}
                  onPress={() => {
                    navigation.navigate('Evaluation', {
                      uid: hasBeenEval,
                    });
                  }}
                  title="View Evaluation"
                />

              </>
            )}
        {isTeacher
            && (
              <>
                <Button
                  buttonStyle={styles.button_3}
                  titleStyle={styles.buttonText_3}
                  onPress={() => {
                    navigation.navigate('Submissions', {
                      a: post.id,
                      c: post.classroomID,
                    });
                  }}
                  title="View Submissions"
                />
              </>
            )}
      </View>
      <Post
        id={post.id}
        name={post.username}
        title={post.title}
        createdAt={date.toTimeString()}
        date={date.toDateString()}
        attachments={post.attachments}
        collection="assignments"
        body={post.body}
        pin={post.doPin}
        rerender={rerender}
        setRerender={setRerender}
      >
        {post.body}
      </Post>
    </ScrollView>
  );
}

AssignmentScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,

  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};
