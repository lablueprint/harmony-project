/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import {
  StyleSheet, View, Text, Image, Dimensions, Button,
} from 'react-native';
import PropTypes from 'prop-types';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import ClassroomContext from '../../context/ClassroomContext';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#F6F6F6',
    height: '100%',
  },
});

export default function FilePreviewScreen({ navigation, route }) {
  const {
    fileType, fileURL, fileName, classroom,
  } = route.params; // fileType = 'Video', 'Photo', or 'File'
  const [dimensions, setDimensions] = useState({ window });

  // video controls
  const [pause, setPause] = useState(false);
  const videoPlayer = useRef(null);

  const {
    classroom: selectedClassroom,
  } = useContext(ClassroomContext);

  // window dimension checking
  const onChange = ({ window }) => {
    setDimensions({ window });
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChange);
    return () => {
      Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    if (selectedClassroom !== classroom) {
      navigation.navigate('Library');
    }
  }, [selectedClassroom]);

  if (fileType !== 'Video' && fileType !== 'Photo' && fileType !== 'File') {
    console.log('Invalid file type.');
    console.log(`Filetype = ${fileType}`);
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>
        {fileName}
      </Text>
      {fileType === 'Video' && (
      <Video
        source={{ uri: fileURL }}
        style={{
          aspectRatio: 1,
          width: '100%',
        }}
        controls
        resizeMode="contain"
        paused={pause}
        ref={videoPlayer}
        onSeek={() => { setPause(!pause); }}
      />
      )}
      {fileType === 'Photo' && (
      <Image
        style={{ width: '100%', height: '100%' }}
        source={{ uri: fileURL }}
      />
      )}
      {fileType === 'File' && (
      <Pdf
        style={{
          // intentionally use inline styles in the case of window resizing
          flex: 1,
          width: dimensions.window.width,
          height: dimensions.window.height,
        }}
        source={{ uri: fileURL }}
        onError={(error) => {
          console.log(error);
        }}
      />
      )}
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

FilePreviewScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,

    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object.isRequired,
  }).isRequired,
};
