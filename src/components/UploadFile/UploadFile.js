/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Alert, Button, View, Platform, TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

import ImagePicker from 'react-native-image-picker';

import UploadFileToFirebase from '../../utils/FileManipulation';

// TODO: Move this to somewhere else
// Added to prevent Base64 data from being added to media files
// Greatly increases uploading speed

const UploadFile = (props) => {
  const [localPath, setLocalPath] = useState('');
  const [name, setName] = useState('');

  const {
    setChoose, setMonitor, postId, collection, mediaType, inputName, upload,
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
    const fileData = { url: '', path: '' };
    uploadTask.on('state_changed', (snapshot) => {
      switch (snapshot.state) {
        case 'running':
          break;
        case 'success':
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            fileData.url = downloadURL;
            console.log(`${mediaType} upload succeeded! ${downloadURL}`);
          });
          fileData.path = snapshot.ref.fullPath;
          break;
        default:
          break;
      }
    });

    return Promise.resolve(fileData);
  };

  const chooseFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, (imagePickerResponse) => {
      const { didCancel, error } = imagePickerResponse;
      if (didCancel) {
        Alert.alert('Upload canceled');
      } else if (error) {
        console.log('An error occurred: ', imagePickerResponse.error);
      } else {
        setLocalPath(getFileLocalPath(imagePickerResponse));
        setChoose(true);
      }
    });
  };

  // upload file
  useEffect(() => {
    if (upload) {
      if (inputName && !name) {
        Alert.alert('Please name your file.');
      } else {
        const fileName = inputName ? name : Math.random()
          .toString(36)
          .slice(3);

        const uploadTask = UploadFileToFirebase(collection, postId, localPath, fileName);
        setMonitor(monitorUpload(uploadTask));
      }
    }
  }, [upload]);

  return (
    <View>
      {inputName && (
      <TextInput
        placeholder="Name"
        fontSize={14}
        maxLength={50}
        onChangeText={setName}
        value={name}
      />
      )}
      <Button
        title="Choose File"
        onPress={chooseFile}
      />
    </View>
  );
};

// props:
// - postId: String, Required - Id of document to add as a record of upload (in Firestore)
// - collection: String, Optional - Collection to add to as a record of the upload
UploadFile.propTypes = {
  setChoose: PropTypes.func.isRequired,
  setMonitor: PropTypes.func.isRequired,
  upload: PropTypes.bool.isRequired,
  inputName: PropTypes.bool,
  postId: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
};

UploadFile.defaultProps = {
  inputName: false,
};

/*
Usage:
  <UploadFile
    docId='213jSD90xasdS'
    collection='recordings'
   />
*/

export default UploadFile;
