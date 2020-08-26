import React from 'react';
import Video from 'react-native-video';
import {
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'black',
  },
});

export default function EvalVideo({ videoLink, videoPlayer }) {
  return (
    <Video
      source={{
        uri: videoLink,
      }}
      ref={videoPlayer}
      controls
      style={styles.video}
    />
  );
}

EvalVideo.propTypes = {
  videoPlayer: PropTypes.element.isRequired,
  videoLink: PropTypes.string.isRequired,
};
