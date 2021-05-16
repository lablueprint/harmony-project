import React, { useState } from 'react';
import {
  View, Button, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import UploadFile from '../UploadFile/UploadFile';
import Firebase from '@react-native-firebase/app';

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
  // const mainScreenLoadStatus = navigation.params?currentLoad');
  // const reloadMainScreen = navigation.params?setLoad');
  const [monitorUpload, setMonitor] = useState();
  const [choseFile, setChoose] = useState();
  const [upload, setUpload] = useState(false);
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState('');
  const { uid } = Firebase.auth().currentUser;
  const postID = navigation.params?.postID;
  const displayTitle = navigation.params?.displayTitle ?? true;
  const setTitle = navigation.params?.setTitle;
  const title = navigation.params?.title ?? '';
  const displayUpload = navigation.params?.displayUpload ?? true;
  const collection = navigation.params?.collection;
  const buttonTitle = navigation.params?.buttonTitle ?? 'Submit';
  const [showLoading, setShowLoading] = useState(false);


  async function handleSubmit()
  {
    
  }

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
          setMonitor={setMonitor}
          setChoose={setChoose}
          upload={upload}
          postId={uid}
          collection="users/uploads"
          mediaType="photo"
        />
        )}
      </View>
      {/* {loading && <ActivityIndicator />} */}
      <Button
        // disabled={loading}
        title={buttonTitle}
        onPress={() => { handleSubmit(uid, postID, body, attachment); navigation.goBack(); }}
      />
    </View>
  );
}

NewPostScreen.propTypes = {
  navigation: PropTypes.shape({
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
