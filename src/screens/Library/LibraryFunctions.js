/* eslint-disable no-console */

function toPreview(navigation, fileType, file, classroom) {
  file.getDownloadURL()
    .then((url) => {
      navigation.navigate('FilePreview', {
        fileType, fileURL: url, fileName: file.name, classroom,
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}

export default toPreview;
