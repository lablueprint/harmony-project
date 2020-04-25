import React from 'react';
import {
  Alert, Button, View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import ImagePicker from 'react-native-image-picker';
import Firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { UploadFileToFirebase } from '../../utils/FileManipulation'

// TODO: Move this to somewhere else
// Added to prevent Base64 data from being added to media files
// Greatly increases uploading speed
const imagePickerOptions = {
  mediaType: 'mixed',
  noData: true,
};

const UploadFile = (props) => {
  const {
    user, classroom, path, collection, style,
  } = props;

  const getFileLocalPath = (imagePickerResponse) => {
    const { path, uri } = imagePickerResponse;
    return Platform.OS === 'android' ? path : uri;
  };

  // const createStorageReferenceToFile = (imagePickerResponse) => {
  //   const { fileName } = imagePickerResponse;

  //   // TODO: Move this to somewhere else
  //   const id = Math.random()
  //     .toString(36)
  //     .slice(3);

  //   return storage().ref(`${path}/${id}-${fileName}`);
  // };

  // const uploadFileToFirebase = (imagePickerResponse) => {
  //   const fileSource = getFileLocalPath(imagePickerResponse);
  //   const storageRef = createStorageReferenceToFile(imagePickerResponse);

  //   return storageRef.putFile(fileSource);
  // };

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

        let uploadTask = UploadFileToFirebase(props.collection, props.user.uid, localPath);
        monitorUpload(uploadTask);
      }
    });
  };

  return (
    <View>
      <Button
        title="Upload File"
        onPress={uploadFile}
        style={style}
      />
    </View>
  );
};

// props:
// - user: Object - User object
// - classroom: Object - with field id: int
// - path: String - Path to media in storage
// - collection: String, Optional - Collection to add to as a record of the upload
UploadFile.propTypes = {
  user: PropTypes.shape({ uid: PropTypes.string }).isRequired,
  classroom: PropTypes.shape({ id: PropTypes.string }).isRequired,
  path: PropTypes.string.isRequired,
  collection: PropTypes.string,
  style: PropTypes.object,
};

UploadFile.defaultProps = {
  collection: '',
};

/*
Usage:
  <UploadFile
    user={user}
    classroom={{id: 'efiufbinw'}}
    path='recordings'
    collection='recordings'
    style={styles.textInput}
   />
*/

export default UploadFile;
