/* eslint-disable no-console */

function toPreview(navigation, fileType, file) {
  file.getDownloadURL()
    .then((url) => {
      navigation.navigate('FilePreview', { fileType, fileURL: url, fileName: file.name });
    })
    .catch((e) => {
      console.log(e.message);
    });
}

export default toPreview;
