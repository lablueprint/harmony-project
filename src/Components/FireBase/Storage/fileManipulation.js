import { Platform } from 'react-native';

import { FireBaseStorage } from './api';

const getFileLocalPath = response => {
  const { path, uri } = response;
  return Platform.OS === 'android' ? path : uri;
};

const createStorageReferenceToFile = response => {
  const { fileName } = response;
  // TODO: Create random strings for filenames

  const id = Math.random()
    .toString(36)
    .slice(3);
  // const id = generateRandomString();
  // return FireBaseStorage.ref(`images/${id}-${fileName}`);
  return FireBaseStorage.ref(`images/${id}-${fileName}`);
};

export const uploadFileToFireBase = response => {
  const fileSource = getFileLocalPath(response);
  const storageRef = createStorageReferenceToFile(response);
  return storageRef.putFile(fileSource);
};