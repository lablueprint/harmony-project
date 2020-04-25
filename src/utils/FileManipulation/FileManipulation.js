import storage from '@react-native-firebase/storage';

const UploadFileToFirebase = (collection, id, localPath) => {

	const createStorageReferenceToFile = () => {
    // TODO: Move this to somewhere else
    const image_id = Math.random()
      .toString(36)
      .slice(3);

    return storage().ref(`${collection}/${id}/${image_id}`);
  };

  const uploadFileToFirebase = () => {
    const storageRef = createStorageReferenceToFile();

    return storageRef.putFile(localPath);
  };

	const uploadTask = uploadFileToFirebase();
	return uploadTask
}

export { UploadFileToFirebase }
