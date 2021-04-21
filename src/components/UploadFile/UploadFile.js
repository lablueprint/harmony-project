import React from 'react';
import {
  Alert, Button, View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import ImagePicker from 'react-native-image-picker';

import UploadFileToFirebase from '../../utils/FileManipulation';

// TODO: Move this to somewhere else
// Added to prevent Base64 data from being added to media files
// Greatly increases uploading speed

const UploadFile = (props) => {
  const {
    setPath, setAttachment, setReady, postId, collection, mediaType,
  } = props;

  const imagePickerOptions = {
    mediaType, // 'photo' or 'video'
    noData: true,
  };

  /* Creating New Function to create new submissions */
  const getFileLocalPath = (imagePickerResponse) => {
    const { path, uri } = imagePickerResponse;
    return Platform.OS === 'android' ? path : uri;
  };

  const monitorUpload = (uploadTask) => {
    uploadTask.on('state_changed', (snapshot) => {
      switch (snapshot.state) {
        case 'running':
          break;
        case 'success':
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            if (setAttachment) {
              setAttachment(downloadURL);
            }
            Alert.alert(`${mediaType} upload succeeded! ${downloadURL}`);
          });
          if (setPath) {
            setPath(snapshot.ref.fullPath);
          }
          setReady(true);
          break;
        default:
          break;
      }
    });
  };

  const uploadFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, (imagePickerResponse) => {
      const { didCancel, error } = imagePickerResponse;
      setReady(false);
      if (didCancel) {
        setReady(true);
        Alert.alert('Post canceled');
      } else if (error) {
        setReady(true);
        Alert.alert('An error occurred: ', imagePickerResponse.error);
      } else {
        const localPath = getFileLocalPath(imagePickerResponse);

        const uploadTask = UploadFileToFirebase(collection, postId, localPath);
        monitorUpload(uploadTask);
      }
    });
  };

  return (
    <View>
      <Button
        title="Upload File"
        onPress={uploadFile}
      />
    </View>
  );
};

// props:
// - postId: String, Required - Id of document to add as a record of upload (in Firestore)
// - collection: String, Optional - Collection to add to as a record of the upload
UploadFile.propTypes = {
  setPath: PropTypes.func,
  setAttachment: PropTypes.func,
  setReady: PropTypes.func,
  postId: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
};

UploadFile.defaultProps = {
  setPath: null,
  setAttachment: null,
  setReady: null,
};

/*
Usage:
  <UploadFile
    docId='213jSD90xasdS'
    collection='recordings'
   />
*/

export default UploadFile;
