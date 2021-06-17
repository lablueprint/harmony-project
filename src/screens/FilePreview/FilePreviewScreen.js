/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, {
  useState, useEffect, useRef, useContext,
} from 'react';
import {
  StyleSheet, View, Text, Image, Dimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import Pdf from 'react-native-pdf';
import Video from 'react-native-video';
import ClassroomContext from '../../context/ClassroomContext';
import { fileTypes } from '../../components';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#F6F6F6',
    height: '100%',
  },
  headerContainer: {
    height: 50,
    width: '100%',
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderColor: '#BDBDBD',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 45, // scuffed????
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
  },
  headerText: {
    width: '70%',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 15,
    width: 20,
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

  if (fileType !== fileTypes.video && fileType !== fileTypes.photo && fileType !== fileTypes.file) {
    console.log('Invalid file type.');
    console.log(`Filetype = ${fileType}`);
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.backButton}>
          <Icon
            name="arrow-left"
            type="feather"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text style={styles.headerText} numberOfLines={1}>
          {fileName}
        </Text>
      </View>
      {fileType === fileTypes.video && (
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
      {fileType === fileTypes.photo && (
      <View style={{ flex: 1 }}>
        <Image
          resizeMode="contain"
          style={{ width: 'auto', height: '100%' }}
          source={{ uri: fileURL }}
        />
      </View>
      )}
      {fileType === fileTypes.file && (
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
