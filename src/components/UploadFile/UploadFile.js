import React from 'react';
import {
  Alert, Button, View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import ImagePicker from 'react-native-image-picker';

import UploadFileToFirebase from '../../utils/FileManipulation'

// TODO: Move this to somewhere else
// Added to prevent Base64 data from being added to media files
// Greatly increases uploading speed
const imagePickerOptions = {
  mediaType: 'mixed',
  noData: true,
};

const UploadFile = (props) => {
  const {
    user, collection,
  } = props;

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
            Alert.alert('Upload succeeded!' + downloadURL);
          });
          break;
        default:
          break;
      }
    });
  };

  const uploadFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, (imagePickerResponse) => {
      const { didCancel, error } = imagePickerResponse;

      if (didCancel) {
        alert('Post canceled');
      } else if (error) {
        alert('An error occurred: ', imagePickerResponse.error);
      } else {
        const localPath = getFileLocalPath(imagePickerResponse);

        let uploadTask = UploadFileToFirebase(collection, user.uid, localPath);
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
// - user: Object - User object
// - collection: String, Optional - Collection to add to as a record of the upload
UploadFile.propTypes = {
  user: PropTypes.shape({ uid: PropTypes.string }).isRequired,
  collection: PropTypes.string.isRequired,
};

/*
Usage:
  <UploadFile
    user={user}
    collection='recordings'
   />
*/

export default UploadFile;
