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

export default function NewPostScreen({ route, navigation }) {
  const {
    userID,
    postID,
    collection,
    title1,
    handleSubmit,
  } = route.params;

  const displayTitle = true;
  const displayUpload = true;
  const buttonTitle = 'Submit';
  const mediaType = 'video';

  const [title, setTitle] = useState(title1);
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');

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
          mediaType={mediaType}
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
  route: PropTypes.shape({
    params: PropTypes.func.isRequired,
  }).isRequired,
};

NewPostScreen.navigationOptions = {
  title: 'New Post',
};
