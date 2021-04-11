import React, { useState } from 'react';
import {
  View, Button, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import UploadFile from '../UploadFile/UploadFile';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    flex: 1,
  },
});

export default function NewPostScreen({ navigation }) {
  // const [title, setTitle] = useState('');
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const mainScreenLoadStatus = navigation.getParam('currentLoad');
  // const reloadMainScreen = navigation.getParam('setLoad');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');
  const userID = navigation.getParam('userID');
  const postID = navigation.getParam('postID');
  const displayTitle = navigation.getParam('displayTitle', true);
  const setTitle = navigation.getParam('setTitle');
  const title = navigation.getParam('title', '');
  const displayUpload = navigation.getParam('displayUpload', true);
  const collection = navigation.getParam('collection');
  const buttonTitle = navigation.getParam('buttonTitle', 'Submit');
  const handleSubmit = navigation.getParam('handleSubmit');

  return (
    <View style={styles.container}>
      {/* {errorMessage && <Text>{errorMessage}</Text>} */}
      <View style={styles.tweetContainer}>
        {displayTitle && (
        <TextInput
          placeholder="Topic"
          fontSize={24}
          onChangeText={setTitle}
          value={title}
        />
        )}
        <TextInput
          autoFocus
          placeholder="What's on your mind?"
          multiline
          value={body}
          onChangeText={(content) => setBody(content)}
        />
        {displayUpload && (
        <UploadFile
          setAttachment={setAttachment}
          userId={userID}
          postId={postID}
          collection={collection}
        />
        )}
      </View>
      {/* {loading && <ActivityIndicator />} */}
      <Button
        // disabled={loading}
        title={buttonTitle}
        onPress={() => { handleSubmit(userID, postID, body, attachment); navigation.goBack(); }}
      />
    </View>
  );
}

NewPostScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

NewPostScreen.navigationOptions = {
  title: 'New Post',
};
