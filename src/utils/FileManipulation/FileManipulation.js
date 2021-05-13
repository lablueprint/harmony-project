import storage from '@react-native-firebase/storage';

const UploadFileToFirebase = (collection, id, localPath, fileId) => {
  const createStorageReferenceToFile = () => {
  // TODO: Move this to somewhere else

    storage().ref(`${collection}/${id}/${fileId}`);
  };

  const uploadFileToFirebase = () => {
    const storageRef = createStorageReferenceToFile();

    return storageRef.putFile(localPath);
  };

  const uploadTask = uploadFileToFirebase();
  return uploadTask;
};

export default UploadFileToFirebase;
