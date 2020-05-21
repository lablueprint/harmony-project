import React, { useState } from 'react';
import {
  Button, Image, StatusBar, View,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import UploadFileToFirebase from '../Firebase/Storage';

// TODO: Move this to somewhere else
// Added to prevent Base64 data from being added to media files
// Greatly increases uploading speed
const imagePickerOptions = {
  mediaType: 'mixed',
  noData: true,
};

const UploadFile = () => {
  const [imageURI, setImageURI] = useState(null);

  const uploadFile = () => {
    ImagePicker.launchImageLibrary(imagePickerOptions, (imagePickerResponse) => {
      const { didCancel, error } = imagePickerResponse;

      if (didCancel) {
        alert('Post canceled');
      } else if (error) {
        alert('An error occurred: ', imagePickerResponse.error);
      } else {
        setImageURI({ uri: imagePickerResponse.uri });
        Promise.resolve(UploadFileToFirebase(imagePickerResponse));
      }
    });
  };

  return (
    <View>
      <StatusBar barStyle="dark-content" />
      <Button title="New Post" onPress={uploadFile} color="green" />

      {imageURI && <Image source={imageURI} />}
    </View>
  );
};

export default UploadFile;